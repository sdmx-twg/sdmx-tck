const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    var configuredTimeout = 120 * 60 * 1000; // 2 hours
    app.use(
        createProxyMiddleware('/tck-api/*', { 
<<<<<<< HEAD
            target: 'http://localhost:5000/',
=======
            target: process.env.REACT_APP_PROXY_HOST,
>>>>>>> v4.8.0
            proxyTimeout: configuredTimeout,
            timeout: configuredTimeout
        })
    );
};