import * as path from 'path'

import * as cdk from 'aws-cdk-lib';
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';
import type { IResource } from 'aws-cdk-lib/aws-apigateway';
import * as dynamoDb from 'aws-cdk-lib/aws-dynamodb';
import { Runtime as LambdaRuntime } from 'aws-cdk-lib/aws-lambda';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';

const addCorsOptions = (resource: IResource) => resource.addMethod('OPTIONS', new apiGateway.MockIntegration({
  integrationResponses: [{
    statusCode: '200',
    responseParameters: {
      'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
      'method.response.header.Access-Control-Allow-Origin': "'*'",
      'method.response.header.Access-Control-Allow-Credentials': "'false'",
      'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
    },
  }],
  passthroughBehavior: apiGateway.PassthroughBehavior.NEVER,
  requestTemplates: {
    "application/json": "{\"statusCode\": 200}"
  },
}), {
  methodResponses: [{
    statusCode: '200',
    responseParameters: {
      'method.response.header.Access-Control-Allow-Headers': true,
      'method.response.header.Access-Control-Allow-Methods': true,
      'method.response.header.Access-Control-Allow-Credentials': true,
      'method.response.header.Access-Control-Allow-Origin': true,
    },
  }]
});

class CrudStack extends cdk.Stack {
  constructor(app: cdk.App, id: string) {
    super(app, id);

    const dynamoTable = new dynamoDb.Table(this, 'items', {
      partitionKey: {
        name: 'id',
        type: dynamoDb.AttributeType.STRING
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableName: 'items',
    });

    const commonLambdaProps: lambda.NodejsFunctionProps = {
      bundling: {
        externalModules: [
          'aws-sdk',
        ],
      },
      depsLockFilePath: path.join(__dirname, 'src', 'package-lock.json'),
      environment: {
        PRIMARY_KEY: 'id',
        TABLE_NAME: dynamoTable.tableName,
      },
      runtime: LambdaRuntime.NODEJS_14_X,
    };

    const lambdas = {
      getOne: new lambda.NodejsFunction(this, 'getOneLambda', {
        entry: path.join(__dirname, 'src', 'getOne.ts'),
        ...commonLambdaProps,
      }),
      getAll: new lambda.NodejsFunction(this, 'getAllLambda', {
        entry: path.join(__dirname, 'src', 'getAll.ts'),
        ...commonLambdaProps,
      }),
      create: new lambda.NodejsFunction(this, 'createLambda', {
        entry: path.join(__dirname, 'src', 'create.ts'),
        ...commonLambdaProps,
      }),
      delete: new lambda.NodejsFunction(this, 'deleteItemFunction', {
        entry: path.join(__dirname, 'src', 'deleteOne.ts'),
        ...commonLambdaProps,
      }),
    }

    // add RW permission to all lambdas
    dynamoTable.grantReadWriteData(lambdas.getOne);
    dynamoTable.grantReadWriteData(lambdas.getAll);
    dynamoTable.grantReadWriteData(lambdas.create);
    dynamoTable.grantReadWriteData(lambdas.delete);
    
    const apiGatewayLambdaIntegrations = {
      getOne: new apiGateway.LambdaIntegration(lambdas.getOne),
      getAll: new apiGateway.LambdaIntegration(lambdas.getAll),
      create: new apiGateway.LambdaIntegration(lambdas.create),
      delete: new apiGateway.LambdaIntegration(lambdas.delete),
    };

    const api = new apiGateway.RestApi(this, 'itemsApi', {
      restApiName: 'Items API'
    });

    const items = api.root.addResource('items');
    items.addMethod('GET', apiGatewayLambdaIntegrations.getAll);
    items.addMethod('POST', apiGatewayLambdaIntegrations.create);
    addCorsOptions(items);

    const item = items.addResource('{id}');
    item.addMethod('GET', apiGatewayLambdaIntegrations.getOne);
    item.addMethod('DELETE', apiGatewayLambdaIntegrations.delete);
    addCorsOptions(item);
  }
}

const app = new cdk.App();
new CrudStack(app, 'CRUD');
app.synth();
