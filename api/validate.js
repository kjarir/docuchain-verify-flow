// Validate API keys
const validApiKeys = new Set(['dk_0xf59695e6be281dab7051c1f1398a54be']);

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check API key
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid API key'
      });
    }

    const apiKey = authHeader.replace('Bearer ', '');
    if (!validApiKeys.has(apiKey)) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid API key'
      });
    }

    // Check document ID
    const { documentId } = req.body;
    if (!documentId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'documentId is required'
      });
    }

    // Success response
    return res.status(200).json({
      isValid: true,
      documentId,
      timestamp: new Date().toISOString(),
      message: 'Document validation successful'
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Server Error',
      message: 'An unexpected error occurred'
    });
  }
} 