const ServiceNowAPI = require(Runtime.getFunctions()['features/service-now-helper/common/snow-operations'].path);
const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
 
const requiredParameters = [
    { key: 'number', purpose: 'the request item number' }
];
  
exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
    try {
        
        const result = await ServiceNowAPI.get(context, "sc_req_item", `number=${event.number}`, "sys_id,number,company.name,request.requested_for.name,cmdb_ci.name,cat_item.name,u_tracking_flag,sys_domain.name,time_worked,short_description,description,state,approval,stage,u_follow_up_with,assignment_group.name,assigned_to.name,opened_at,opened_by.name,contact_type,escalation,comments,watch_list", 1);
        let { data, status } = result;

        if (data && data.length > 0) {
            // since the Request Item is 1, return the actual object instead of an array
            data = data[0];

            const wnResult = await ServiceNowAPI.get(context, "sys_journal_field", `element_id=${data.sys_id}ORDERBYDESCsys_created_on`, "element,value,sys_created_by,sys_created_on", 50);
            if (wnResult.status === 200) {
                //set comments_and_work_notes into request item
                data.comments_and_work_notes = wnResult.data ?? '';
            }

            const taskResult = await ServiceNowAPI.get(context, "sc_task", `parent=${data.sys_id}`, "sys_id,number,company.name,request.requested_for.name,cmdb_ci.name,cat_item.name,location,sys_domain.name,time_worked,short_description,description,state,assignment_group.name,assigned_to.name,opened_at,opened_by.name,contact_type,escalation,watch_list", null);
            if (taskResult.status === 200) {
                //set tasks into request item
                data.tasks = taskResult.data ?? '';

                if (data.tasks) {
                    for (let index = 0; index < data.tasks.length; index++) {
                        const task = data.tasks[index];
                        const twnResult = await ServiceNowAPI.get(context, "sys_journal_field", `element_id=${task.sys_id}ORDERBYDESCsys_created_on`, "element,value,sys_created_by,sys_created_on", 50);
                        if (twnResult.status === 200) {
                            //set comments_and_work_notes into task
                            task.comments_and_work_notes = twnResult.data ?? '';
                        }
                    }
                }
            }
        }
                
        response.setStatusCode(status);
        response.setBody({ data, ...extractStandardResponse(result) });
        return callback(null, response);
    } catch (error) {
        return handleError(error);
    }
});