import React, { Component } from 'react';

export class Greeting extends Component {
  static getGreeting() {
    var d = new Date();
    var h = d.getHours();
    if (h >= 0 && h < 5) {
      return "Goodnight, "
    } else if (h >= 5 && h < 12) {
      return "Goodmorning, "
    } else if (h >= 12 && h < 17) {
      return "Good Afternoon, "
    } else if (h >= 17 && h <= 23) {
      return "Goodevening, "
    } else {
      return "Good Day, "
    }
  }

  render() {
    return (
      <div className="greeting">{ props.text }</div>
    )
  }
}
