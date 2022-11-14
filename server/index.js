const Gameboy = require('serverboy')
const fs = require('fs')
/*
var gameboy = new Gameboy();
var rom = fs.readFileSync("./roms/Blue.gb");

gameboy.loadRom(rom);

setTimeout(function () {

   //Whatever custom logic you need
   var memory = gameboy.getMemory();
   if (memory[3000] === 0) {
       gameboy.pressKeys([Gameboy.KEYMAP.RIGHT]);
   }
   
   gameboy.doFrame();
}, 0);
*/

const WebSocket = require('ws');
const WebSocketServer = require('ws').WebSocketServer;

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data, isBinary) {
    console.log(isBinary);
    console.log(new Float32Array(5,data));
  });

  ws.send('something');
});

wss.on('open', function test(ts) {
    console.log('asdads')
})