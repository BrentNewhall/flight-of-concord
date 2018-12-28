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
      this.score = this.props.pointsTarget - this.props.points;
      if( this.score < 0 )  this.score = 0;
    }
  
    render() {
      var scoreText = '';
      if( this.score === 0 ) {
        if( this.props.level === 4 ) {
          scoreText = 'You win!'
        }
        else {
          scoreText = 'Level up!';
        }
      }
      else {
        scoreText = this.score;
      }
      return (
        <div className="scoreboard">
          <div className="points">{this.props.points}</div>
          <div className="clock">Level {this.props.level}</div>
          <div className="score">{scoreText}</div>
        </div>
      );
    }
  }

  export default StatusBar;