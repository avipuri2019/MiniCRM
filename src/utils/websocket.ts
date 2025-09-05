import WebSocket from 'ws';
import { IncomingMessage } from 'http';
import { verifyToken } from './auth';

export interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
}

/**
 * Create WebSocket server with authentication
 */
export const createWebSocketServer = (server: any): WebSocket.Server => {
  const wss = new WebSocket.Server({
    server,
    path: '/ws/updates',
    verifyClient: (info: { req: IncomingMessage }): boolean => {
      try {
        const url = new URL(info.req.url!, `http://${info.req.headers.host}`);
        const token = url.searchParams.get('token');

        if (!token) return false;

        const payload = verifyToken(token);
        (info.req as any).userId = payload.userId;
        return true;
      } catch {
        return false;
      }
    },
  });

  wss.on(
    'connection',
    (ws: AuthenticatedWebSocket, req: IncomingMessage): void => {
      ws.userId = (req as any).userId;

      ws.on('error', (error): void => {
        // eslint-disable-next-line no-console
        console.error('WebSocket error:', error);
      });

      ws.send(
        JSON.stringify({
          type: 'connection_established',
          message: 'Connected to live updates',
        })
      );
    }
  );

  return wss;
};

/**
 * Broadcast message to all connected clients
 */
export const broadcast = (wss: WebSocket.Server, message: any): void => {
  const payload = JSON.stringify(message);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
};
