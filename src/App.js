import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      x: 100,
      y: 300
    };
    this.shipTypes = [
      { speed: 0 },
      { speed: 0.2 }
    ];
    this.ships = [
      { id: 0, x: 50, y: 50, type: 1 },
      { id: 1, x: 100, y: 50, type: 1 },
      { id: 2, x: 150, y: 50, type: 1 }
    ];
    this.gameLoop = this.gameLoop.bind(this);
    setInterval( this.gameLoop, 16 ); // 16 == 60fps
  }

  // Update ship positions
  gameLoop() {
    this.ships.forEach( (ship) => {
      ship.y += this.shipTypes[ship.type].speed;
      if( ship.y > 500 ) // Wrap to top of screen
        ship.y = 0;
    })
    this.forceUpdate();
  }

  render() {
    let shipObjects = this.ships.map( (ship) => {
      const enemyShipStyle = {
        left: ship.x,
        top: ship.y
      }
      return <img src={'/images/enemyRed' + ship.type + '.png'} alt='Enemy' style={enemyShipStyle} className='ship' key={'enemy'+ship.id} />
    });
    let playerShipStyle = {
      left: this.state.x,
      top: this.state.y
    }
    return (
      <div className="App">
        <img src='/images/playerShip1_blue.png' style={playerShipStyle} className='ship' alt='Player' />
        {shipObjects}
      </div>
    );
  }
}

export default App;
