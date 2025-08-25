require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import cors

const app = express();
const PORT = process.env.PORT || 5000;

// Use CORS middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// API endpoint to proxy Hugging Face requests
app.get('/api/huggingface-models', async (req, res) => {
  console.log('Request received at /api/huggingface-models');
  const HF_API_KEY = process.env.HF_API_KEY; // Get API key from environment variables
  console.log('HF_API_KEY loaded:', !!HF_API_KEY); // Log if key is present

  if (!HF_API_KEY) {
    console.error('HF_API_KEY is NOT configured on the server.');
    return res.status(500).json({ message: 'Hugging Face API Key not configured on the server.' });
  }

  // Extract query parameters from the client request
  const { query, task, sortBy, includeSpaces, includeDatasets, includeRestricted } = req.query;
  console.log('Received query params:', req.query);

  try {
    const params = {
      sort: sortBy === 'downloads' ? 'downloads' : 
            sortBy === 'likes' ? 'likes' : 'lastModified',
      direction: -1,
      limit: 5, // Ensure we only get 5 models as per PRD
      full: true, // Request full model data
      filter: [task]
    };

    if (query && query.trim()) {
      params.search = query;
    }

    // Add filters for restricted, spaces, datasets if needed by HF API
    if (!includeRestricted || includeRestricted === 'false') {
        if (Array.isArray(params.filter)) {
            params.filter.push('not:gated');
        } else {
            params.filter = [params.filter, 'not:gated'];
        }
    }
    console.log('Calling Hugging Face API with params:', params);

    const response = await axios.get('https://huggingface.co/api/models', {
      params,
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 10000 // Server-side timeout
    });

    console.log('Successfully fetched models from Hugging Face.');
    res.json(response.data); // Send data back to client
  } catch (error) {
    console.error('Backend Hugging Face API Error (full):', error);
    console.error('Backend Hugging Face API Error Response Data:', error.response ? error.response.data : 'N/A');
    res.status(error.response ? error.response.status : 500).json({
      message: 'Error fetching models from Hugging Face API via backend proxy.',
      details: error.response ? error.response.data : error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
