import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway'

export class CleanSlateStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Clean Slate lambda functions
    const cleanSlateTitlesLambda = new lambda.Function(this, 'CleanSlateTitlesLambda', {
      functionName: 'CleanSlateTitlesHandler',
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset('resources/clean-slate-lambda-deployment.zip'),
      handler: 'cleanslate.handleTitlesRequest',
      memorySize: 128,
      timeout: cdk.Duration.seconds(29)
    });
    
    const cleanSlateSubmissionLambda = new lambda.Function(this, 'CleanSlateSubmissionLambda', {
      functionName: 'CleanSlateSubmissionHandler',
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset('resources/clean-slate-lambda-deployment.zip'),
      handler: 'cleanslate.handleSubmissionRequest',
      memorySize: 128,
      timeout: cdk.Duration.seconds(29)
    });

    const cleanSlateCommentLambda = new lambda.Function(this, 'CleanSlateCommentLambda', {
      functionName: 'CleanSlateCommentHandler',
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset('resources/clean-slate-lambda-deployment.zip'),
      handler: 'cleanslate.handleCommentRequest',
      memorySize: 128,
      timeout: cdk.Duration.seconds(29)
    });
  }
}
