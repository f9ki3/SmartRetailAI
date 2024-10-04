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

@app.route('/admin-category')
def category():
    if 'user_type' in session and session['user_type'] == 'admin':
        return render_template('admin-category.html')
    else:
        return redirect('/')  # Redirect if not an admin

@app.route('/admin-products')
def products():
    if 'user_type' in session and session['user_type'] == 'admin':
        return render_template('admin-products.html')
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
    
# Categories API
@app.route('/read_categories', methods=['GET'])
def read_categories():
    data = Category().read_categories()
    return jsonify(data)

@app.route('/delete_category', methods=['POST'])
def delete_category():
    json = request.json
    cat_id = json.get('category_id')
    Category().delete_category(cat_id)
    return jsonify({'status': cat_id})

@app.route('/add_category', methods=['POST'])
def category_name():
    json = request.json
    cat_name = json.get('category_name')
    Category().create_category(cat_name)
    return jsonify({'status': cat_name})

@app.route('/retrieved_category', methods=['POST'])
def retrieved_category():
    json = request.json
    cat_id = json.get('category_id')
    data = Category().view_category(cat_id)
    print(data)
    return jsonify(data)

@app.route('/update_category', methods=['POST'])
def update_category():
    json = request.json
    cat_id = json.get('cat_id')
    cat_name = json.get('cat_name')
    Category().update_category(cat_id, cat_name)
    return jsonify(1)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
    # Tables().createTables()