const express = require('express');
const router = express.Router();
const GrokService = require('../services/grok');

const grokService = new GrokService();

/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: Run test classifications
 *     description: Runs a set of predefined test cases to verify the classification system
 *     tags: [Testing]
 *     responses:
 *       200:
 *         description: Tests completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Tests completed - check console
 *       500:
 *         description: Test failed
 */
router.get('/test', async (req, res) => {
  console.log('Test suite requested');
  try {
    console.log('Running test suite...');
    await grokService.test();
    
    res.json({
      success: true,
      message: 'Tests completed - check console for results'
    });
  } catch (error) {
    console.error('Test execution error:', error);
    res.status(500).json({
      success: false,
      error: 'Test execution failed: ' + error.message
    });
  }
});

module.exports = router;