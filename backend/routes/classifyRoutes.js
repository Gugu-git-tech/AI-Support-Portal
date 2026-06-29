const express = require('express');
const router = express.Router();
const GrokService = require('../services/grok');

const grokService = new GrokService();

// Simple test endpoint to verify routing works
router.get('/ping', (req, res) => {
  console.log('PING ROUTE HIT!');
  res.json({ 
    pong: true, 
    timestamp: new Date().toISOString(),
    message: 'Route is working!'
  });
});

/**
 * @swagger
 * /api/classify:
 *   post:
 *     summary: Classify a support ticket
 *     description: |
 *       Analyze a customer support message and return:
 *       - Category: Authentication, Billing, Technical, Feature Request, or General
 *       - Priority: Critical, High, Medium, or Low
 *       
 *       The system tries Grok AI first, then falls back to keyword matching.
 *     tags: [Classification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: The customer support ticket message
 *                 example: I cannot login to my account, it says invalid password
 *     responses:
 *       200:
 *         description: Ticket classified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     category:
 *                       type: string
 *                       enum: [Authentication, Billing, Technical, Feature Request, General]
 *                       example: Authentication
 *                     priority:
 *                       type: string
 *                       enum: [Low, Medium, High, Critical]
 *                       example: High
 *       400:
 *         description: Bad request - missing message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Message is required
 *       500:
 *         description: Server error
 */
router.post('/classify', async (req, res) => {
  console.log('========================================');
  console.log('CLASSIFY ROUTE HIT!');
  console.log('Request body:', req.body);
  console.log('========================================');
  
  try {
    const { message } = req.body;
    
    if (!message) {
      console.log('No message provided');
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }
    
    console.log(`Received message: "${message}"`);
    
    const classification = await grokService.classifyTicket(message);
    
    console.log('Classification result:', classification);
    
    res.json({
      success: true,
      data: classification
    });
    
  } catch (error) {
    console.error('Classification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to classify ticket'
    });
  }
});

/**
 * @swagger
 * /api/classify/batch:
 *   post:
 *     summary: Classify multiple tickets at once
 *     description: Send multiple messages and get classifications for all of them
 *     tags: [Classification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               messages:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of customer messages
 *                 example: [
 *                   "I cannot login to my account",
 *                   "The app is crashing",
 *                   "I want a refund"
 *                 ]
 *     responses:
 *       200:
 *         description: All tickets classified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                       classification:
 *                         type: object
 *                         properties:
 *                           category:
 *                             type: string
 *                           priority:
 *                             type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/classify/batch', async (req, res) => {
  console.log('========================================');
  console.log('BATCH CLASSIFY ROUTE HIT!');
  console.log('Request body:', req.body);
  console.log('========================================');
  
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      console.log('Messages array is required');
      return res.status(400).json({
        success: false,
        error: 'Messages array is required'
      });
    }
    
    if (messages.length === 0) {
      console.log('Messages array is empty');
      return res.status(400).json({
        success: false,
        error: 'Messages array cannot be empty'
      });
    }
    
    console.log(`Processing batch of ${messages.length} messages`);
    
    const results = [];
    for (const message of messages) {
      const classification = await grokService.classifyTicket(message);
      results.push({
        message,
        classification
      });
    }
    
    console.log('Batch results:', results);
    
    res.json({
      success: true,
      results
    });
    
  } catch (error) {
    console.error('Batch error:', error);
    res.status(500).json({
      success: false,
      error: 'Batch classification failed'
    });
  }
});

module.exports = router;