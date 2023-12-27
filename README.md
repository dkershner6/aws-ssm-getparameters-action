# AWS SSM Parameter Store GetParameters Action

Forked from: https://github.com/dkershner6/aws-ssm-getparameters-action

A GitHub action centered on AWS Systems Manager Parameter Store GetParameters call, and placing the results into environment variables.

This action is optimized to use the least possible number of API calls to Parameter Store, to avoid the low rate limits.

## Usage

```yaml
- name: Configure AWS credentials
  id: aws-credentials
  uses: aws-actions/configure-aws-credentials@v1
  with:
      aws-access-key-id: ${{ secrets.PROD_AWS_ACCESS_KEY_ID }}
      aws-secret-access-key: ${{ secrets.PROD_AWS_SECRET_KEY }}
      aws-region: us-east-1

- uses: dkershner6/aws-ssm-getparameters-action@v1
  with:
      parameterPairs: "/region/primary = PRIMARY_AWS_REGION,
          /accountAlias = AWS_ACCOUNT_ALIAS"
      # The part before equals is the ssm parameterName, and after is the ENV Variable name for the workflow.
      # No limit on number of parameters. You can put new lines and spaces in as desired, they get trimmed out.
      withDecryption: "true" # defaults to true, but only use for SecureString parameters
```
