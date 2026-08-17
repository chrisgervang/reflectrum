import { connect } from 'react-redux';
import RacingGame from './racing/RacingGame';

const mapDispatchToProps = (dispatch) => ({
  secondaryHold: () => dispatch({ type: 'OPEN_MAIN_MENU' }),
  secondaryClick: () => dispatch({ type: 'BACK' }),
});

export const RacingScreensaver = connect(null, mapDispatchToProps)(RacingGame);
