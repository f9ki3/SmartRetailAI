from flask import Flask, render_template, request, jsonify, session, redirect
from database import Tables
from accounts import *
from category import *
from product import *
from sales import *
from stocks import *
app = Flask(__name__)
app.secret_key = 'smartretail'

@app.route('/')
def login():
    if 'user_type' in session and session['user_type'] == 1:
        redirect ['/admin_dashboard']
    else: 
        return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')

@app.route('/admin-dashboard')
def admin_dashboard():
    if 'user_type' in session and session['user_type'] == 1:
        return render_template('admin-dashboard.html')
    else:
        return redirect('/')

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
        session['user_type'] = 1
        return '1'
    else:
        return '0'

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
    # Tables().createTables()