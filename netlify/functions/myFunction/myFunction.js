const axios = require('axios');
const twilio = require('twilio');

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

exports.handler = async function (event, context) {
  const endpoint = 'https://accounts.zoho.com/oauth/v2/token';

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '', // OPTIONS request doesn't have a body
    };
  }

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
        grant_type,
      },
    });

    const accessToken = response.data.access_token;
    const { body } = event;
    const { data } = body;
    // const { Phone_3 } = data[0];
    // const phoneData = await client.lookups.v1.phoneNumbers(Phone_3).fetch({ type: ['carrier', 'caller-name'] });
    // const data = {
    //   data: [
    //     {
    //       ...body.data[0],
    //       Carrier: phoneData.carrier.name,
    //       Number_Type: phoneData.carrier.type
    //     }
    //   ]
    // };
    // Use the access token to make a POST request to Zoho API
    const zohoResponse = await axios.post('https://www.zohoapis.com/crm/v2/Leads', body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST',
      },
      body: JSON.stringify(body.data),
    };
  } catch (error) {
    return {
      statusCode: 422,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST',
      },
      body: JSON.stringify(error),
    };
  }
};
