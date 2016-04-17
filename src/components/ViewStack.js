import React, {Component} from 'react';
import {pages} from '../helpers/pages.js';

import { StandbyContainer } from './Standby.js';
import { connect } from 'react-redux';
class ViewStack extends Component {

  render() {
    const activePageName = this.props.activePageName

    console.log("ViewStack", pages, activePageName)

    return (
      <div>
        {pages[activePageName]}
        <StandbyContainer />
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    activePageName: state.activePageName
  }
}

ViewStack = connect(
  mapStateToProps,
  () => {return {}}
)(ViewStack)

export default ViewStack;
