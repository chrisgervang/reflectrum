import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MirrorEvents } from '../../helpers/events';
import Clock from '../common/Clock';
import Icon from '../common/Icon';


class Quotes extends Component {
  constructor(props) {
    super(props);
    this.quotes =
    [
      "Do something today that your future self will thank you for.",
      "The best way to fix the world is to fix yourself.",
      "Actions speak louder than reasons.",
      "Don't give reason unless you have to!",
      "It's okay to fail in the pursuit of a meaningful goal.",
      "You fail and you learn.",
      "People can suprise you.",
      "It's okay to ask for assistance.",
      "All design is redesign.",
      "If you believe, then you can achieve.",
      "You have to struggle in order to progress. So if you're strugging, you're only progressing.",
      "Turn that frown upside down.",
      "Make a wish, or make it happen."
    ];
  }

  getQuote() {
    return this.quotes[Math.floor(Math.random() * this.quotes.length)];
  };

  componentDidMount() {
    this.handlers = [];
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
    this.handlers.map((handler) =>{
      handler.remove();
    })
  }

  render() {
    var styles = {
      quotesPage: {
        fontFamily: "'Lato', sans-serif",
        backgroundColor: "#000",
        height: "100%",
        width: "100%",
        position: "absolute"
      },
      container: {
        display: "table",
        height: "calc(100% - 80px)",
        width: "80%",
        marginLeft: "80px",
      },
      quote: {
        fontSize: "80px",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "200px",
        color: "white",
        verticalAlign: "middle",
        textAlign: "center",
        width: "600px",
        display: "table-cell",
        animationDelay: "1s"
      },

      opening: {
        top: "40px",
        left: "40px",
        position: "absolute"
      },

      closing: {
        bottom: "40px",
        right: "40px",
        position: "absolute"
      }
    }

    return (
      <div style={styles.quotesPage}>
        <Clock />
        <div style={styles.opening} className="animated fadeInLeft" >
          <Icon name='open_quotes' color="#ECF0F1"/>
        </div>
        <div style={styles.container}>
          <p style={styles.quote} className="animated fadeInDown">{this.getQuote()}</p>
        </div>
        <div style={styles.closing} className="animated fadeInRight" >
          <Icon name='close_quotes' color="#ECF0F1"/>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
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

export const QuotesPage = connect(
  (state) => {return {}},
  mapDispatchToProps
)(Quotes)
