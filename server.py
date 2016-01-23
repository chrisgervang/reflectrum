from flask import Flask, request, url_for, render_template, send_from_directory, json
import g_cal


app = Flask(__name__, static_url_path='')
app.config.update(
    DEBUG=True,
    SEND_FILE_MAX_AGE_DEFAULT=2
)


@app.route('/scripts/<path:path>')
def sendScript(path):
    print path
    return send_from_directory('scripts', path);

@app.route('/style/<path:path>')
def sendStyle(path):
    print path
    return send_from_directory('style', path);

@app.route('/img/<path:path>')
def sendImg(path):
    print path
    return send_from_directory('img', path);


@app.route('/clock', methods=['GET'])
def clock():
    if request.method == 'POST':
        print request
    else:
        return render_template('Clock.html')

@app.route('/gmopening', methods=['GET'])
def gmOpening():
    return render_template('GMOpening.html')

@app.route('/gmweather', methods=['GET'])
def gmWeather():
    return render_template('GMWeather.html')

@app.route('/home', methods=['GET'])
def home():
    return render_template('Home.html')

@app.route('/screensavers', methods=['GET'])
def screensavers():
    return render_template('Screensavers.html')

@app.route('/screensavers/map', methods=['GET'])
def saverMap():
    return render_template('Map.html')

@app.route('/screensavers/lockscreen', methods=['GET'])
def lockscreen():
    return render_template('lockscreen.html')

@app.route('/menu', methods=['GET'])
def menu():
    return render_template('Menu.html')

@app.route('/quotes', methods=['GET'])
def quotes():
    return render_template('Quotes.html')

@app.route('/calendar', methods=['GET'])
def calendar():
	return render_template('Calendar.html')

@app.route('/calendar/events', methods=['GET'])
def calendar_events():
	events = g_cal.get_events()
	if events:
		return json.jsonify(status="events", events=events)
	if not events:
		auth_results = g_cal.authenticate()
		if auth_results:
			return json.jsonify(status="auth", code=auth_results[0], url=auth_results[1])
		else:
			events = g_cal.get_events()
			return json.jsonify(status="events", events=events)



if __name__ == '__main__':
    app.run(debug=True)
