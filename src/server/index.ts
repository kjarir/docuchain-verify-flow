import express from 'express';
import cors from 'cors';

const app = express();
const port = 3001;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Validation endpoint
app.post('/api/validate', async (req, res) => {
  try {
    // Log request for debugging
    console.log('Request received:', {
      method: req.method,
      headers: req.headers,
      body: req.body
    });

    // Get API key from header
    const authHeader = req.headers.authorization;
    const expectedKey = 'Bearer dk_0xf59695e6be281dab7051c1f1398a54be';

    if (!authHeader || authHeader !== expectedKey) {
      console.log('Invalid API key:', { received: authHeader, expected: expectedKey });
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid API key'
      });
    }

    // Validate request body
    if (!req.body || !req.body.documentId) {
      console.log('Missing documentId in request');
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'documentId is required in request body'
      });
    }

    const documentId = req.body.documentId;

    // Validate document format
    const isValid = documentId && 
                   typeof documentId === 'string' && 
                   documentId.startsWith('0x') && 
                   documentId.length >= 42;

    console.log('Document validation result:', {
      documentId,
      isValid
    });

    // Return validation result
    return res.status(200).json({
      success: true,
      isValid,
      documentId,
      timestamp: new Date().toISOString(),
      message: isValid ? 'Document is valid' : 'Document format is invalid',
      details: {
        format: isValid ? 'Valid hex format starting with 0x' : 'Invalid format',
        length: documentId.length,
        prefix: documentId.slice(0, 4)
      }
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 