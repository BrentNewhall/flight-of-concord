import React, { Component } from 'react';
import './App.css';

import bgMusic from './audio/InfinitePerspective.mp3';

/* StatusBar -- Displays points, timer, and score. */

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
      flowerMovement: 0,
      points: 0
    };
    this.flowerColors = [ 'red', 'blue', 'yellow' ];
    this.flowerTypes = [
      { speed: 0 },
      { speed: 0.4 }
    ];
    this.flowers = [];
    for( let i = 0; i < 16; i++ ) {
      this.flowers.push(
        {
          id: i,
          x: Math.random() * 270,
          y: i * 20,
          type: 1,
          color: Math.floor(Math.random() * 3),
          collided: false
        }
      )
    }
    this.bubbles = [];
    this.flashes = [];
    this.beeps = [
      new Audio('./audio/beep.mp3'),
      new Audio('./audio/beep.mp3'),
      new Audio('./audio/beep.mp3')
    ];
    this.beep = 0;
    this.flowerCollision = this.flowerCollision.bind(this);
    this.gameLoop = this.gameLoop.bind(this);
    this.keyDown = this.keyDown.bind(this);
    this.Up = this.keyUp.bind(this);
    setInterval( this.gameLoop, 16 ); // 16 == 60fps
  }

  componentWillMount() {
    document.addEventListener("keydown", this.keyDown.bind(this));
    document.addEventListener("keyup", this.keyUp.bind(this));
  }

  componentDidMount() {
    document.getElementById('bgMusic').volume = 0.4;
    document.getElementById('bgMusic').play();
  }

  flowerCollision( targetColor ) {
    // Play beep and cycle to next beep sound (so we can play multiple beeps
    // over top of each other)
    this.beeps[this.beep].play();
    this.beep += 1;
    if( this.beep >= this.beeps.length )  this.beep = 0;
    // Look for flowers of the same color
    this.flowers.forEach( (flower) => {
      if( flower.color === targetColor ) {
        this.setState( { points: this.state.points + 10 } );
        this.flashes.push({
          x: flower.x,
          y: flower.y,
          speed: this.flowerTypes[flower.type].speed,
          countdown: 20
        })
      }
    });
  }

  gameLoop() {
    // Update flower positions
    this.flowers.forEach( (flower) => {
      flower.y += this.flowerTypes[flower.type].speed;
      // If flower has collided with player, process the collision.
      if( flower.x <= this.state.x + 32  &&
          flower.x + 32 >= this.state.x  &&
          flower.y <= this.state.y + 32  &&
          flower.y + 32 >= this.state.y  &&
          ! flower.collided ) {
        this.flowerCollision( flower.color );
        flower.collided = true;
      }
      if( flower.y > 370 ) { // Wrap flower to top of screen
        flower.x = Math.random() * 270;
        flower.y = 0;
        flower.color = Math.floor(Math.random() * 3);
        flower.collided = false;
      }
    })
    // Move bubbles and update flowers hit
    this.bubbles.forEach( (bubble, index) => {
      bubble.y -= 5;
      this.flowers.forEach( (flower) => {
        if( flower.x <= bubble.x + 16  &&  flower.x + 32 >= bubble.x  &&
            flower.y + 32 >= bubble.y - 3  &&  flower.y + 32 <= bubble.y + 3 ) {
          flower.color++; // Change flower color
          if( flower.color > 2 )  flower.color = 0;
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
    if( this.state.flowerMovement < 0  &&  this.state.x > 0 ) {
      this.setState( { x: this.state.x + this.state.flowerMovement } )
    }
    else if( this.state.flowerMovement > 0  &&  this.state.x < 270 ) {
      this.setState( { x: this.state.x + this.state.flowerMovement } )
    }
    this.forceUpdate();
  }

  // Process key press
  keyDown = e => {
    //console.log( "Key down: " + e.key );
    if( e.key === 'ArrowLeft' ) { // Move left
      this.setState( { flowerMovement: -4 } );
    }
    else if( e.key === 'ArrowRight' ) { // Move right
      this.setState( { flowerMovement: 4 } );
    }
    else if( e.key === ' ' ) { // Fire bubble
      this.bubbles.push( { x: this.state.x + 16, y: this.state.y + 10 } );
    }
  }

  // Key has been depressed; disable appropriate behavior
  keyUp = e => {
    //console.log( "Key up: " + e.key );
    if( e.key === 'ArrowLeft' ) {
      this.setState( { flowerMovement: 0 } );
    }
    else if( e.key === 'ArrowRight' ) {
      this.setState( { flowerMovement: 0 } );
    }
  }

  render() {
    // Create flower images
    let flowerObjects = this.flowers.map( (flower) => {
      const flowerStyle = {
        left: flower.x,
        top: flower.y
      }
      let flowerType = (flower.collided ?
          'blank' : this.flowerColors[flower.color] );
      return <img src={'/images/flower' + flower.type + 
          flowerType + '.png'} alt='Enemy' style={flowerStyle}
          className='flower' key={'enemy'+flower.id} />
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
    // Create player flower
    let playerStyle = {
      left: this.state.x,
      top: this.state.y
    }
    // Render page
    return (
      <div>
        <div className="App" onKeyDown={this.keyDown} onKeyUp={this.keyUp}>
          {bubbleObjects}
          {flashObjects}
          <img src='/images/player.png' style={playerStyle}
              className='flower' alt='Player' />
          {flowerObjects}
        </div>
        <StatusBar points={this.state.points} />
        <div className="instructions">
          Use the left and right arrow keys to move your avatar, and the space
          key to fire a bubble.
        </div>
        <audio id='bgMusic' src={bgMusic} loop />
      </div>
    );
  }
}

export default App;
