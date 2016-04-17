'use strict';

import React, { Component } from 'react';
import ReactCSS from 'reactcss';
import { getIcon } from '../../helpers/icons';

class Icon extends Component {
  classes() {
    return {
      'default': {
        icon: {
          color: this.props.color,
          margin: 'auto'
        },
      },
    };
  }

  render() {
    return <div is="icon" dangerouslySetInnerHTML={{ __html: getIcon(this.props.name) }} />;
  }
}

export default ReactCSS(Icon);
