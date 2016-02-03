import React, { Component } from 'react';

export default class MenuGreeting extends Component {
  render() {
    return (
      <div className="header">
        { this.props.message }, { this.props.name }
      </div>
    )
  }
}
