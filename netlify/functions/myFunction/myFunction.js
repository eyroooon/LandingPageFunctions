const axios = require('axios');

exports.handler = async function(event, context) {
  const endpoint = 'https://accounts.zoho.com/oauth/v2/token';

  // Get variables from environment
  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;
  const refresh_token = process.env.REFRESH_TOKEN;
  const grant_type = process.env.GRANT_TYPE;

  try {
    const response = await axios.post(endpoint, null, {
      params: {
        client_id,
        client_secret,
        refresh_token,
        grant_type
      }
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Adjust this to your domain for added security
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST"
      },
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    return {
      statusCode: 422,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Adjust this to your domain for added security
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST"
      },
      body: JSON.stringify(error.response.data)
    };
  }
};
