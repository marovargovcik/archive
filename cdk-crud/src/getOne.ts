import * as AWS from 'aws-sdk';
import type { APIGatewayProxyHandler } from 'aws-lambda'

const handler: APIGatewayProxyHandler = async (event) => {
  // collect constants passed from stack as process env variables
  const tableName = process.env.TABLE_NAME ?? '';
  const primaryKey = process.env.PRIMARY_KEY ?? '';

  // create database client
  const database = new AWS.DynamoDB.DocumentClient();

  // get id as url parameter
  const itemId = event.pathParameters?.id;
  if (itemId === '' || itemId === undefined) {
    return {
      body: '',
      statusCode: 400,
    };
  }

  // try to get and return an item otherwise return not found http status
  try {
    const response = await database.get({
      TableName: tableName,
      Key: {
        [primaryKey]: itemId,
      },
    }).promise();
    if (response.Item) {
      return {
        body: JSON.stringify(response.Item),
        statusCode: 200,
      };
    }
    return {
      body: '',
      statusCode: 404,
    };
  } catch {
    return {
      body: '',
      statusCode: 500,
    };
  }
};

export { handler };