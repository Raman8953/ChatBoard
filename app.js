
var express = require('express');
var path = require('path')
var app = express();
var http = require('http').createServer(app);
const port = process.env.port || 3000 ; 

http.listen(port, ()=>{
  console.log(`Server are worked on ${port}`)
})
app.use(express.static(path.join(__dirname, '/public')));
app.get('/',async(req,res) => {
  res.sendFile(__dirname + '/index.html');
})

const io = require('socket.io')(http)
let usernumber = 0;
io.on('connection', (socket) => {
  console.log('Connected...')
  usernumber++
  if (usernumber <= 3){
    socket.join('chatgrp');
    socket.emit('usernumber',usernumber);
    socket.to('chatgrp').emit('usernumber',usernumber);
    socket.on('message', (msg) => {
    socket.to('chatgrp').emit('message', msg);
    })
    socket.on('disconnect', ()=>{
      usernumber--;
      socket.emit('usernumber',usernumber);
      socket.to('chatgrp').emit('usernumber',usernumber);
    })
  }
});


module.exports = app;
