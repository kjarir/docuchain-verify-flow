// Validate API keys
const validApiKeys = new Set(['dk_0xf59695e6be281dab7051c1f1398a54be']);

// Validate document format
const isValidDocumentId = (documentId) => {
  return documentId && 
         typeof documentId === 'string' && 
         documentId.startsWith('0x') && 
         documentId.length >= 42;
};

const logRequest = (req) => {
  console.log('=== Request Details ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('====================');
};

// Main handler
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

  try {
    // Log request for debugging
    console.log('Request received:', {
      method: req.method,
      headers: req.headers,
      body: req.body
    });

    // Validate method
    if (req.method !== 'POST') {
      return res.status(405).json({
        success: false,
        error: 'Method Not Allowed',
        message: 'Only POST requests are allowed'
      });
    }

    // Get API key from header
    const authHeader = req.headers.authorization || '';
    const expectedKey = 'Bearer dk_0xf59695e6be281dab7051c1f1398a54be';

    if (!authHeader || authHeader !== expectedKey) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid API key',
        receivedKey: authHeader
      });
    }

    // Parse body if needed
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Invalid JSON body'
        });
      }
    }

    // Validate body
    if (!body || !body.documentId) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'documentId is required in request body'
      });
    }

    // Validate document format
    const isValid = body.documentId && 
                   typeof body.documentId === 'string' && 
                   body.documentId.startsWith('0x') && 
                   body.documentId.length >= 42;

    // Return validation result
    return res.status(200).json({
      success: true,
      isValid: isValid,
      documentId: body.documentId,
      timestamp: new Date().toISOString(),
      message: isValid ? 'Document is valid' : 'Document format is invalid',
      details: {
        format: isValid ? 'Valid hex format starting with 0x' : 'Invalid format',
        length: body.documentId.length,
        prefix: body.documentId.slice(0, 4)
      }
    });

  } catch (error) {
    // Log error for debugging
    console.error('Error processing request:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
      details: error.message
    });
  }
}; 