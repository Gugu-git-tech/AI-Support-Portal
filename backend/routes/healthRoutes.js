const express = require('express');
const router = express.Router();
const GrokService = require('../services/grok');

const grokService = new GrokService();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check if the API is running and Grok is configured
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 message:
 *                   type: string
 *                   example: Grok service is running
 *                 hasApiKey:
 *                   type: boolean
 *                   example: true
 *                 timestamp:
 *                   type: string
 *                   example: 2026-06-25T09:30:00.000Z
 */
router.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({
    status: 'OK',
    message: 'Grok service is running',
    hasApiKey: !!grokService.apiKey,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;