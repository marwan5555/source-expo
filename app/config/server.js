const app = require('express')();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

io.on('connection', socket => {
  console.log('A user connected');

  // รับข้อความจากผู้ใช้และส่งกลับไปยังผู้ใช้ทุกคน
  socket.on('message', message => {
    console.log('Received message:', message);
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
