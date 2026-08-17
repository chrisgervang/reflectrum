import { connect } from 'react-redux';
import Aquarium from './aquarium/Aquarium.jsx';

const mapDispatchToProps = (dispatch) => ({
  onBack: () => dispatch({ type: 'BACK' }),
  onMainMenu: () => dispatch({ type: 'OPEN_MAIN_MENU' }),
});

export const FishTankScreensaver = connect(null, mapDispatchToProps)(Aquarium);
