import { Handler } from '@netlify/functions'
import { truncateData } from '../utils/activityClient';

const handler: Handler = async (event, context) => {

  await truncateData();

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "All Gone" })
  }
}

export { handler }
