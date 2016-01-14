import React from 'react';
import ReactDOM from 'react-dom';

//A module can have many named exports but only one default export.
import RepoList from './repo-list';

class HelloWorld extends React.Component {
  render() {
    return (
      <div>
        <h1>Reflectrum</h1>
        <RepoList />
      </div>
    )
  }
}

ReactDOM.render(<HelloWorld />, document.body);
