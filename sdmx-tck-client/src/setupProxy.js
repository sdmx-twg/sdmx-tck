const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    var configuredTimeout = 120 * 60 * 1000; // 2 hours
    app.use(
        createProxyMiddleware('/tck-api/*', { 
            target: process.env.REACT_APP_PROXY_HOST,
            proxyTimeout: configuredTimeout,
            timeout: configuredTimeout
        })
    );
};