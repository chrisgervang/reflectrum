import React, { Component } from 'react';

class MenuListSelectedItem extends Component {
  render() {
    const props = this.props;
    const top = (props.selectedItem * 200) + 280 + 'px'

    return (
      <div style={{top: top}} className="animated slideInRight menu-list-select-item"></div>
    )
  }
}

export default MenuListSelectedItem;
