import logo from './logo.svg';
import './App.css';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import Canvas from './Components/Canvas';
import { Component, useState } from 'react';

class App extends Component {
  state = {
    frameData: undefined,
    attempts: 0
  }

  connect () {
    const client = new W3CWebSocket('ws://localhost:8080');
    client.onopen = () => {
      console.info('[open] Connection established');
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

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <Canvas width="160" height="144" framedata={this.state.frameData}/>
        </header>
      </div>
    );
  }
}
export default App;
