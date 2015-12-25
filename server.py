from flask import Flask, request, url_for, render_template, send_from_directory
# import calendar

app = Flask(__name__, static_url_path='')

@app.route('/scripts/<path:path>')
def sendScript(path):
    print path
    return send_from_directory('scripts', path);

@app.route('/clock', methods=['GET'])
def clock():
    if request.method == 'POST':
        print request
    else:
        return render_template('Clock.html')

@app.route('/home', methods=['GET'])
def home():
    return render_template('Home.html')

@app.route('/tabs', methods=['GET'])
def tabs():
    return render_template('Tabs.html')

@app.route('/quotes', methods=['GET'])
def quotes():
    return render_template('Quotes.html')

if __name__ == '__main__':
    app.run(debug=True)
