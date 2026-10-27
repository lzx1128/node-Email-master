'use strict';

const { createApp } = require('./app');

const port = 3000;
const server = createApp().listen(port, () => {
  console.log(`Email API running at http://localhost:${port}`);
});

function shutdown(signal) {
  console.log(`${signal} received, shutting down`);
  server.close(() => process.exit(0));
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
