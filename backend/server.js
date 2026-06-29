const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const portfinder = require('portfinder');
require('dotenv').config();

console.log('Starting server...');

// Import routes
const routes = require('./routes');

const app = express();
const DEFAULT_PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('Middleware configured');

// ============================================
// SWAGGER CONFIGURATION
// ============================================

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Grok AI Ticket Classifier API',
      version: '1.0.0',
      description: 'API for automatically classifying customer support tickets using Grok AI with automatic fallback to keyword matching.',
      contact: {
        name: 'Support Team',
        email: 'support@yourcompany.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${DEFAULT_PORT}`,
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        ClassificationRequest: {
          type: 'object',
          required: ['message'],
          properties: {
            message: {
              type: 'string',
              description: 'The customer support ticket message',
              example: 'I cannot login to my account, it says invalid password'
            }
          }
        },
        ClassificationResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              properties: {
                category: {
                  type: 'string',
                  enum: ['Authentication', 'Technical', 'Feature Request', 'General'],
                  description: 'The category of the ticket',
                  example: 'Authentication'
                },
                priority: {
                  type: 'string',
                  enum: ['Low', 'Medium', 'High', 'Critical'],
                  description: 'The priority level of the ticket',
                  example: 'High'
                }
              }
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Message is required'
            }
          }
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'OK'
            },
            message: {
              type: 'string',
              example: 'Grok service is running'
            },
            hasApiKey: {
              type: 'boolean',
              description: 'Whether a Grok API key is configured',
              example: true
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
console.log('Swagger configured');

// ============================================
// SWAGGER UI
// ============================================

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Grok AI API Documentation',
}));

app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

console.log('Swagger UI mounted at /api-docs');

// ============================================
// ROUTES
// ============================================

// All routes are prefixed with /api
app.use('/api', routes);
console.log('Routes mounted at /api');

// Root endpoint
let currentPort = DEFAULT_PORT;
app.get('/', (req, res) => {
  res.json({
    name: 'Grok AI Ticket Classifier API',
    version: '1.0.0',
    documentation: `http://localhost:${currentPort}/api-docs`,
    endpoints: {
      ping: `http://localhost:${currentPort}/api/ping`,
      health: `http://localhost:${currentPort}/api/health`,
      classify: `http://localhost:${currentPort}/api/classify`,
      batchClassify: `http://localhost:${currentPort}/api/classify/batch`,
      test: `http://localhost:${currentPort}/api/test`
    }
  });
});

// 404 handler
app.use((req, res) => {
  console.log('404 Not Found:', req.method, req.url);
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: 'Please check the API documentation at /api-docs'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// ============================================
// START SERVER WITH PORT FINDER
// ============================================

console.log('Looking for available port...');

// Configure portfinder to start from DEFAULT_PORT
portfinder.basePort = DEFAULT_PORT;

// Find an available port
portfinder.getPort((err, port) => {
  if (err) {
    console.error('Error finding available port:', err);
    process.exit(1);
  }

  // Update the current port for the root endpoint
  currentPort = port;

  // Start the server on the available port
  app.listen(port, () => {
    console.log(`
================================================================================
  Grok AI Server Started Successfully!
  
  Server: http://localhost:${port}
  Swagger Docs: http://localhost:${port}/api-docs
  API JSON: http://localhost:${port}/api-docs.json
  Root Endpoint: http://localhost:${port}/
  Ping Test: http://localhost:${port}/api/ping
  
  API Key Status: ${process.env.GROK_API_KEY ? 'Configured' : 'Missing'}
  
  Available Endpoints:
    GET  /api/ping            - Test if routing works
    GET  /api/health          - Health check
    POST /api/classify        - Classify a single ticket
    POST /api/classify/batch  - Batch classify tickets
    GET  /api/test            - Run test suite
    GET  /api-docs            - Swagger UI documentation
================================================================================
    `);
  });
});