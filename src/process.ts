import {
    getInput,
    error,
    setSecret,
    exportVariable,
    info,
} from '@actions/core';
import chunk from 'lodash.chunk';
import {
    SSMClient,
    GetParametersCommandInput,
    GetParametersCommand,
} from '@aws-sdk/client-ssm';

interface ActionParams {
    parameterPairs: [string, string][];
    withDecryption: boolean;
}

const validateParams = (): ActionParams => {
    const parameterPairsParam = getInput('parameterPairs', { required: true });
    const parameterPairsStrings = parameterPairsParam.split(',');
    const parameterPairs = parameterPairsStrings.map((parameterPairString) => {
        const parameterPair = parameterPairString.trim().split('=');
        if (parameterPair.length < 2) {
            throw new Error(
                'Incorrectly formatted parameter pair, make sure the parameterPairs string is in the format "/ssm/paramName=ENV_VARIABLE_NAME&/ssm/paramName2=ENV_VARIABLE_NAME2"'
            );
        }
        return parameterPair.map((parameter) => parameter.trim()) as [
            string,
            string
        ];
    });

    const withDecryptionParam = getInput('withDecryption');
    const withDecryption = withDecryptionParam !== 'false';

    return { parameterPairs, withDecryption };
};

const processParameterPairChunk = async (
    client: SSMClient,
    parameterPairChunk: [string, string][],
    withDecryption: boolean
): Promise<void> => {
    const parameterPairs = Object.fromEntries(parameterPairChunk);

    const input: GetParametersCommandInput = {
        Names: Object.keys(parameterPairs),
        WithDecryption: withDecryption,
    };

    const command = new GetParametersCommand(input);

    const response = await client.send(command);

    if (response?.Parameters && response.Parameters.length > 0) {
        for (const responseParameter of response.Parameters) {
            const name = responseParameter?.Name;
            const value = responseParameter?.Value;

            if (!name || !value) {
                error(`Invalid parameter returned, name: ${name}`);
                continue;
            }

            setSecret(value);
            exportVariable(parameterPairs[name], value);
            info(
                `Env variable ${parameterPairs[name]} set with value from ssm parameterName ${name}`
            );
        }
    }
    info(`Chunk successfully processed`);
};

const MAX_SSM_GETPARAMETERS_COUNT = 10;

const process = async (): Promise<void> => {
    const { parameterPairs, withDecryption } = validateParams();

    const parameterPairChunks = chunk(
        parameterPairs,
        MAX_SSM_GETPARAMETERS_COUNT
    );
    info(`${parameterPairChunks.length} chunks of parameters to retrieve`);

    const client = new SSMClient({});

    for (const parameterPairChunk of parameterPairChunks) {
        await processParameterPairChunk(
            client,
            parameterPairChunk,
            withDecryption
        );
    }

    info('Job Complete');
};

export default process;
