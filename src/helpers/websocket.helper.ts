import * as AWS from 'aws-sdk';

export const sendMessage = async (connectionId: string, message: string, type: string) => {
    const socketUrl = process.env.SOCKET_URL;
    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        endpoint: socketUrl,
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
