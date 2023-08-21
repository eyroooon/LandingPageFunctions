const axios = require('axios');
const twilio = require('twilio');

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "https://autopartsai.com",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

exports.handler = async function(event, context) {
  const endpoint = 'https://accounts.zoho.com/oauth/v2/token';

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: ''  // OPTIONS request doesn't have a body
    };
  }

  const phoneData = await client.lookups.v1.phoneNumbers(event.body.Phone_3)
    .fetch({type: ['carrier', 'caller-name']});

  const data = {
    data: [
      {
        ...event.body,
        Carrier: phoneData.carrier.name,
        Number_Type: phoneData.carrier.type
      }
    ]
  };

  try {
    const response = await axios.post(endpoint, null, {
      params: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        refresh_token: process.env.REFRESH_TOKEN,
        grant_type: process.env.GRANT_TYPE
      }
    });

    const accessToken = response.data.access_token;

    const zohoResponse = await axios.post('https://www.zohoapis.com/crm/v2/Leads', data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    });

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(zohoResponse.data)
    };

  } catch (error) {
    return {
      statusCode: 422,
      headers: CORS_HEADERS,
      body: JSON.stringify(error.response.data)
    };
  }
};