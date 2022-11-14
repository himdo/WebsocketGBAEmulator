import logo from './logo.svg';
import './App.css';
import { client, w3cwebsocket as W3CWebSocket } from 'websocket';
import Canvas from './Components/Canvas';
import { Component, useState } from 'react';
import { Button, Grid } from '@mui/material';

class App extends Component {
  state = {
    frameData: undefined,
    attempts: 0,
    client: undefined
  }

  connect () {
    const client = new W3CWebSocket('ws://localhost:8080');
    client.onopen = () => {
      console.info('[open] Connection established');
      this.setState({client: client, attempts: 0})
      // client.send(JSON.stringify({ type: 'HANDSHAKE True' }));
    }
  
    client.onmessage = (msg) => {
      const obj = JSON.parse(msg.data);
      switch (obj.type) {
        case 'FrameData':
          this.setState({frameData: obj.data})
          break
        default:
          console.error('Could not parse websocket message', obj);
          break;
      }
    };
  
    client.onclose = (e) => {
      this.setState({client: undefined})
      if (e.wasClean) {
        console.info(`[close] Connection closed cleanly, code=${e.code} reason=${e.reason}`);
      } else {
        console.warn('[close] Connection died');
      }
  
      const attempts = this.state.attempts;
      this.setState({ attempts: attempts + 1 });
      setTimeout(() => {
        this.connect();
      }, 1000 + 1000 * Math.pow(2, Math.min(attempts, 8)));
    };
  }

  componentDidMount() {
    this.connect();
  }

  sendButtonPress(button) {
    if (typeof this.state.client !== "undefined") {
      let data = {
        type: 'ButtonPress',
        data: button
      }
      this.state.client.send(JSON.stringify(data))
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Canvas style={{width:"40%", height: "40%"}} width="160" height="144" framedata={this.state.frameData}/>
          <Button onClick={() => this.sendButtonPress('UP')}>UP</Button>
          <Button onClick={() => this.sendButtonPress('RIGHT')}>RIGHT</Button>
          <Button onClick={() => this.sendButtonPress('DOWN')}>DOWN</Button>
          <Button onClick={() => this.sendButtonPress('LEFT')}>LEFT</Button>
          <Button onClick={() => this.sendButtonPress('B')}>B</Button>
          <Button onClick={() => this.sendButtonPress('A')}>A</Button>
          <Button onClick={() => this.sendButtonPress('Start')}>Start</Button>
          <Button onClick={() => this.sendButtonPress('Select')}>Select</Button>
        </header>
      </div>
    );
  }
}
export default App;
