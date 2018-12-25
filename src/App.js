import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      x: 100,
      y: 100
    }
  }
  render() {
    let ships = '';
    let playerShipStyle = {
      left: this.state.x,
      top: this.state.y
    }
    return (
      <div className="App">
        <img src='/images/playerShip1_blue.png' style={playerShipStyle} className='playerShip' alt='Player' />
      </div>
    );
  }
}

export default App;
