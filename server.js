const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve files from dist
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`React sample served at http://localhost:${port}`);
});

// Simple redirect/proxy for OAuth endpoints that may be hardcoded to localhost:5000
// This lets the frontend (if built with authServerUrl=http://localhost:5000) still
// trigger the real Quickteller UAT auth server by visiting http://localhost:5000/oauth2/...
const proxyPort = 5000;
const proxyApp = express();

proxyApp.get('/oauth2/*', (req, res) => {
  // Map local /oauth2/* to the API path used in UAT:
  // /oauth2/authorize -> /api/v1/auth/oauth2/authorize
  const mappedPath = `/api/v1/auth${req.originalUrl}`; // req.originalUrl starts with /oauth2/...
  const target = `https://uat-api.quickteller.com${mappedPath}`;
  console.log(`Proxy redirect: ${req.originalUrl} -> ${target}`);
  res.redirect(target);
});

proxyApp.listen(proxyPort, () => {
  console.log(`OAuth proxy listening at http://localhost:${proxyPort} and redirecting to Quickteller UAT`);
});
