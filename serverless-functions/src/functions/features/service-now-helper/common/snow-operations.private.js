const axios = require('axios');

const extractConfigFromContext = (context, params) => {
  const serviceNowUser = context.SERVICENOW_USERNAME;
  const serviceNowPass = context.SERVICENOW_PASSWORD;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept':'application/json'
    },
    auth: {
      username: serviceNowUser,
      password: serviceNowPass
    },
    params: params
  };

  return config;
};

const get = async (context, table, query, fields, limit, displayValue = true) => {
  const serviceNowUrl = context.SERVICENOW_URL;
  const url = `${serviceNowUrl}/api/now/table/${table}`;
  
  const params = {};
  if (query)  params.sysparm_query  = query;
  if (fields) params.sysparm_fields = fields;
  if (limit) params.sysparm_limit = limit;
  if (displayValue) params.sysparm_display_value = displayValue;

  try {
    const response = await axios.get(url, extractConfigFromContext(context, params));
    
    return {
      success: true,
      data: response.data?.result,
      status: response.status
    };
  } catch (error) {
    throw new Error(`ServiceNow API GET Error: ${error.message}`);
  }
};

const patch = async (context, table, sys_id, json_obj) => {
  const serviceNowUrl = context.SERVICENOW_URL;
  const url = `${serviceNowUrl}/api/now/table/${table}/${sys_id}`;

  try {
    const response = await axios.patch(url, json_obj, extractConfigFromContext(context));
    
    return {
      success: true,
      data: {},
      status: response.status
    };
  } catch (error) {
    throw new Error(`ServiceNow API PATCH Error: ${error.message}`);
  }
};

module.exports = { get, patch };