const roomInstances = {};

class Room {
  constructor() {
    this.key = null;
    this.state = 'lobby';
    this.items = [];
    this.owner = {
      id: null,
      slug: null,
    };
    this.users = {};
    this.votes = 0;
  }

  setKey(key) {
    this.key = key;
    return this;
  }

  setOwner(socket, user) {
    this.owner = {
      id: socket.id,
      slug: user.slug,
    };
    return this;
  }

  setItems(items) {
    this.items = items.map((item) => ({
      ...item,
      agreedBy: [],
      disagreedBy: [],
    }));
    return this;
  }

  addUser(socket, user) {
    this.users[user.slug] = socket.id;
    return this;
  }

  removeUser(user) {
    delete this.users[user.slug];
    return this;
  }

  start() {
    this.state = 'started';
    return this;
  }

  disband(roomKey) {
    delete roomInstances[roomKey];
  }

  save(roomKey) {
    roomInstances[roomKey] = this;
    return this;
  }

  static get(roomKey) {
    return roomInstances[roomKey] || null;
  }
}

module.exports = Room;
