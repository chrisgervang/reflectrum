import React, {Component} from 'react';
import {pages} from '../helpers/pages.jsx';

import { StandbyContainer } from './Standby.jsx';
import { connect } from 'react-redux';
import './ViewStack.css';
class ViewStack extends Component {

  render() {
    const activePageName = this.props.activePageName

    console.log("ViewStack", pages, activePageName)

    return (
      <div className="view-stack">
        <div className="view-stack__page">
          {pages[activePageName]}
        </div>
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
