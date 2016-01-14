import React from 'react';
import ReactDOM from 'react-dom';

//A module can have many named exports but only one default export.

class HelloWorld extends React.Component {
  render() {
    return <p>Hello world</p>;
  }
}

ReactDOM.render(<HelloWorld />, document.body);
