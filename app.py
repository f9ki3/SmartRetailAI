from flask import Flask, render_template, request, jsonify
from database import Tables
from accounts import *
from category import *
from product import *
from sales import *
from stocks import *
app = Flask(__name__)

@app.route('/')
def login():
    return render_template('login.html')

@app.route('/admin-dashboard')
def admin_dashboard():
    return render_template('admin-dashboard.html')

@app.route('/cashier-pos')
def cashier_pos():
    return render_template('cashier-pos.html')

# API Calls/Endpoints
@app.route('/post_login', methods=['POST'])
def post_login():
    json = request.json
    uname = json.get('uname')
    passw = json.get('passw')
    if uname == 'admin' and passw == 'admin':
        return '1'
    else:
        return '0'

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
    # Tables().createTables()
