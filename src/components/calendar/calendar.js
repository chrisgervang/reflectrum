import React from 'react';
import './calendar.css!'

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

export default class Calendar extends React.Component {
	constructor(props) {
		super(props);
		this.state = { data: [] };
		this._downloadEvents = this._downloadEvents.bind(this);
	}

	componentDidMount() {
	    this._downloadEvents().then((data) => {
	      console.log(data);
	      this.setState({ data: data });
	    });
	  }

	_downloadEvents () {
		var myHeaders = new Headers();

		var myInit = {
			method: 'GET',
	      headers: myHeaders,
	      mode: 'no-cors',
	      cache: 'default'
	    };

		var myRequest = new Request("http://localhost:5000/calendar/events",myInit);
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
      } else {
        return <div></div>;
      }
	}
}
