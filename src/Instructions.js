import React, { Component } from 'react';
import './App.css';

/* Instructions -- Displays instructions. */

class Instructions extends Component {
   render() {
      var readyToLevel = '';
      if( this.props.points >= this.props.pointsTarget ) {
        readyToLevel = <p>Press up arrow to move to the next level!</p>
      }
      return (
        <div className="instructions">
          <p>Use the left and right arrow keys to move your avatar, and the space
          space key to fire a bubble.</p>
          {readyToLevel}
        </div>
      );
    }
  }

  export default Instructions;