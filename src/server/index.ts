import express from 'express';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'API is working' });
});

// Validate endpoint
app.post('/api/validate', (req, res) => {
  try {
    const { authorization } = req.headers;
    const { documentId } = req.body;

    // Check API key
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Missing or invalid API key'
      });
    }

    // Check document ID
    if (!documentId) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'documentId is required'
      });
    }

    // Success response
    return res.json({
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
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 