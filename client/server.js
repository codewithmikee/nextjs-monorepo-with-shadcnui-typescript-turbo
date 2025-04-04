import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5173;

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Proxy API requests to the backend server
app.use('/api', (req, res, next) => {
  // Forward the request to the backend server
  const targetUrl = `http://localhost:5000${req.url}`;
  console.log(`Proxying request to: ${targetUrl}`);
  
  // Instead of redirect, use fetch to proxy the request
  fetch(targetUrl, {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      ...(req.headers.cookie ? { 'Cookie': req.headers.cookie } : {})
    },
    body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    credentials: 'include'
  })
  .then(response => {
    // Copy status and headers from the backend response
    res.status(response.status);
    
    // Copy cookies from backend response
    const cookies = response.headers.get('set-cookie');
    if (cookies) {
      res.setHeader('Set-Cookie', cookies);
    }
    
    return response.json();
  })
  .then(data => {
    res.json(data);
  })
  .catch(error => {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy request failed' });
  });
});

// All other requests should serve the SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});