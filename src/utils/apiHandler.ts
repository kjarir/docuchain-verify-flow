
import { validateApiKey } from './apiKeyService';
import { validateDocument, generateDocument } from './blockchainUtils';

// API handler for validate endpoint
export const handleValidateRequest = async (req: Request): Promise<Response> => {
  try {
    // Get API key from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', message: 'Missing or invalid API key' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = authHeader.replace('Bearer ', '');
    
    // Validate API key
    const isValidKey = validateApiKey(apiKey);
    if (!isValidKey) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', message: 'Invalid API key' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body = await req.json();
    if (!body.documentId) {
      return new Response(
        JSON.stringify({ error: 'Bad Request', message: 'documentId is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Process document validation
    const result = await validateDocument(body.documentId);
    
    console.log("Validation result for documentId:", body.documentId, result);
    
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing validation request:', error);
    return new Response(
      JSON.stringify({ error: 'Server Error', message: 'An unexpected error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// API handler for generate endpoint
export const handleGenerateRequest = async (req: Request): Promise<Response> => {
  try {
    // Get API key from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', message: 'Missing or invalid API key' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = authHeader.replace('Bearer ', '');
    
    // Validate API key
    const isValidKey = validateApiKey(apiKey);
    if (!isValidKey) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', message: 'Invalid API key' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body = await req.json();
    if (!body.template) {
      return new Response(
        JSON.stringify({ error: 'Bad Request', message: 'template is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Process document generation
    const result = await generateDocument(body.template, body);
    
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing generation request:', error);
    return new Response(
      JSON.stringify({ error: 'Server Error', message: 'An unexpected error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
