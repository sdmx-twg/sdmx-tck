const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    var configuredTimeout = 120 * 60 * 1000; // 2 hours
    app.use(
        createProxyMiddleware('/tck-api/*', { 
            target: 'http://localhost:5000/',
            proxyTimeout: configuredTimeout,
            timeout: configuredTimeout
        })
    );
};