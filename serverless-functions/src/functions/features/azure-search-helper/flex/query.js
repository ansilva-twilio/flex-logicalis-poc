const axios = require('axios');

const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
 
const requiredParameters = [
    { key: 'userInput', purpose: 'the user input for the search' }
];
  
exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
    try {
        const url = context.AZURE_SEARCH_URL;
        const requestData = {
            messages: [
                {
                    role: "user",
                    content: event.userInput
                }
            ],
            data_sources: [
                {
                    type: "azure_search",
                    parameters: {
                        endpoint: context.AZURE_SEARCH_ENDPOINT,
                        index_name: context.AZURE_SEARCH_INDEX_NAME,
                        authentication: {
                            type: "api_key",
                            key: context.AZURE_SEARCH_API_KEY
                        }
                    }
                }
            ]
        };

        const responseData = await axios.post(url, requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept':'application/json'
            }
        });

        const result = {
            success: true,
            data: responseData.data?.response,
            status: responseData.status
        };

        const { data, status } = result;
        
        response.setStatusCode(status);
        response.setBody({ data, ...extractStandardResponse(result) });
        return callback(null, response);
    } catch (error) {
        return handleError(error);
    }
});