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
    if 'user_type' in session and session['user_type'] == 'admin':
        return redirect('/admin-dashboard')  # Use parentheses and return the redirect
    else: 
        return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')  # Return the redirect to the home page

@app.route('/admin-dashboard')
def admin_dashboard():
    if 'user_type' in session and session['user_type'] == 'admin':
        return render_template('admin-dashboard.html')
    else:
        return redirect('/')  # Redirect if not an admin

@app.route('/cashier-pos')
def cashier_pos():
    return render_template('cashier-pos.html')


# API Calls/Endpoints
@app.route('/post_login', methods=['POST'])
def post_login():
    data = request.json
    uname = data.get('uname')
    passw = data.get('passw')
    
    result = Accounts().login(uname, passw)
    
    if result:
        session['user_type'] = result.get('role')
        return jsonify(result)
    else:
        return jsonify({"error": "Invalid username or password"}), 401

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
    # Tables().createTables()