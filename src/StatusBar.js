import React, { Component } from 'react';
import './App.css';

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
      if( ! this.props.gameStarted )
        return;
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

  export default StatusBar;