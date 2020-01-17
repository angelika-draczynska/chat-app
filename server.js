const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

app.use(express.static(path.join(__dirname + '/client')));

app.use((req, res, next) => {
  res.show = name => {
    res.sendFile(path.join(__dirname + `/client/${name}`));
  };
  next();
});

app.get('/', function(req, res) {
  res.show('index.html');
});

const messages = [];

const server = app.listen(8000, () => {
  console.log('Server is running on Port:', 8000);
});

const io = socket(server);

io.on('connection', socket => {
  console.log('New client! Its id – ' + socket.id);
  
  socket.on('message', message => {
    console.log("Oh, I've got something from " + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });
  socket.on('disconnect', () => {
    console.log('Oh, socket ' + socket.id + ' has left');
  });
  console.log("I've added a listener on message and disconnect events \n");
});
