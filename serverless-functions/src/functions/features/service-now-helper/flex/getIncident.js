const ServiceNowAPI = require(Runtime.getFunctions()['features/service-now-helper/common/snow-operations'].path);
const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
 
const requiredParameters = [
    { key: 'number', purpose: 'the incident number' }
];
  
exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
    try {
        
        const result = await ServiceNowAPI.get(context, "incident", `number=${event.number}`, "sys_id,number,description,short_description,state,incident_state,assigned_to.name,impact,urgency,opened_by.name,cmdb_ci.name,opened_at,assignment_group.name,contact_type,category,subcategory,caller_id.name", 1);
        let { data, status } = result;

        if (data && data.length > 0) {
            // since the incident is 1, return the actual object instead of an array
            data = data[0];

            const wnResult = await ServiceNowAPI.get(context, "sys_journal_field", `element_id=${data.sys_id}ORDERBYDESCsys_created_on`, "element,value,sys_created_by,sys_created_on", 50);
            if (wnResult.status === 200) {
                //set comments_and_work_notes into incident
                data.comments_and_work_notes = wnResult.data ?? '';
            }
        }
        response.setStatusCode(status);
        response.setBody({ data, ...extractStandardResponse(result) });
        return callback(null, response);
    } catch (error) {
        return handleError(error);
    }
});