# AWS SSM Parameter Store GetParameters Action

A GitHub action centered on AWS Systems Manager Parameter Store GetParameters call, and placing the results into environment variables.

This action is optimized to use the least possible number of API calls to Parameter Store, to avoid the low rate limits.

## Usage

```yaml
- name: Configure AWS credentials
  id: aws-credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
      aws-access-key-id: ${{ secrets.PROD_AWS_ACCESS_KEY_ID }}
      aws-secret-access-key: ${{ secrets.PROD_AWS_SECRET_KEY }}
      aws-region: us-east-1

- uses: dkershner6/aws-ssm-getparameters-action@v2
  with:
      parameterPairs: "/region/primary = PRIMARY_AWS_REGION,
          /accountAlias = AWS_ACCOUNT_ALIAS"
      # The part before equals is the ssm parameterName, and after is the ENV Variable name for the workflow.
      # No limit on number of parameters. You can put new lines and spaces in as desired, they get trimmed out.
      withDecryption: "true" # defaults to true
```

## Contributing

All contributions are welcome, please open an issue or pull request.

To use this repository:
1. `npm i -g pnpm` (if don't have pnpm installed)
2. `pnpm i`
3. `npx projen` (this will ensure everything is setup correctly, and you can run this command at any time)
4. Good to make your changes!
5. You can run `npx projen build` at any time to build the project.