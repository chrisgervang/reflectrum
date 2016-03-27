import React, {Component} from 'react';
import { connect } from 'react-redux';
import Clock from '../common/Clock.js';
import moment from 'moment';
import { MirrorEvents } from '../../helpers/events';


var emojiArray =
[
  "http://emojione.com/wp-content/uploads/assets/emojis/1f601.svg",
  "http://emojione.com/wp-content/uploads/assets/emojis/1f602.svg",
  "http://emojione.com/wp-content/uploads/assets/emojis/1f604.svg",
  "http://emojione.com/wp-content/uploads/assets/emojis/1f606.svg",
  "http://emojione.com/wp-content/uploads/assets/emojis/1f60a.svg",
  "http://emojione.com/wp-content/uploads/assets/emojis/1f643.svg",
  "http://emojione.com/wp-content/uploads/assets/emojis/263a.svg",
  "http://emojione.com/wp-content/uploads/assets/emojis/1f618.svg",
  "http://emojione.com/wp-content/uploads/assets/emojis/1f60e.svg",
  "http://emojione.com/wp-content/uploads/assets/emojis/1f60f.svg",
  "http://emojione.com/wp-content/uploads/assets/emojis/1f4a9.svg",
  "http://emojione.com/wp-content/themes/emojione.v2/images/vectors/emojis/1f44d-1f3fb.svg",
  "http://emojione.com/wp-content/themes/emojione.v2/images/vectors/emojis/1f918-1f3fb.svg",
  "http://emojione.com/wp-content/uploads/assets/emojis/1f436.svg",
  "http://emojione.com/wp-content/uploads/assets/emojis/1f425.svg",
  "http://emojione.com/wp-content/uploads/assets/emojis/1f40c.svg",
  "http://emojione.com/wp-content/uploads/assets/emojis/1f649.svg",
  "http://emojione.com/wp-content/uploads/assets/emojis/1f418.svg",
  "http://emojione.com/wp-content/uploads/assets/emojis/1f42a.svg",
  "http://emojione.com/wp-content/uploads/assets/emojis/1f31e.svg",
  "http://emojione.com/wp-content/uploads/assets/emojis/2615.svg"
]

export class Opening extends Component {
  getRandomImage(imgAr) {
    var num = Math.floor( Math.random() * imgAr.length );
    var img = imgAr[ num ];
    return img
  }

  componentDidMount() {
    //handlers
    this.handlers = []
    this.handlers.push(
      MirrorEvents.addListener('SECONDARY_HOLD', () => {
        this.props.secondaryHold()
      })
    );
    this.handlers.push(
      MirrorEvents.addListener('SECONDARY_CLICK', () => {
        this.props.secondaryClick()
      })
    );
  }

  componentWillUnmount() {
    //remove handlers
    this.handlers.map((handler) =>{
      handler.remove();
    })
  }

  render() {
    const day = moment().format("dddd,")
    const date = moment().format("MMMM Do")
    const styles = {
      icon: {
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "70px",
        display: "block"
      },
      greeting: {
        color: "white",
        textAlign: "center",
        fontSize: "90px"
      },
      line: {
        width: "80%",
        borderWidth: "3px",
        borderTop: "1px solid white"
      },
      currentDate: {
        marginTop: "70px"
      },
      date: {
        margin: "0px",
        color: "white",
        textAlign: "center",
        fontSize: "90px"
      }
    }

    return (
      <div>
        <Clock/>
        <img style={styles.icon} src={this.getRandomImage(emojiArray)} height="180" width="180"/>
        <p style={styles.greeting}>Goodmorning, {this.props.username}.</p>

        <hr style={styles.line} />

        <img style={styles.icon} src="http://imgh.us/Calendar_icon.svg" height="180" width="180"/>
        <div style={styles.currentDate} >
          <p style={styles.date}>{day}</p>
          <p style={styles.date}>{date}</p>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    primaryClick: () => {
      dispatch({
        type: "GM_NEXT"
      })
    },
    secondaryHold: () => {
      dispatch({
        type: "OPEN_MAIN_MENU"
      })
    },
    secondaryClick: () => {
      dispatch({
        type: "BACK"
      })
    }
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.username
  }
}

const OpeningPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(Opening)

export default OpeningPage;
