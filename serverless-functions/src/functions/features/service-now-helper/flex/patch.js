const ServiceNowAPI = require(Runtime.getFunctions()['features/service-now-helper/common/snow-operations'].path);
const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
 
const requiredParameters = [
    { key: 'sys_id', purpose: 'the object sys_id' },
    { key: 'table', purpose: 'the object table name' },
    { key: 'json_obj', purpose: 'the object patch' }
];
  
exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
    try {
        
        const result = await ServiceNowAPI.patch(context, event.table, event.sys_id, event.json_obj);
        let { data, status } = result;
                
        response.setStatusCode(status);
        response.setBody({ data, ...extractStandardResponse(result) });
        return callback(null, response);
    } catch (error) {
        return handleError(error);
    }
});