import * as AWS from 'aws-sdk';
import type { APIGatewayProxyHandler } from 'aws-lambda'
import { v4 as uuidv4 } from 'uuid';

const handler: APIGatewayProxyHandler = async (event) => {
  // collect constants passed from stack as process env variables
  const tableName = process.env.TABLE_NAME ?? '';
  const primaryKey = process.env.PRIMARY_KEY ?? '';

  // create database client
  const database = new AWS.DynamoDB.DocumentClient();

  // verify presence of request body
  if (event.body === null) {
    return {
      body: '',
      statusCode: 400, 
    };
  }

  // try to parse otherwise end with bad request
  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      body: '',
    };
  }

  // set primary key for item
  payload[primaryKey] = uuidv4();

  // attempt inserting to database otherwise end with bad request
  try {
    await database.put({
      TableName: tableName,
      Item: payload,
    }).promise();
    return {
      body: '',
      statusCode: 201,
    };
  } catch {
    return {
      body: '',
      statusCode: 400,
    };
  }
};

export { handler };