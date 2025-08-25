const axios = require('axios');

exports.handler = async function(event, context) {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  // Get the Hugging Face API key from Netlify Environment Variables
  // This key is NOT exposed to the client-side application.
  const HF_API_KEY = process.env.HF_API_KEY; 

  if (!HF_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Hugging Face API Key not configured in Netlify Environment Variables.' }),
    };
  }

  // Extract query parameters from the client request
  const { path, ...params } = event.queryStringParameters;

  try {
    const response = await axios.get('https://huggingface.co/api/models', {
      params: {
        ...params, // Pass all query parameters from the client
        limit: 5, // Ensure we only get 5 models as per PRD
        full: true // Request full model data
      },
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 8000
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error('Hugging Face Proxy Error:', error.response ? error.response.data : error.message);
    return {
      statusCode: error.response ? error.response.status : 500,
      body: JSON.stringify({ 
        message: 'Error fetching models from Hugging Face API via proxy.',
        details: error.response ? error.response.data : error.message
      }),
    };
  }
};
