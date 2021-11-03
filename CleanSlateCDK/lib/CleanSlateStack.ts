import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';

export class CleanSlateStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cleanSlateLambda = new lambda.Function(this, "CleanSlateLambda", {
      functionName: "CleanSlate",
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset("resources/clean-slate-lambda-deployment.zip"),
      handler: "cleanslate.handleRequest",
      memorySize: 128,
      timeout: cdk.Duration.seconds(25)
    });

  }
}
