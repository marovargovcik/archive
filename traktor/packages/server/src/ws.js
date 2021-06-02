const { Server } = require('socket.io');

const setupLetsPick = require('./games/lets-pick');
const { session } = require('./clients');

function setupWsServer(server) {
  const io = new Server(server, { cors: { origin: 'http://localhost:8000' } });

  io.use((socket, next) => {
    session(socket.request, {}, next);
  });

  io.on('connection', async (socket) => {
    await setupLetsPick({ io, socket });
  });
}

module.exports = setupWsServer;
