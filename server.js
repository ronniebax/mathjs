const express = require('express');
const { evaluate, format } = require('mathjs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper function to format result with precision
function formatResult(result, precision) {
  if (precision === undefined) {
    return result.toString();
  }
  
  // Convert to number if it's not already
  const numResult = typeof result === 'number' ? result : parseFloat(result);
  
  if (isNaN(numResult)) {
    return result.toString();
  }
  
  // Format with specified precision (significant digits)
  return format(numResult, { precision: precision });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// GET endpoint - compatible with mathjs.org API
app.get('/v4/', (req, res) => {
  try {
    const { expr, precision } = req.query;
    
    if (!expr) {
      return res.status(400).json({
        result: null,
        error: 'Missing required parameter: expr'
      });
    }

    // Evaluate the mathematical expression
    const result = evaluate(decodeURIComponent(expr));
    const formattedResult = formatResult(result, precision ? parseInt(precision) : undefined);
    
    // For GET requests, return just the result as plain text (like original API)
    res.set('Content-Type', 'text/plain');
    res.send(formattedResult);
    
  } catch (error) {
    res.status(400).json({
      result: null,
      error: error.message
    });
  }
});

// POST endpoint - JSON format
app.post('/v4/', (req, res) => {
  try {
    const { expr, precision } = req.body;
    
    if (!expr) {
      return res.status(400).json({
        result: null,
        error: 'Missing required parameter: expr'
      });
    }

    // Evaluate the mathematical expression
    const result = evaluate(expr);
    const formattedResult = formatResult(result, precision);
    
    res.json({
      result: formattedResult,
      error: null
    });
    
  } catch (error) {
    res.status(400).json({
      result: null,
      error: error.message
    });
  }
});

// Catch-all for unsupported endpoints
app.use('*', (req, res) => {
  res.status(404).json({
    result: null,
    error: 'Endpoint not found. Use GET or POST to /v4/'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    result: null,
    error: 'Internal server error'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Math.js API server running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/health`);
  console.log(`API endpoints:`);
  console.log(`  GET  /v4/?expr=<expression>&precision=<number>`);
  console.log(`  POST /v4/ with JSON body: {"expr": "<expression>", "precision": <number>}`);
});