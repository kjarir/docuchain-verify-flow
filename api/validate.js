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

// Simple API endpoint for document validation
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Log request for debugging
  console.log('Request received:', {
    method: req.method,
    headers: req.headers,
    body: req.body
  });

  try {
    // Validate method
    if (req.method !== 'POST') {
      return res.status(405).json({
        error: 'Method Not Allowed',
        message: 'Only POST requests are allowed'
      });
    }

    // Get API key from header
    const authHeader = req.headers['authorization'] || req.headers.authorization;
    const expectedKey = 'Bearer dk_0xf59695e6be281dab7051c1f1398a54be';

    if (!authHeader || authHeader !== expectedKey) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid API key'
      });
    }

    // Validate body
    const { documentId } = req.body || {};
    if (!documentId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'documentId is required in request body'
      });
    }

    // Return success
    return res.status(200).json({
      success: true,
      isValid: true,
      documentId,
      timestamp: new Date().toISOString(),
      message: 'Document validation successful'
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
}; 