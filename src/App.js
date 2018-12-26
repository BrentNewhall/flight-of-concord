import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      x: 100,
      y: 360,
      shipMovement: 0,
      points: 0
    };
    this.shipColors = [ 'red', 'blue', 'yellow' ];
    this.shipTypes = [
      { speed: 0 },
      { speed: 0.4 }
    ];
    this.ships = [];
    for( let i = 0; i < 10; i++ ) {
      this.ships.push(
        {
          id: i,
          x: Math.random() * 270,
          y: Math.random() * 250,
          type: 1,
          color: Math.floor(Math.random() * 3),
          collided: false
        }
      )
    }
    this.lasers = [];
    this.shipCollision = this.shipCollision.bind(this);
    this.gameLoop = this.gameLoop.bind(this);
    this.keyDown = this.keyDown.bind(this);
    this.Up = this.keyUp.bind(this);
    setInterval( this.gameLoop, 16 ); // 16 == 60fps
  }

  componentWillMount() {
    document.addEventListener("keydown", this.keyDown.bind(this));
    document.addEventListener("keyup", this.keyUp.bind(this));
  }

  shipCollision( targetColor ) {
    //alert( "Collision!" );
    this.ships.forEach( (ship) => {
      if( ship.color === targetColor ) {
        this.setState( { points: this.state.points + 10 } );
      }
    });
  }

  gameLoop() {
    // Update ship positions
    this.ships.forEach( (ship) => {
      ship.y += this.shipTypes[ship.type].speed;
      // If ship has collided with player, process the collision.
      if( ship.x <= this.state.x + 32  &&
          ship.x + 32 >= this.state.x  &&
          ship.y <= this.state.y + 32  &&
          ship.y + 32 >= this.state.y  &&
          ! ship.collided ) {
        this.shipCollision( ship.color );
        ship.collided = true;
      }
      if( ship.y > 380 ) { // Wrap ship to top of screen
        ship.x = Math.random() * 270;
        ship.y = 0;
        ship.color = Math.floor(Math.random() * 3);
        ship.collided = false;
      }
    })
    // Move lasers and update ships hit
    this.lasers.forEach( (laser, index) => {
      laser.y -= 5;
      this.ships.forEach( (ship) => {
        if( ship.x <= laser.x  &&  ship.x + 32 >= laser.x + 4  &&
            ship.y + 32 >= laser.y - 3  &&  ship.y + 32 <= laser.y + 3 ) {
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
    else if( this.state.shipMovement > 0  &&  this.state.x < 270 ) {
      this.setState( { x: this.state.x + this.state.shipMovement } )
    }
    this.forceUpdate();
  }

  // Process key press
  keyDown = e => {
    //console.log( "Key down: " + e.key );
    if( e.key === 'ArrowLeft' ) { // Move left
      this.setState( { shipMovement: -2 } );
    }
    else if( e.key === 'ArrowRight' ) { // Move right
      this.setState( { shipMovement: 2 } );
    }
    else if( e.key === ' ' ) { // Fire laser
      this.lasers.push( { x: this.state.x + 16, y: this.state.y + 10 } );
    }
  }

  // Key has been depressed; disable appropriate behavior
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
    // Create ship images
    let shipObjects = this.ships.map( (ship) => {
      const enemyShipStyle = {
        left: ship.x,
        top: ship.y
      }
      let shipType = (ship.collided ? 'blank' : this.shipColors[ship.color] );
      return <img src={'/images/flower' + ship.type + 
          shipType + '.png'} alt='Enemy' style={enemyShipStyle}
          className='ship' key={'enemy'+ship.id} />
    });
    // Create laser images
    let laserObjects = this.lasers.map( (laser, index) => {
      const laserStyle = {
        left: laser.x,
        top: laser.y
      }
      return <img src='/images/laserRed01.png' alt='Laser' style={laserStyle}
          className='laser' key={'laser' + index} />
    })
    // Create ship
    let playerShipStyle = {
      left: this.state.x,
      top: this.state.y
    }
    // Render page
    return (
      <div>
        <div className="App" onKeyDown={this.keyDown} onKeyUp={this.keyUp}>
          {laserObjects}
          <img src='/images/playerShip1_blue.png' style={playerShipStyle}
              className='ship' alt='Player' />
          {shipObjects}
        </div>
        <div className="scoreboard">{this.state.points}</div>
      </div>
    );
  }
}

export default App;
