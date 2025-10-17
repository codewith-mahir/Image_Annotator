const express = require('express');

const app = express();
const PORT = 5000;

console.log('Starting minimal server...');

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ message: 'login endpoint' });
});

const server = app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
  console.log(`Test: curl http://localhost:${PORT}/health`);
});

process.on('uncaughtException', (error) => {
  console.error('ERROR:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('REJECTION:', reason);
  process.exit(1);
});

// Keep the process alive
process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  server.close();
});

process.on('SIGINT', () => {
  console.log('SIGINT received');
  server.close();
  process.exit(0);
});
