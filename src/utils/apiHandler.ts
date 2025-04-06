import { Request, Response } from 'express';

export const handleValidateRequest = async (req: Request, res: Response) => {
  try {
    // Get authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader || authHeader !== 'Bearer dk_0xf59695e6be281dab7051c1f1398a54be') {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid API key'
      });
    }

    // Check for documentId in body
    if (!req.body?.documentId) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'documentId is required'
      });
    }

    // For now, return a mock validation response
    return res.status(200).json({
      success: true,
      isValid: true,
      documentId: req.body.documentId
    });

  } catch (error) {
    console.error('Error processing validation request:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
};

export const handleGenerateRequest = async (req: Request, res: Response) => {
  try {
    // Get authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader || authHeader !== 'Bearer dk_0xf59695e6be281dab7051c1f1398a54be') {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid API key'
      });
    }

    // Check for documentId in body
    if (!req.body?.documentId) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'documentId is required'
      });
    }

    // For now, return a mock generation response
    return res.status(200).json({
      success: true,
      message: 'Certificate generated successfully',
      documentId: req.body.documentId
    });

  } catch (error) {
    console.error('Error processing generation request:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
}; 