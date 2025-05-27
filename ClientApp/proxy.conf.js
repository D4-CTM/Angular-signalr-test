const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7031';

const PROXY_CONFIG = [
  {
    context: [
      "/weatherforecast",
      "/todoapp",
      "/hubs/graphs",
   ],
    proxyTimeout: 10000,
    target: target,
    ws: true,
    changeOrigin: true,
    logLevel: "debug",
    secure: false,
    headers: {
      Connection: 'Keep-Alive'
    },
  }
]

module.exports = PROXY_CONFIG;
