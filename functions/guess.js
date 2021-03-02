exports.handler = async (event) => {
  let limit = 68
  let { amount } = event.queryStringParameters

  let isValid = +amount < limit

  let result = { isValid }

  if (!isValid) {
    result.limit = limit
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result, null, 2),
  }
}
