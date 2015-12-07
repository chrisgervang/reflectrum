from flask import Flask, request, url_for, render_template
app = Flask(__name__)

@app.route('/clock', methods=['GET'])
def clock():
    if request.method == 'POST':
        print request
    else:
        return render_template('Clock.html')

@app.route('/tabs', methods=['GET'])
def tabs():
    return render_template('Tabs.html')

if __name__ == '__main__':
    app.run(debug=True)
