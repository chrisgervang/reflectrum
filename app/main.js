import React from 'react';
import ReactDOM from 'react-dom';

//A module can have many named exports but only one default export.
import Clock from './clock/clock.js';
import Calendar from './calendar/calendar.js'

class Main extends React.Component {
  render() {
     return (
      <div>
        <h1>Reflectrum</h1>
        <Calendar />
        
      </div>
    )
  }
}

ReactDOM.render(<Main />, document.body);
