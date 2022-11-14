const Gameboy = require('serverboy')
const fs = require('fs')

var gameboy = new Gameboy();
var rom = fs.readFileSync("./roms/Blue.gb");

gameboy.loadRom(rom);

let connectedClients = []


function sendToAllClients(data) {
  for (let i = 0; i < connectedClients.length; i++) {
    let ws = connectedClients[i]
    ws.send(data)
  }
}

function doFrame() {
  console.log('did frame')
  //Whatever custom logic you need
  var memory = gameboy.getMemory();
  //  if (memory[3000] === 0) {
  //      gameboy.pressKeys([Gameboy.KEYMAP.RIGHT]);
  //  }
  
  let frame = gameboy.doFrame();
  let sendData = {
    type: 'FrameData',
    data: frame
  }
  sendToAllClients(JSON.stringify(sendData))
}

const WebSocket = require('ws');
const WebSocketServer = require('ws').WebSocketServer;

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data, isBinary) {
    // console.log(isBinary);
    // console.log(data.toString())
    data = JSON.parse(data.toString())
    console.log(data)
  });
  connectedClients.push(ws)
  // ws.send('something');
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  while (true) {
    await sleep(100)
    doFrame()
  }
}


main()