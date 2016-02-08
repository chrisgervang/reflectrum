// import React, { Component } from 'react';
// import Menu from './menu/Menu';
//
// var data = {
//   message: "Screensavers",
//   items: [
//       {
//         name: "lockscreen",
//         color: "#00F5EA"
//       },
//       {
//         name: "tetris",
//         color: "#5AC8FA"
//       },
//       {
//         name: "map",
//         color: "#FFE620"
//       }
//   ]
// }
//
// import React, { Component } from 'react';
// import Menu from './menu/Menu';
// import MenuList from './menu/MenuList'
// import { store } from '../main'
// import { MirrorEvents } from '../helpers/events';
//
//
// class ScreensaverMenu extends Component {
//   constructor(props) {
//     super(props);
//     MirrorEvents.addListener('UP_CLICK', () => {
//       store.dispatch({
//         type: "SCROLL_UP"
//       });
//     });
//
//
//     MirrorEvents.addListener('DOWN_CLICK', () => {
//       store.dispatch({
//         type: "SCROLL_DOWN"
//       });
//     });
//   }
//
//   componentDidMount() {
//     this.unsubscribe = store.subscribe(() => {
//       this.forceUpdate();
//     });
//   }
//
//   componentWillUnmount() {
//     this.unsubscribe();
//   }
//
//   render() {
//     const state = store.getState()
//     return (
//       <Menu message={state.mainMenu.message}>
//         <MenuList items={state.mainMenu.items} selectedItem={state.mainMenu.selectedItem}/>
//       </Menu>
//     );
//   }
// }
//
// export default ScreensaverMenu;
