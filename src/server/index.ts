import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

// In-memory API key storage (in production, use environment variables)
const validApiKeys = new Set([
  'dk_0xf59695e6be281dab7051c1f1398a54be'
]);

app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'DocuChain API is running' });
});

// Validate endpoint
app.post('/api/validate', (req, res) => {
  try {
    // Get API key from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
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

    // Get documentId from request body
    const { documentId } = req.body;
    if (!documentId) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'documentId is required'
      });
    }

    // Mock validation response
    const result = {
      isValid: true,
      documentId,
      timestamp: new Date().toISOString(),
      message: 'Document validation successful'
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ 
      error: 'Server Error',
      message: 'An unexpected error occurred'
    });
  }
});

// Start server
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// Export for Vercel
module.exports = app; 