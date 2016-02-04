import React, { Component } from 'react';
import MenuListItem from './MenuListItem';
import MenuListSelectItem from './MenuListSelectItem';

class MenuList extends Component {
  render() {
    return (
        <div>
          <div>
          {
            this.props.items.map(function(elem){
              return (
                <MenuListItem key={elem.name} {...elem}/>
              )
            })
          }
          </div>
          <MenuListSelectItem {...this.props} className="menu-list-select-item" />
        </div>
    )
  }
}

export default MenuList;
