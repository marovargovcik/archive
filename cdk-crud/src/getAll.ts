import * as AWS from 'aws-sdk';
import type { APIGatewayProxyHandler } from 'aws-lambda'

const handler: APIGatewayProxyHandler = async () => {
  // collect constants passed from stack as process env variables
  const tableName = process.env.TABLE_NAME ?? '';

  // create database client
  const database = new AWS.DynamoDB.DocumentClient();

  // attempt reading from database otherwise end with bad request
  try {
    const response = await database.scan({
      TableName: tableName,
    }).promise();
    return {
      body: JSON.stringify(response.Items ?? []),
      statusCode: 200,
    };
  } catch {
    return {
      body: '',
      statusCode: 500,
    };
  }
};

export { handler };