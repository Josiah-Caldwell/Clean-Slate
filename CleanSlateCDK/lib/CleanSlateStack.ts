import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway'

export class CleanSlateStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Clean Slate lambda function
    const cleanSlateLambda = new lambda.Function(this, 'CleanSlateLambda', {
      functionName: 'CleanSlate',
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset('resources/clean-slate-lambda-deployment.zip'),
      handler: 'cleanslate.handleRequest',
      memorySize: 128,
      timeout: cdk.Duration.seconds(25)
    });

    // Build Clean Slate API
    const cleanSlateAPI = new apigateway.LambdaRestApi(this, 'CleanSlateAPI', {
      handler: cleanSlateLambda,
      proxy: false
    });

    const submission = cleanSlateAPI.root.addResource('submission');
    submission.addMethod('POST');
  }
}
