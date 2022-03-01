import { Handler } from '@netlify/functions'
import { createActivity, getAll, IActivityData } from '../utils/activityClient';

const handler: Handler = async (event, context) => {

  let choice = event.queryStringParameters?.choice
  if (!(choice === "safe" || choice === "risky")) {
    return {
      statusCode: 422 ,
      body: JSON.stringify({err: "You may only choose 'safe' or 'risky'"}, null, 2)
    }
  }

  const prevRounds = await getAll();
  const lastRound = await prevRounds.sort((a,b) => b.round - a.round)?.[0]

  const curTotal = lastRound?.total || 0
  const curRound = lastRound?.round || 0

  const roundDelta = choice === "safe" ? 5 : 10 // todo implement risky decision

  let data: IActivityData = {
    choice: String(choice),
    round: curRound + 1,
    total: curTotal + roundDelta
  }

  await createActivity(data)

  return {
    statusCode: 200,
    body: JSON.stringify(data, null, 2)
  }
}

export { handler }
