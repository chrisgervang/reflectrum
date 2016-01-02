from flask import Flask, request, url_for, render_template, send_from_directory
# import googlecalendar

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

@app.route('/menu', methods=['GET'])
def menu():
    return render_template('Menu.html')

@app.route('/quotes', methods=['GET'])
def quotes():
    return render_template('Quotes.html')

if __name__ == '__main__':
    app.run(debug=True)
