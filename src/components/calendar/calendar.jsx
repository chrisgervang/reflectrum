import React from 'react';
import './calendar.css';
import { connect } from 'react-redux';
import { MirrorEvents } from '../../helpers/events';

class Time extends React.Component {

	constructor(props) {
		super(props);
		this._parseTime = this._parseTime.bind(this);
		this._getStart = this._getStart.bind(this);
		this._getEnd = this._getEnd.bind(this);
	}

	_parseTime(datetime) {
		var d = new Date(datetime);
	    var hours = d.getHours().toString();

	    if (hours.length == 1) {
	      hours = "0" + hours;
	    }

	    var minutes = d.getMinutes().toString();

	    if (minutes.length == 1) {
	      minutes = "0" + minutes;
	    }

	    return hours + ":" + minutes;
	}

	_getStart() {
		var datetime = this.props.start.dateTime;
      	return this.parseTime(datetime);
	}

	_getEnd() {
		var datetime = this.props.end.dateTime;
      	return this.parseTime(datetime);
	}

	render() {
		if (this.props.start.date) {
	    return (
				<div>all-day</div>
			);
	  } else if (this.props.endTimeUnspecified) {
	    return (
				<div>
					{this._getStart()}
				</div>
			);
	  } else {
	    return (
				<div>
          <div>{this._getStart()}</div>
          <div>{this._getEnd()}</div>
        </div>
			);
	  }
	}
}

/* The calendar color can now be accessed with this.props.color,
 * though that isn't a part of the Google spec for Events. */

class Event extends React.Component {
	render() {
		const props = this.props;
		console.log(this.props);

		var locationDisplay;
    if (props.location) {
      locationDisplay = <div>{props.location}</div>;
    } else {
      locationDisplay = <div></div>;
    }

		var style = {
      backgroundColor: props.color
    }

		return (
			<div style={style}>
          <Time start={props.start} end={props.end} endTimeUnspecified={props.endTimeUnspecified} />
          <div>{props.summary}</div>
          {locationDisplay}
       </div>
		);
	}
}

class EventList extends React.Component {
	render() {
		return (
      <ol>
        {
          this.props.events.map(function(elem){
            return <li><Event color={elem.color} summary={elem.summary} location={elem.location} start={elem.start} end={elem.end} endTimeUnspecified={elem.endTimeUnspecified}/></li>;
          })
        }
      </ol>
    );
	}
}

class AuthScreen extends React.Component {
	render() {
		return (
      <div>
        <div>{this.props.code}</div>
        <div>{this.props.url}</div>
      </div>
    );
	}
}

class Calendar extends React.Component {
	constructor(props) {
		super(props);
		this.state = { data: [] };
		this._downloadEvents = this._downloadEvents.bind(this);
	}

	componentDidMount() {
		this.handlers = [
			MirrorEvents.addListener('SECONDARY_HOLD', this.props.secondaryHold),
			MirrorEvents.addListener('SECONDARY_CLICK', this.props.secondaryClick),
		];
		this._downloadEvents()
			.then((response) => response.json())
			.then((data) => this.setState({ data }))
			.catch(() => this.setState({ data: { status: 'unavailable' } }));
	  }

	componentWillUnmount() {
		this.handlers.forEach((handler) => handler.remove());
	}

	_downloadEvents () {
		var myHeaders = new Headers();

		var myInit = {
			method: 'GET',
	      headers: myHeaders,
	      mode: 'no-cors',
	      cache: 'default'
	    };

		return fetch("http://localhost:5000/calendar/events")
	}

	render() {
		if (this.state.data.status == "auth") {
        return (
          <AuthScreen url={this.state.data.url} code={this.state.data.code} />
        );
      } else if (this.state.data.status == "events") {
        return (
          <EventList events={this.state.data.events} />
        );
      } else if (this.state.data.status === 'unavailable') {
		return <div style={{padding: '80px', color: 'white', fontSize: '42px'}}>Calendar service is not configured.</div>;
      } else {
		return <div></div>;
      }
	}
}

const mapDispatchToProps = (dispatch) => ({
	secondaryHold: () => dispatch({ type: 'OPEN_MAIN_MENU' }),
	secondaryClick: () => dispatch({ type: 'BACK' }),
});

export default connect(null, mapDispatchToProps)(Calendar);
