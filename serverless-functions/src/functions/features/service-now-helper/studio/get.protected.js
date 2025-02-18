const callServiceNowAPI = require(Runtime.getFunctions()['features/service-now-helper/common/snow-operations.js'].path).callServiceNowAPI;
const { prepareStudioFunction, extractStandardResponse } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
 
const requiredParameters = [
    { key: 'table', purpose: 'the table to be queried' },
    { key: 'query', purpose: 'the query to be executed' },
    { key: 'fields', purpose: 'the expected fields in the response' }
];
  
exports.handler = prepareStudioFunction(requiredParameters, async (context, event, callback, response, handleError) => {
    try {
        const result = await callServiceNowAPI(context, event.table, event.query, event.fields, event.limit);
        const { data, status } = result;

        response.setStatusCode(status);
        response.setBody({ data, ...extractStandardResponse(result) });
        return callback(null, response);
    } catch (error) {
        return handleError(error);
    }
});
  