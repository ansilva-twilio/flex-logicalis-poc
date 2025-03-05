const axios = require('axios');
const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
 
const requiredParameters = [];
  
exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
    try {
        const tokenAuthorization = `${context.TWILIO_API_KEY}:${context.TWILIO_API_SECRET}`;
        const buffer = Buffer.from(tokenAuthorization);
      
        const tokenFormatted = buffer.toString('base64');
        
        const axiosResponse = await axios
          .get('https://content.twilio.com/v1/Content?PageSize=1000', {
            headers: { 
              Authorization: `Basic ${tokenFormatted}`, 
              'Content-Type': 'application/json' 
            },
          });

        response.setStatusCode(axiosResponse.status);
        response.setBody({ contents: axiosResponse?.data?.contents, ...extractStandardResponse({ success: true }) });
        return callback(null, response);
    } catch (error) {
        return handleError(error);
    }
});