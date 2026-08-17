import React, {Component} from 'react';
import {pages} from '../helpers/pages.jsx';

import { StandbyContainer } from './Standby.jsx';
import DisplayPower from './DisplayPower.jsx';
import { connect } from 'react-redux';
import './ViewStack.css';
class ViewStack extends Component {

  render() {
    const activePageName = this.props.activePageName

    return (
      <div className="view-stack">
        <div className="view-stack__page">
          {pages[activePageName]}
        </div>
        <StandbyContainer />
        <DisplayPower />
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
