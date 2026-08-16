import React, { Component } from 'react';

export default class Row extends Component {
    render() {
      return (
        <div style={{display: "flex"}}>
          {this.props.children}
        </div>
      );
    }
}
