import React, { Component } from 'react';
import MenuListItem from './MenuListItem';
import MenuListSelectedItem from './MenuListSelectedItem';

class MenuList extends Component {
  render() {
    const props = this.props
    return (
        <div>
          <div>
          {
            props.items.map(function(item){
              return (
                <MenuListItem key={item.name} name={item.name} color={item.color}/>
              )
            })
          }
          </div>
          <MenuListSelectedItem selectedItem={props.selectedItem} className="menu-list-select-item" />
        </div>
    )
  }
}

export default MenuList;
