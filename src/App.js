import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      x: 100,
      y: 300,
      shipMovement: 0
    };
    this.shipColors = [ 'Red', 'Blue', 'Green' ];
    this.shipTypes = [
      { speed: 0 },
      { speed: 0.2 }
    ];
    this.ships = [
      { id: 0, x: 50, y: 50, type: 1, color: 0 },
      { id: 1, x: 100, y: 50, type: 1, color: 0 },
      { id: 2, x: 150, y: 50, type: 1, color: 0 }
    ];
    this.lasers = [];
    this.gameLoop = this.gameLoop.bind(this);
    this.keyDown = this.keyDown.bind(this);
    this.Up = this.keyUp.bind(this);
    setInterval( this.gameLoop, 16 ); // 16 == 60fps
  }

  componentWillMount() {
    document.addEventListener("keydown", this.keyDown.bind(this));
    document.addEventListener("keyup", this.keyUp.bind(this));
  }

  // Update ship positions
  gameLoop() {
    this.ships.forEach( (ship) => {
      ship.y += this.shipTypes[ship.type].speed;
      if( ship.y > 500 ) { // Wrap to top of screen
        ship.y = 0;
      }
    })
    // Move lasers and update ships hit
    this.lasers.forEach( (laser, index) => {
      laser.y -= 5;
      this.ships.forEach( (ship) => {
        if( ship.x <= laser.x  &&  ship.x + 32 >= laser.x + 4  &&
            ship.y + 32 >= laser.y - 2  &&  ship.y + 32 <= laser.y + 2 ) {
          ship.color++; // Change ship color
          if( ship.color > 2 )  ship.color = 0;
        }
      });
      if( laser.y <= 0 ) { // Remove
        this.lasers.splice( index, 1 );
      }
    })
    if( this.state.shipMovement < 0  &&  this.state.x > 0 ) {
      this.setState( { x: this.state.x + this.state.shipMovement } )
    }
    else if( this.state.shipMovement > 0  &&  this.state.x < 600 ) {
      this.setState( { x: this.state.x + this.state.shipMovement } )
    }
    this.forceUpdate();
  }

  keyDown = e => {
    //console.log( "Key down: " + e.key );
    if( e.key === 'ArrowLeft' ) { // Move left
      this.setState( { shipMovement: -2 } );
    }
    else if( e.key === 'ArrowRight' ) { // Move right
      this.setState( { shipMovement: 2 } );
    }
    else if( e.key === ' ' ) { // Fire laser
      this.lasers.push( { x: this.state.x + 16, y: this.state.y - 32 } );
    }
  }

  keyUp = e => {
    //console.log( "Key up: " + e.key );
    if( e.key === 'ArrowLeft' ) {
      this.setState( { shipMovement: 0 } );
    }
    else if( e.key === 'ArrowRight' ) {
      this.setState( { shipMovement: 0 } );
    }
  }

  render() {
    let shipObjects = this.ships.map( (ship) => {
      const enemyShipStyle = {
        left: ship.x,
        top: ship.y
      }
      return <img src={'/images/enemy' + this.shipColors[ship.color] +
          ship.type + '.png'} alt='Enemy' style={enemyShipStyle}
          className='ship' key={'enemy'+ship.id} />
    });
    let laserObjects = this.lasers.map( (laser, index) => {
      const laserStyle = {
        left: laser.x,
        top: laser.y
      }
      return <img src='/images/laserRed01.png' alt='Laser' style={laserStyle}
          className='laser' key={'laser' + index} />
    })
    let playerShipStyle = {
      left: this.state.x,
      top: this.state.y
    }
    return (
      <div className="App" onKeyDown={this.keyDown} onKeyUp={this.keyUp}>
        {laserObjects}
        <img src='/images/playerShip1_blue.png' style={playerShipStyle}
            className='ship' alt='Player' />
        {shipObjects}
      </div>
    );
  }
}

export default App;
