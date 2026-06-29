const express = require('express');
const router = express.Router();

console.log('Registering routes...');

const healthRoutes = require('./healthRoutes');
const classifyRoutes = require('./classifyRoutes');
const testRoutes = require('./testRoutes');

// Register all routes
router.use('/', healthRoutes);
router.use('/', classifyRoutes);
router.use('/', testRoutes);

console.log('Routes registered:');
console.log('  GET  /api/health');
console.log('  GET  /api/ping');
console.log('  POST /api/classify');
console.log('  POST /api/classify/batch');
console.log('  GET  /api/test');

module.exports = router;