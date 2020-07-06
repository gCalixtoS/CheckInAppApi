var graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

module.exports = {
    getUserDetails: async function (accessToken) {
        const client = getAuthenticatedClient(accessToken);
        try{
            const user = await client.api('/me').get();
        }catch(e){
            console.log(e)
        }

        return user;
    }
};

function getAuthenticatedClient(accessToken) {
    // Initialize Graph client
    const client = graph.Client.init({
        // Use the provided access token to authenticate
        // requests
        authProvider: (done) => {
            done(null, accessToken);
        }
    });

    return client;
}