// AWS Configuration for DynamoDB
// IMPORTANT: Never commit credentials to git! Use environment variables instead.

import { Amplify } from 'aws-amplify';

const awsConfig = {
  Auth: {
    region: process.env.REACT_APP_AWS_REGION || 'ap-south-1',
    userPoolId: process.env.REACT_APP_AWS_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_AWS_USER_POOL_WEB_CLIENT_ID,
  },
  Storage: {
    AWSS3: {
      bucket: process.env.REACT_APP_S3_BUCKET,
      region: process.env.REACT_APP_AWS_REGION || 'ap-south-1',
    }
  }
};

// Initialize Amplify
Amplify.configure(awsConfig);

export default awsConfig;

/*
SETUP INSTRUCTIONS:

1. Create .env.local file in apphill/ directory:

REACT_APP_AWS_REGION=ap-south-1
REACT_APP_AWS_USER_POOL_ID=ap-south-1_xxxxx
REACT_APP_AWS_USER_POOL_WEB_CLIENT_ID=xxxxx
REACT_APP_S3_BUCKET=smarthill-bucket
AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY

2. Never hardcode credentials in code!

3. Use AWS IAM roles for production

4. Create IAM Policy for DynamoDB:

{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": "arn:aws:dynamodb:ap-south-1:*:table/*"
    }
  ]
}
*/
