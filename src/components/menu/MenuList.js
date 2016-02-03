import React, { Component } from 'react';
import MenuListItem from './MenuListItem'

class MenuList extends Component {
  render() {
    return (
        <div>
        {
          this.props.items.map(function(elem){
            return (
              <div className="menu-list-item-container">
                <MenuListItem {...elem}/>
              </div>
            )
          })
        }
        </div>
    )
  }
}

export default MenuList;
