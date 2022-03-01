import { Handler } from '@netlify/functions'
import { getAllData } from '../utils/activityClient';

const handler: Handler = async (event, context) => {

  const records = await getAllData();

  return {
    statusCode: 200,
    body: JSON.stringify(records, null, 2)
  }
}

export { handler }
