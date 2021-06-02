const {
  handleConnect,
  handleCreateRoom,
  handleDisconnect,
  handleJoinRoom,
  handleLeaveRoom,
  handleStartRoom,
  handleVote,
} = require('./handlers');

async function setupLetsPick({ io, socket }) {
  const user = await handleConnect(socket);

  socket.on('createRoom', (items) => handleCreateRoom({ items, socket, user }));

  socket.on('joinRoom', (roomKey) =>
    handleJoinRoom({ io, roomKey, socket, user }),
  );

  socket.on('leaveRoom', (roomKey) =>
    handleLeaveRoom({ io, roomKey, socket, user }),
  );

  socket.on('startRoom', (roomKey) =>
    handleStartRoom({ io, roomKey, socket, user }),
  );

  socket.on('agree', ({ itemSlug, roomKey }) =>
    handleVote({ io, itemSlug, roomKey, socket, type: 'agree', user }),
  );

  socket.on('disagree', ({ itemSlug, roomKey }) =>
    handleVote({ io, itemSlug, roomKey, socket, type: 'disagree', user }),
  );

  socket.on('disconnecting', () => handleDisconnect({ io, socket, user }));
}

module.exports = setupLetsPick;
