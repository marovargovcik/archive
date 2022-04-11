"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const cdk = require("aws-cdk-lib");
const apiGateway = require("aws-cdk-lib/aws-apigateway");
const dynamoDb = require("aws-cdk-lib/aws-dynamodb");
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const lambda = require("aws-cdk-lib/aws-lambda-nodejs");
const addCorsOptions = (resource) => resource.addMethod('OPTIONS', new apiGateway.MockIntegration({
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
    constructor(app, id) {
        super(app, id);
        const dynamoTable = new dynamoDb.Table(this, 'items', {
            partitionKey: {
                name: 'id',
                type: dynamoDb.AttributeType.STRING
            },
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            tableName: 'items',
        });
        const commonLambdaProps = {
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
            runtime: aws_lambda_1.Runtime.NODEJS_14_X,
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
        };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUU1QixtQ0FBbUM7QUFDbkMseURBQXlEO0FBRXpELHFEQUFxRDtBQUNyRCx1REFBa0U7QUFDbEUsd0RBQXdEO0FBRXhELE1BQU0sY0FBYyxHQUFHLENBQUMsUUFBbUIsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxVQUFVLENBQUMsZUFBZSxDQUFDO0lBQzNHLG9CQUFvQixFQUFFLENBQUM7WUFDckIsVUFBVSxFQUFFLEtBQUs7WUFDakIsa0JBQWtCLEVBQUU7Z0JBQ2xCLHFEQUFxRCxFQUFFLHlGQUF5RjtnQkFDaEosb0RBQW9ELEVBQUUsS0FBSztnQkFDM0QseURBQXlELEVBQUUsU0FBUztnQkFDcEUscURBQXFELEVBQUUsK0JBQStCO2FBQ3ZGO1NBQ0YsQ0FBQztJQUNGLG1CQUFtQixFQUFFLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLO0lBQ3pELGdCQUFnQixFQUFFO1FBQ2hCLGtCQUFrQixFQUFFLHVCQUF1QjtLQUM1QztDQUNGLENBQUMsRUFBRTtJQUNGLGVBQWUsRUFBRSxDQUFDO1lBQ2hCLFVBQVUsRUFBRSxLQUFLO1lBQ2pCLGtCQUFrQixFQUFFO2dCQUNsQixxREFBcUQsRUFBRSxJQUFJO2dCQUMzRCxxREFBcUQsRUFBRSxJQUFJO2dCQUMzRCx5REFBeUQsRUFBRSxJQUFJO2dCQUMvRCxvREFBb0QsRUFBRSxJQUFJO2FBQzNEO1NBQ0YsQ0FBQztDQUNILENBQUMsQ0FBQztBQUVILE1BQU0sU0FBVSxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQy9CLFlBQVksR0FBWSxFQUFFLEVBQVU7UUFDbEMsS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVmLE1BQU0sV0FBVyxHQUFHLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVB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S0FBSyxFQUFFLDRCQUE0QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVELEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLDRCQUE0QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdELGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV0QixNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLDRCQUE0QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLDRCQUE0QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlELGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2QixDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDM0IsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJ1xuXG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgYXBpR2F0ZXdheSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheSc7XG5pbXBvcnQgdHlwZSB7IElSZXNvdXJjZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1hcGlnYXRld2F5JztcbmltcG9ydCAqIGFzIGR5bmFtb0RiIGZyb20gJ2F3cy1jZGstbGliL2F3cy1keW5hbW9kYic7XG5pbXBvcnQgeyBSdW50aW1lIGFzIExhbWJkYVJ1bnRpbWUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhLW5vZGVqcyc7XG5cbmNvbnN0IGFkZENvcnNPcHRpb25zID0gKHJlc291cmNlOiBJUmVzb3VyY2UpID0+IHJlc291cmNlLmFkZE1ldGhvZCgnT1BUSU9OUycsIG5ldyBhcGlHYXRld2F5Lk1vY2tJbnRlZ3JhdGlvbih7XG4gIGludGVncmF0aW9uUmVzcG9uc2VzOiBbe1xuICAgIHN0YXR1c0NvZGU6ICcyMDAnLFxuICAgIHJlc3BvbnNlUGFyYW1ldGVyczoge1xuICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6IFwiJ0NvbnRlbnQtVHlwZSxYLUFtei1EYXRlLEF1dGhvcml6YXRpb24sWC1BcGktS2V5LFgtQW16LVNlY3VyaXR5LVRva2VuLFgtQW16LVVzZXItQWdlbnQnXCIsXG4gICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiBcIicqJ1wiLFxuICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctQ3JlZGVudGlhbHMnOiBcIidmYWxzZSdcIixcbiAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOiBcIidPUFRJT05TLEdFVCxQVVQsUE9TVCxERUxFVEUnXCIsXG4gICAgfSxcbiAgfV0sXG4gIHBhc3N0aHJvdWdoQmVoYXZpb3I6IGFwaUdhdGV3YXkuUGFzc3Rocm91Z2hCZWhhdmlvci5ORVZFUixcbiAgcmVxdWVzdFRlbXBsYXRlczoge1xuICAgIFwiYXBwbGljYXRpb24vanNvblwiOiBcIntcXFwic3RhdHVzQ29kZVxcXCI6IDIwMH1cIlxuICB9LFxufSksIHtcbiAgbWV0aG9kUmVzcG9uc2VzOiBbe1xuICAgIHN0YXR1c0NvZGU6ICcyMDAnLFxuICAgIHJlc3BvbnNlUGFyYW1ldGVyczoge1xuICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6IHRydWUsXG4gICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJzogdHJ1ZSxcbiAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzJzogdHJ1ZSxcbiAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6IHRydWUsXG4gICAgfSxcbiAgfV1cbn0pO1xuXG5jbGFzcyBDcnVkU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihhcHA6IGNkay5BcHAsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihhcHAsIGlkKTtcblxuICAgIGNvbnN0IGR5bmFtb1RhYmxlID0gbmV3IGR5bmFtb0RiLlRhYmxlKHRoaXMsICdpdGVtcycsIHtcbiAgICAgIHBhcnRpdGlvbktleToge1xuICAgICAgICBuYW1lOiAnaWQnLFxuICAgICAgICB0eXBlOiBkeW5hbW9EYi5BdHRyaWJ1dGVUeXBlLlNUUklOR1xuICAgICAgfSxcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICB0YWJsZU5hbWU6ICdpdGVtcycsXG4gICAgfSk7XG5cbiAgICBjb25zdCBjb21tb25MYW1iZGFQcm9wczogbGFtYmRhLk5vZGVqc0Z1bmN0aW9uUHJvcHMgPSB7XG4gICAgICBidW5kbGluZzoge1xuICAgICAgICBleHRlcm5hbE1vZHVsZXM6IFtcbiAgICAgICAgICAnYXdzLXNkaycsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgZGVwc0xvY2tGaWxlUGF0aDogcGF0aC5qb2luKF9fZGlybmFtZSwgJ3NyYycsICdwYWNrYWdlLWxvY2suanNvbicpLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgUFJJTUFSWV9LRVk6ICdpZCcsXG4gICAgICAgIFRBQkxFX05BTUU6IGR5bmFtb1RhYmxlLnRhYmxlTmFtZSxcbiAgICAgIH0sXG4gICAgICBydW50aW1lOiBMYW1iZGFSdW50aW1lLk5PREVKU18xNF9YLFxuICAgIH07XG5cbiAgICBjb25zdCBsYW1iZGFzID0ge1xuICAgICAgZ2V0T25lOiBuZXcgbGFtYmRhLk5vZGVqc0Z1bmN0aW9uKHRoaXMsICdnZXRPbmVMYW1iZGEnLCB7XG4gICAgICAgIGVudHJ5OiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnc3JjJywgJ2dldE9uZS50cycpLFxuICAgICAgICAuLi5jb21tb25MYW1iZGFQcm9wcyxcbiAgICAgIH0pLFxuICAgICAgZ2V0QWxsOiBuZXcgbGFtYmRhLk5vZGVqc0Z1bmN0aW9uKHRoaXMsICdnZXRBbGxMYW1iZGEnLCB7XG4gICAgICAgIGVudHJ5OiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnc3JjJywgJ2dldEFsbC50cycpLFxuICAgICAgICAuLi5jb21tb25MYW1iZGFQcm9wcyxcbiAgICAgIH0pLFxuICAgICAgY3JlYXRlOiBuZXcgbGFtYmRhLk5vZGVqc0Z1bmN0aW9uKHRoaXMsICdjcmVhdGVMYW1iZGEnLCB7XG4gICAgICAgIGVudHJ5OiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnc3JjJywgJ2NyZWF0ZS50cycpLFxuICAgICAgICAuLi5jb21tb25MYW1iZGFQcm9wcyxcbiAgICAgIH0pLFxuICAgICAgZGVsZXRlOiBuZXcgbGFtYmRhLk5vZGVqc0Z1bmN0aW9uKHRoaXMsICdkZWxldGVJdGVtRnVuY3Rpb24nLCB7XG4gICAgICAgIGVudHJ5OiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnc3JjJywgJ2RlbGV0ZU9uZS50cycpLFxuICAgICAgICAuLi5jb21tb25MYW1iZGFQcm9wcyxcbiAgICAgIH0pLFxuICAgIH1cblxuICAgIC8vIGFkZCBSVyBwZXJtaXNzaW9uIHRvIGFsbCBsYW1iZGFzXG4gICAgZHluYW1vVGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKGxhbWJkYXMuZ2V0T25lKTtcbiAgICBkeW5hbW9UYWJsZS5ncmFudFJlYWRXcml0ZURhdGEobGFtYmRhcy5nZXRBbGwpO1xuICAgIGR5bmFtb1RhYmxlLmdyYW50UmVhZFdyaXRlRGF0YShsYW1iZGFzLmNyZWF0ZSk7XG4gICAgZHluYW1vVGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKGxhbWJkYXMuZGVsZXRlKTtcbiAgICBcbiAgICBjb25zdCBhcGlHYXRld2F5TGFtYmRhSW50ZWdyYXRpb25zID0ge1xuICAgICAgZ2V0T25lOiBuZXcgYXBpR2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihsYW1iZGFzLmdldE9uZSksXG4gICAgICBnZXRBbGw6IG5ldyBhcGlHYXRld2F5LkxhbWJkYUludGVncmF0aW9uKGxhbWJkYXMuZ2V0QWxsKSxcbiAgICAgIGNyZWF0ZTogbmV3IGFwaUdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24obGFtYmRhcy5jcmVhdGUpLFxuICAgICAgZGVsZXRlOiBuZXcgYXBpR2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihsYW1iZGFzLmRlbGV0ZSksXG4gICAgfTtcblxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlHYXRld2F5LlJlc3RBcGkodGhpcywgJ2l0ZW1zQXBpJywge1xuICAgICAgcmVzdEFwaU5hbWU6ICdJdGVtcyBBUEknXG4gICAgfSk7XG5cbiAgICBjb25zdCBpdGVtcyA9IGFwaS5yb290LmFkZFJlc291cmNlKCdpdGVtcycpO1xuICAgIGl0ZW1zLmFkZE1ldGhvZCgnR0VUJywgYXBpR2F0ZXdheUxhbWJkYUludGVncmF0aW9ucy5nZXRBbGwpO1xuICAgIGl0ZW1zLmFkZE1ldGhvZCgnUE9TVCcsIGFwaUdhdGV3YXlMYW1iZGFJbnRlZ3JhdGlvbnMuY3JlYXRlKTtcbiAgICBhZGRDb3JzT3B0aW9ucyhpdGVtcyk7XG5cbiAgICBjb25zdCBpdGVtID0gaXRlbXMuYWRkUmVzb3VyY2UoJ3tpZH0nKTtcbiAgICBpdGVtLmFkZE1ldGhvZCgnR0VUJywgYXBpR2F0ZXdheUxhbWJkYUludGVncmF0aW9ucy5nZXRPbmUpO1xuICAgIGl0ZW0uYWRkTWV0aG9kKCdERUxFVEUnLCBhcGlHYXRld2F5TGFtYmRhSW50ZWdyYXRpb25zLmRlbGV0ZSk7XG4gICAgYWRkQ29yc09wdGlvbnMoaXRlbSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbm5ldyBDcnVkU3RhY2soYXBwLCAnQ1JVRCcpO1xuYXBwLnN5bnRoKCk7XG4iXX0=