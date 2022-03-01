import { Handler } from '@netlify/functions'
import { createActivity, getAll, getAllData, IActivityData } from '../utils/activityClient';

const roundRiskValue: Record<number,number> = {
  1: -15,
  2: -10,
  3: -5,
  4: 0,
  5: 5,
  6: 10,
  7: 15,
  8: 20,
  9: 25,
  10: 30,
  11: 35,
  12: 40,
  13: 45,
  14: 50,
  15: -50,
  16: 55,
  17: 60,
  18: -60,
  19: 65,
  20: 70,
  21: 75,
  22: 80
}

const handler: Handler = async (event, context) => {

  let choice = event.queryStringParameters?.choice
  if (!(choice === "safe" || choice === "risky")) {
    return {
      statusCode: 422 ,
      body: JSON.stringify({err: "You may only choose 'safe' or 'risky'"}, null, 2)
    }
  }

  const prevRounds = await getAllData();
  const lastRound = await prevRounds.sort((a,b) => b.round - a.round)?.[0]

  const curTotal = lastRound?.total || 0
  const curRound = lastRound?.round || 0

  const delta = choice === "safe" ? 5 : roundRiskValue[curRound] // todo implement risky decision

  const data: IActivityData = {
    round: curRound + 1,
    choice: String(choice),
    delta: delta,
    total: curTotal + delta
  }

  await createActivity(data)

  const allRounds = [...prevRounds, data]

  return {
    statusCode: 200,
    body: JSON.stringify(allRounds, null, 2)
  }
}


export { handler }
