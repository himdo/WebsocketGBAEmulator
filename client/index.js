const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');
let frameData = undefined
ws.on('open', function open() {
  // let data = {"a":"b"}
  // ws.send(JSON.stringify(data));

});

ws.on('message', function message(data, isBinary) {
  // console.log(isBinary);
  // console.log(data.toString())
  try {
    data = JSON.parse(data)
    console.log(data['type'])
    if (data['type'] === 'FrameData') {
      console.log('=========================================================')
      console.log('=========================================================')
      console.log('=========================================================')
      console.log(data['data'].length)
      console.log('=========================================================')
      console.log('=========================================================')
      console.log('=========================================================')
      frameData = data['data']
    }
  } catch (error) {
    console.error(error)
  }
});