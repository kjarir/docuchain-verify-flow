// Validate API keys
const validApiKeys = new Set(['dk_0xf59695e6be281dab7051c1f1398a54be']);

const logRequest = (req) => {
  console.log('=== Request Details ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('====================');
};

module.exports = async (req, res) => {
  // Log request at the start
  logRequest(req);

  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
      console.log('Handling OPTIONS request');
      return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
      console.log('Invalid method:', req.method);
      return res.status(405).json({ 
        error: 'Method Not Allowed', 
        message: 'Only POST requests are allowed',
        method: req.method
      });
    }

    // Check API key
    const authHeader = req.headers['authorization'] || '';
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Missing or invalid authorization header:', authHeader);
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid API key format'
      });
    }

    const apiKey = authHeader.replace('Bearer ', '').trim();
    if (!validApiKeys.has(apiKey)) {
      console.log('Invalid API key:', apiKey);
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid API key'
      });
    }

    // Parse and validate request body
    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (e) {
      console.log('Failed to parse request body:', e);
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid JSON in request body'
      });
    }

    if (!body || typeof body !== 'object') {
      console.log('Invalid request body type:', typeof body);
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Request body must be a JSON object'
      });
    }

    const { documentId } = body;
    if (!documentId) {
      console.log('Missing documentId in request body');
      return res.status(400).json({
        error: 'Bad Request',
        message: 'documentId is required'
      });
    }

    // Success response
    const response = {
      isValid: true,
      documentId,
      timestamp: new Date().toISOString(),
      message: 'Document validation successful'
    };

    console.log('Sending successful response:', JSON.stringify(response, null, 2));
    return res.status(200).json(response);

  } catch (error) {
    // Log the full error for debugging
    console.error('=== Validation Error ===');
    console.error('Timestamp:', new Date().toISOString());
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    console.error('=====================');

    return res.status(500).json({
      error: 'Server Error',
      message: 'An unexpected error occurred',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}; 