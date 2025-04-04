import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5173;

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Proxy API requests to the backend server
app.use('/api', (req, res) => {
  const targetUrl = `http://localhost:5000${req.url}`;
  console.log(`Proxying request to: ${targetUrl}`);
  res.redirect(307, targetUrl);
});

// All other requests should serve the SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});