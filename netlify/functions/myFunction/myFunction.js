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

    const accessToken = response.data.access_token;

    // Use the access token to make a POST request to Zoho API
    const zohoResponse = await axios.post('https://www.zohoapis.com/crm/v2/Leads', event.body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      }
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST"
      },
      body: JSON.stringify(zohoResponse.data)
    };

  } catch (error) {
    return {
      statusCode: 422,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST"
      },
      body: JSON.stringify(error.response.data)
    };
  }
};
