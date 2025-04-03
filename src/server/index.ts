const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Valid API keys
const validApiKeys = new Set(['dk_0xf59695e6be281dab7051c1f1398a54be']);

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (_req, res) => {
  res.json({ message: 'API is working' });
});

// Validate endpoint
app.post('/api/validate', (req, res) => {
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
});

// Handle 404
app.use((_req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist'
  });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error('Global error:', err);
  res.status(500).json({
    error: 'Server Error',
    message: 'An unexpected error occurred'
  });
});

// Start server
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// Export for Vercel
module.exports = app; 