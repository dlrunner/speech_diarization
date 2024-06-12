const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = function(app) {
    app.use(
        "/uploadfile",
        createProxyMiddleware({
            target: "http://localhost:5173",
            changeOrigin: true
        })
    )
}