import type { Express } from 'express';
import { createServer, type Server } from 'http';
import { setupAuth } from './auth';

export function registerRoutes(app: Express): Server {
  // Sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // Add application routes here
  // Prefix all routes with /api

  // Example route
  app.get('/api/status', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
  });

  const httpServer = createServer(app);

  return httpServer;
}