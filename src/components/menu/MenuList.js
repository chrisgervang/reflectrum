import React, { Component } from 'react';
import MenuListItem from './MenuListItem';
import MenuListSelectItem from './MenuListSelectItem';
import { store } from '../../main'

class MenuList extends Component {


  render() {
    const props = this.props
    return (
        <div>
          <div>
          {
            state.mainMenu.items.map(function(item){
              return (
                <MenuListItem key={item.name} name={item.name} color={item.color}/>
              )
            })
          }
          </div>
          <MenuListSelectItem className="menu-list-select-item" />
        </div>
    )
  }
}

export default MenuList;
