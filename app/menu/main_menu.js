import React from 'react';
import './main_menu.css!';

export default class MainMenu extends React.Component {
  componentDidMount() {

  }

  render() {
    return (
      <div>
        7:20
        <Greeting message={ this.props.message } name="Michelle"/>
        <AppsList apps={ this.props.items }/>
      </div>
    );
  }
}

class Greeting extends React.Component {
  render() {
    return (
      <div className="header">
        { this.props.message }, { this.props.name }
      </div>
    )
  }
}

class AppsList extends React.Component {
  render() {
    return (
      <ul>
        {
          this.props.apps.map(function(elem){
            return <li><App title={ elem.title } icon={ elem.icon }/></li>;
          })
        }
      </ul>
    )
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        <AppIcon i={this.props.title}/>
        <AppTitle t={this.props.title}/>
      </div>
    )
  }
}

class AppIcon extends React.Component {
  render() {
    return <img className={this.props.i.toLowerCase()}/>
  }
}

class AppTitle extends React.Component {
  render() {
    return <div>{this.props.t}</div>
  }
}

class SelectionBar extends React.Component {

}
