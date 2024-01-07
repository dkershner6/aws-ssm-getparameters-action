import { Node20GitHubActionTypescriptProject } from "dkershner6-projen-github-actions";
import { RunsUsing } from "projen-github-action-typescript";
import { Nvmrc } from "projen-nvm";

const MAJOR_VERSION = 2;

const project = new Node20GitHubActionTypescriptProject({
    majorVersion: MAJOR_VERSION,
    defaultReleaseBranch: "main",

    devDeps: [
        "@types/lodash.chunk",
        "dkershner6-projen-github-actions",
        "projen-github-action-typescript",
        "projen-nvm",
    ],
    name: "aws-ssm-getparameters-action",
    description:
        "A GitHub action centered on AWS Systems Manager Parameter Store GetParameters call, and placing the results into environment variables",

    actionMetadata: {
        name: "AWS SSM Parameter Store GetParameters Action",
        description:
            "AWS Systems Manager Parameter Store GetParameters call, including placing the results into environment variables",
        inputs: {
            parameterPairs: {
                required: true,
                description:
                    "The parameters you would like to retrieve, in pair format with an equal in between and comma delimited. The parameter name is the key, and the environment variable name is the value.",
            },
            withDecryption: {
                required: false,
                description:
                    "Whether to decrypt SecretString SSM parameters. Defaults to true.",
                default: "true",
            },
        },
        runs: {
            using: RunsUsing.NODE_20,
            main: "dist/index.js",
        },
        branding: {
            icon: "lock",
            color: "blue",
        },
    },

    deps: ["@aws-sdk/client-ssm", "lodash.chunk"],

    autoApproveOptions: {
        allowedUsernames: ["dkershner6"],
    },

    sampleCode: false,
    docgen: true,
});

new Nvmrc(project);

project.synth();
