import * as AWS from 'aws-sdk';

export const sendMessage = async (connectionId: string, message: string, type: string) => {
    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        endpoint: `https://66gubfwnhb.execute-api.us-east-1.amazonaws.com/dev`,
        // endpoint: `https://${domainName}/${stage}`,
    });

    try {
        await apigwManagementApi.postToConnection({
            ConnectionId: connectionId,
            Data: JSON.stringify({ type, message }),
        }).promise();
    } catch (err: any) {
        if (err.statusCode === 410) {
            console.log(`Connection ${connectionId} is gone`);
            // Opcional: eliminar el connectionId de tu base de datos si lo guardas
        } else {
            throw err;
        }
    }
};
