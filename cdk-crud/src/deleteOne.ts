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
  if (itemId === '' && itemId === undefined) {
    return {
      body: '',
      statusCode: 400,
    };
  }

  // attempt to delete otherwise return bad request
  try {
    await database.delete({
      TableName: tableName,
      Key: {
        [primaryKey]: itemId,
      }
    }).promise();
    return {
      body: '',
      statusCode: 204,
    };
  } catch {
    return {
      body: '',
      statusCode: 400,
    };
  }
};

export { handler };