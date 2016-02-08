import React, { Component } from 'react';
import MenuListItem from './MenuListItem';
import MenuListSelectItem from './MenuListSelectItem';
import { store } from '../../main'

class MenuList extends Component {
  render() {
    return (
        <div>
          <div>
          {
            this.props.items.map(function(item){
              return (
                <MenuListItem key={item.name} {...item}/>
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
