import React, { Component } from 'react';
import './App.css';

class StatusBar extends Component {
  constructor( props ) {
    super( props );
    this.minutes = 0;
    this.seconds = 0;
    this.allSeconds = 0;
    this.score = 0;
    this.padded = this.padded.bind(this);
    this.updateClock = this.updateClock.bind(this);
    setInterval( this.updateClock, 1000 );
  }

  padded(num) {
    return (num >= 10) ? num : '0' + num;
  }

  updateClock() {
    this.allSeconds += 1;
    this.seconds += 1;
    if( this.seconds >= 60 ) {
      this.seconds = 0;
      this.minutes += 1;
    }
    if( this.allSeconds === 0  ||  this.props.points === 0 )
      this.score = 0;
    else
      this.score = Math.floor(this.props.points / this.allSeconds);
  }

  render() {
    return (
      <div className="scoreboard">
        <div className="points">{this.props.points}</div>
        <div className="clock">{this.minutes}:{this.padded(this.seconds)}</div>
        <div className="score">{this.score}</div>
      </div>
    );
  }
}

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
    this.bubbles = [];
    this.flashes = [];
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
        this.flashes.push({
          x: ship.x,
          y: ship.y,
          speed: this.shipTypes[ship.type].speed,
          countdown: 20
        })
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
      if( ship.y > 370 ) { // Wrap ship to top of screen
        ship.x = Math.random() * 270;
        ship.y = 0;
        ship.color = Math.floor(Math.random() * 3);
        ship.collided = false;
      }
    })
    // Move bubbles and update ships hit
    this.bubbles.forEach( (bubble, index) => {
      bubble.y -= 5;
      this.ships.forEach( (ship) => {
        if( ship.x <= bubble.x + 16  &&  ship.x + 32 >= bubble.x  &&
            ship.y + 32 >= bubble.y - 3  &&  ship.y + 32 <= bubble.y + 3 ) {
          ship.color++; // Change ship color
          if( ship.color > 2 )  ship.color = 0;
        }
      });
      if( bubble.y <= 0 ) { // If bubble at top of play area, remove it
        this.bubbles.splice( index, 1 );
      }
    });
    // Update flashes
    this.flashes.forEach( (flash, index) => {
      flash.countdown -= 1;
      flash.y += flash.speed;
      if( flash.countdown <= 0 ) { // If countdown complete, remove flash
        this.flashes.splice( index, 1 );
      }
    });
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
    else if( e.key === ' ' ) { // Fire bubble
      this.bubbles.push( { x: this.state.x + 16, y: this.state.y + 10 } );
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
    // Create bubble images
    let bubbleObjects = this.bubbles.map( (bubble, index) => {
      const bubbleStyle = {
        left: bubble.x,
        top: bubble.y
      }
      return <img src='/images/bubble.png' alt='Bubble' style={bubbleStyle}
          className='bubble' key={'bubble' + index} />
    })
    // Create flashes
    let flashObjects = this.flashes.map( (flash, index) => {
      const flashStyle = {
        left: flash.x,
        top: flash.y,
        opacity: flash.countdown / 20
      }
      return <img src='/images/flash.png' alt='Flash' style={flashStyle}
          className='flash' key={'flash' + index} />
    });
    // Create player ship
    let playerShipStyle = {
      left: this.state.x,
      top: this.state.y
    }
    // Render page
    return (
      <div>
        <div className="App" onKeyDown={this.keyDown} onKeyUp={this.keyUp}>
          {bubbleObjects}
          {flashObjects}
          <img src='/images/player.png' style={playerShipStyle}
              className='ship' alt='Player' />
          {shipObjects}
        </div>
        <StatusBar points={this.state.points} />
      </div>
    );
  }
}

export default App;
