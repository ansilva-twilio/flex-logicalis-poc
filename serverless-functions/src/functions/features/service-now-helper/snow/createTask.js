exports.handler = async (context, event, callback) => {
    // For the purpose of this example, we'll assume that the username and
    // password are hardcoded values. Feel free to set these as other values,
    // or better yet, use environment variables instead!
    const USERNAME = 'twilio';
    const PASSWORD = 'logicalis';
  
    // Prepare a new Twilio response for the incoming request
    const response = new Twilio.Response();
    // Grab the standard HTTP Authorization header
    const authHeader = event.request.headers.authorization;
  
    // Reject requests that don't have an Authorization header
    if (!authHeader) return callback(null, setUnauthorized(response));
  
    // The auth type and credentials are separated by a space, split them
    const [authType, credentials] = authHeader.split(' ');
    // If the auth type doesn't match Basic, reject the request
    if (authType.toLowerCase() !== 'basic')
      return callback(null, setUnauthorized(response));
  
    // The credentials are a base64 encoded string of 'username:password',
    // decode and split them back into the username and password
    const [username, password] = Buffer.from(credentials, 'base64')
      .toString()
      .split(':');
    // If the username or password don't match the expected values, reject
    if (username !== USERNAME || password !== PASSWORD)
      return callback(null, setUnauthorized(response));
  
    // If we've made it this far, the request is authorized!
    // At this point, you could do whatever you want with the request.
    // For this example, we'll just return a 200 OK response.
    const client = context.getTwilioClient();

    let interactionRequest = {
        channel: {
          type: "chat",
          initiated_by: "api"
        },
        routing: {
          properties: {
            workspace_sid: context.TWILIO_FLEX_WORKSPACE_SID,
            workflow_sid: context.TWILIO_FLEX_RETURN_WORKFLOW_SID,
            task_channel_sid: context.TWILIO_FLEX_RETURN_CHANNEL_SID,
            attributes: { 
              taskType: 'ServiceNowReturnTask', 
              name: 'Retorno: '+ (event.incident ? event.incident : event.requestItem)
            },
          },
        },
      };

    if (event.incident) interactionRequest.routing.properties.attributes.incident = event.incident;
    if (event.requestItem) interactionRequest.routing.properties.attributes.requestItem = event.requestItem;

    const interaction = await client.flexApi.v1.interaction.create(interactionRequest);
    
    console.log(interaction.sid);
    return callback(null, interaction.sid);
  };
  
  // Helper method to format the response as a 401 Unauthorized response
  // with the appropriate headers and values
  const setUnauthorized = (response) => {
    response
      .setBody('Unauthorized')
      .setStatusCode(401)
      .appendHeader(
        'WWW-Authenticate',
        'Basic realm="Authentication Required"'
      );
  
    return response;
  };