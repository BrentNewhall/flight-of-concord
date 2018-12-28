import React, { Component } from 'react';
import './App.css';

/* Instructions -- Displays instructions. */

class Instructions extends Component {
   render() {
      var readyToLevel = '';
      if( this.props.points >= this.props.pointsTarget  &&
          this.props.level !== 4 ) {
        readyToLevel = <p><strong>&uarr;</strong> Move to the next level!</p>
      }
      return (
        <div className="instructions">
          <p><strong>[Space]</strong> Fire bubble</p>
          <p>&larr; Move left</p>
          <p>&rarr; Move right</p>
          <p>&darr; Pause</p>
          {readyToLevel}
        </div>
      );
    }
  }

  export default Instructions;