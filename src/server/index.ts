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
    console.log('Received request:', {
      headers: req.headers,
      body: req.body
    });

    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== 'Bearer dk_0xf59695e6be281dab7051c1f1398a54be') {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid API key'
      });
    }

    if (!req.body?.documentId) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'documentId is required'
      });
    }

    // Simple validation logic
    const isValid = req.body.documentId.startsWith('0x') && req.body.documentId.length >= 42;

    return res.status(200).json({
      success: true,
      isValid,
      documentId: req.body.documentId
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
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