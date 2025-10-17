const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  const target = process.env.PROXY_TARGET || 'http://localhost:5000';

  console.log('🔧 Setting up proxy to:', target);

  // Proxy /api/* to backend, preserving the /api prefix
  app.use(
    '/api',
    createProxyMiddleware({
      target,
      changeOrigin: true,
      // Don't rewrite the path - keep /api in the path
      onError: (err, req, res) => {
        console.error('❌ Proxy error for', req.path, ':', err.message);
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log(`📤 Proxying: ${req.method} ${req.path}`);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(`📥 Response: ${proxyRes.statusCode} for ${req.path}`);
      }
    })
  );

  // Proxy /uploads/* to backend
  app.use(
    '/uploads',
    createProxyMiddleware({
      target,
      changeOrigin: true
    })
  );
};
