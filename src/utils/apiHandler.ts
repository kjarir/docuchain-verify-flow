import { Request, Response } from 'express';
import { validateApiKey } from './apiKeyService';
import { validateDocument, generateDocument } from './blockchainUtils';

// API handler for validate endpoint
export const handleValidateRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get API key from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized', message: 'Missing or invalid API key' });
      return;
    }

    const apiKey = authHeader.replace('Bearer ', '');
    
    // Validate API key
    const isValidKey = validateApiKey(apiKey);
    if (!isValidKey) {
      res.status(401).json({ error: 'Unauthorized', message: 'Invalid API key' });
      return;
    }

    // Parse request body
    if (!req.body.documentId) {
      res.status(400).json({ error: 'Bad Request', message: 'documentId is required' });
      return;
    }

    // Process document validation
    const result = await validateDocument(req.body.documentId);
    
    console.log("Validation result for documentId:", req.body.documentId, result);
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error processing validation request:', error);
    res.status(500).json({ error: 'Server Error', message: 'An unexpected error occurred' });
  }
};

// API handler for generate endpoint
export const handleGenerateRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get API key from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized', message: 'Missing or invalid API key' });
      return;
    }

    const apiKey = authHeader.replace('Bearer ', '');
    
    // Validate API key
    const isValidKey = validateApiKey(apiKey);
    if (!isValidKey) {
      res.status(401).json({ error: 'Unauthorized', message: 'Invalid API key' });
      return;
    }

    // Parse request body
    if (!req.body.template) {
      res.status(400).json({ error: 'Bad Request', message: 'template is required' });
      return;
    }

    // Process document generation
    const result = await generateDocument(req.body.template, req.body);
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error processing generation request:', error);
    res.status(500).json({ error: 'Server Error', message: 'An unexpected error occurred' });
  }
};
