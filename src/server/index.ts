import express from 'express';
import cors from 'cors';

const app = express();
const port = 3001;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Validate document format
const isValidDocumentId = (documentId: string): boolean => {
  return documentId && 
         typeof documentId === 'string' && 
         documentId.startsWith('0x') && 
         documentId.length >= 42;
};

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

    // Validate request body
    if (!req.body || !req.body.documentId) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'documentId is required in request body'
      });
    }

    // Validate document format
    const isValid = isValidDocumentId(req.body.documentId);

    // Return validation result
    return res.status(200).json({
      success: true,
      isValid: isValid,
      documentId: req.body.documentId,
      timestamp: new Date().toISOString(),
      message: isValid ? 'Document is valid' : 'Document format is invalid',
      details: {
        format: isValid ? 'Valid hex format starting with 0x' : 'Invalid format',
        length: req.body.documentId.length,
        prefix: req.body.documentId.slice(0, 4)
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 