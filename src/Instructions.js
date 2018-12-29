import React, { Component } from 'react';
import './App.css';

/* Instructions -- Displays instructions. */

class Instructions extends Component {
   render() {
      var flowers = [];
      for( let i = 0; i <= this.props.level; i++ ) {
        const flowerStyle = {
          top: 0,
          left: i * 30
        }
        flowers.push( <img src={'images/flower1' + this.props.flowerColors[i] +
        '.png'} alt='Enemy' style={flowerStyle}
        className='flower' key={'flowerExample'+i} /> );
      }
      return (
        <div className="instructions">
          {flowers}
          <p><strong>[Space]</strong> Fire bubble</p>
          <p>&larr; Move left</p>
          <p>&rarr; Move right</p>
          <p>&darr; Pause</p>
        </div>
      );
    }
  }

  export default Instructions;