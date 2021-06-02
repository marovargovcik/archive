import { Box as MuiBox } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';

import { createNotification } from '../../../redux/notifications/notifications.slice';
import ActionBar from './ActionBar/ActionBar.component';
import Board from './Board/Board.component';
import Intro from './Intro/Intro.component';
import Result from './Result/Result.component';

function LetsPick() {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState(null);
  const [match, setMatch] = useState(null);

  useEffect(() => {
    const socket = io();
    setSocket(socket);

    socket.on('roomCreated', setRoom);

    socket.on('roomStarted', setRoom);

    socket.on('roomDisbanded', (message) => {
      dispatch(createNotification(message));
      setRoom(null);
    });

    socket.on('matchFound', (item) => {
      setMatch(item);
      setRoom(null);
    });

    socket.on('matchNotFound', () => {
      setMatch(false);
      setRoom(null);
    });

    socket.on('roomLeft', () => setRoom(null));

    socket.on('userJoined', setRoom);

    socket.on('userLeft', setRoom);

    socket.on('error', (error) => dispatch(createNotification(error)));

    return () => {
      socket.close();
    };
  }, [dispatch]);

  function resetMatch() {
    setMatch(null);
  }

  function handleCreateRoom(items) {
    socket.emit('createRoom', items);
  }

  function handleJoinRoom(key) {
    socket.emit('joinRoom', key);
  }

  function handleLeaveRoom() {
    socket.emit('leaveRoom', room.key);
  }

  function handleStartRoom() {
    socket.emit('startRoom', room.key);
  }

  function handleAgree(itemSlug) {
    socket.emit('agree', { itemSlug, roomKey: room.key });
  }

  function handleDisagree(itemSlug) {
    socket.emit('disagree', { itemSlug, roomKey: room.key });
  }

  return (
    <MuiBox height='100vh' position='relative'>
      <Result match={match} onClose={resetMatch} />
      {!room && <Intro onCreate={handleCreateRoom} onJoin={handleJoinRoom} />}
      {room && (
        <MuiBox height='calc(100% - 80px)'>
          <Board
            onAgree={handleAgree}
            onDisagree={handleDisagree}
            room={room}
          />
          <ActionBar
            onLeave={handleLeaveRoom}
            onStart={handleStartRoom}
            room={room}
          />
        </MuiBox>
      )}
    </MuiBox>
  );
}

export default LetsPick;
