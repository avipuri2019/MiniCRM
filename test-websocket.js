const WebSocket = require('ws');

// Replace with actual JWT token from login
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4ODJlNWUxNC05NmJiLTQ5MWQtYWRhZC05OTYwYWZkMjI3YmMiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoicmVwIiwiaWF0IjoxNzU3MDkyMTM1LCJleHAiOjE3NTcxNzg1MzV9.2iDhs437Mx_hPEEym8pnQeA6_Omd_DfVSOnUs_u-1d4';

const ws = new WebSocket(`ws://localhost:3000/ws/updates?token=${token}`);

ws.on('open', () => {
  console.log('✅ Connected to WebSocket');
});

ws.on('message', (data) => {
  const message = JSON.parse(data.toString());
  console.log('📨 Received:', message);
});

ws.on('error', (error) => {
  console.log('❌ Error:', error.message);
});

ws.on('close', () => {
  console.log('🔌 Connection closed');
});
