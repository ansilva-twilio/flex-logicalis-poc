const ServiceNowAPI = require(Runtime.getFunctions()['features/service-now-helper/common/snow-operations'].path);
const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
 
const requiredParameters = [
    { key: 'table', purpose: 'the table to be queried' },
    { key: 'query', purpose: 'the query to be executed' },
    { key: 'fields', purpose: 'the expected fields in the response' }
];
  
exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
    try {
        const result = await ServiceNowAPI.get(context, event.table, event.query, event.fields, event.limit);
        const { data, status } = result;

        response.setStatusCode(status);
        response.setBody({ data, ...extractStandardResponse(result) });
        return callback(null, response);
    } catch (error) {
        return handleError(error);
    }
});