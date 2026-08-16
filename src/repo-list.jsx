import React from 'react';
import {reposForUser} from './api';
import createFragment from 'react-addons-create-fragment'
import Repo from './repo';

export default class RepoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { repos: [] };
  }

  componentDidMount() {
    reposForUser('michellechanme').then((repos) => {
      console.log(repos);
      this.setState({ repos: repos });
    });
  }

  render() {
    var repos = this.state.repos.map((repo) => {
      return <li key={repo.id}><Repo raw={repo} /></li>
    })
    return <ul>{ repos }</ul>
  }
}
