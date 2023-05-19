const express = require('express');
const httpProxy = require('http-proxy');

// List of static proxy IP addresses to rotate through
const proxyList = [
    '20.204.190.254:3129',
    '20.204.214.79:3129',
    '181.189.135.90:8080',
    '186.121.235.66:8080',
    '178.33.3.163:8080',
    '174.138.184.82:8080'
];

// Create a Node.js server that listens for incoming requests
const app = express();
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

// Create a proxy server that forwards incoming requests to a selected proxy
const proxy = httpProxy.createProxyServer();

// Function to select a random proxy from the list
function selectProxy() {
  const randomIndex = Math.floor(Math.random() * proxyList.length);
  return proxyList[randomIndex];
}

// Initial configuration using a random proxy from the list
let currentProxy = selectProxy();
proxy.on('proxyReq', function(proxyReq, req, res, options) {
  options.host = currentProxy;
  options.port = 80;
});

// Set a timer to periodically update the proxy server configuration
setInterval(() => {
  const newProxy = selectProxy();
  console.log(`Changing proxy from ${currentProxy} to ${newProxy}`);
  currentProxy = newProxy;
}, 1 * 60 * 1000); // Rotate every 2 minutes