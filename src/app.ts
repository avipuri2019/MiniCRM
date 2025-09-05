import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import http from 'http';
import { createWebSocketServer, broadcast } from './utils/websocket';
import { initDatabase } from './config/database';

//import routes
import authRoutes from './routes/auth.routes';
import accountRoutes from './routes/accounts.routes';
import leadRoutes from './routes/leads.routes';
import activityRoutes from './routes/activities.routes'; 

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Initialize database
initDatabase();

//security middleware
app.use(helmet());
app.use(cors());

//body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//create websocket server
const wss = createWebSocketServer(server);

app.locals.broadcast = (message: any): void => broadcast(wss, message);


//routes
app.use('/auth', authRoutes);
app.use('/accounts', accountRoutes);
app.use('/leads', leadRoutes);
app.use('/accounts/:id/activities', activityRoutes);

//Health check
app.get('/health', (req, res): void => {
  res.json({ status: 'All Good' });
});

// Test security Headers
app.get('/test-security', (req, res): void => {
  res.json({
    message: 'check response headers for Helmet security headers',
    corsEnabled: true,
    helmetEnabled: true,
  });
});

// 404 routes handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

//Error Handling
app.use(
  (
    error: any,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.log('Error:', error);
    res.status(500).json({ error: 'Internal server Error' });
  }
);


// Start server
server.listen(PORT, (): void => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`WebSocket endpoint: ws://localhost:${PORT}/ws/updates`);
});
