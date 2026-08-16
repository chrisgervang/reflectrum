'use strict';

import React, { Component } from 'react';
import { getIcon } from '../../helpers/icons';

class Icon extends Component {
  render() {
    const style = {
      color: this.props.color,
      margin: 'auto',
    };
    return <div style={style} dangerouslySetInnerHTML={{ __html: getIcon(this.props.name) }} />;
  }
}

export default Icon;
