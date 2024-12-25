const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      // target: 'http://localhost:5000',
      target: 'http://148.251.126.212:5000',
      changeOrigin: true,
    })
  );
};