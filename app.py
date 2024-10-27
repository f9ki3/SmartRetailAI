from flask import Flask, render_template, request, jsonify, session, redirect
import os, random
from werkzeug.utils import secure_filename
from database import Tables
from accounts import *
from category import *
from product import *
from sales import *
from stocks import *
app = Flask(__name__)
app.secret_key = 'smartretail'

# Define the upload folder
UPLOAD_FOLDER = 'static/uploads'
# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

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

@app.route('/admin-inventory')
def admin_inventory():
    if 'user_type' in session and session['user_type'] == 'admin':
        return render_template('admin-inventory.html')
    else:
        return redirect('/')  # Redirect if not an admin
    
@app.route('/admin-sales')
def admin_sales():
    if 'user_type' in session and session['user_type'] == 'admin':
        return render_template('admin-sales.html')
    else:
        return redirect('/')  # Redirect if not an admin

@app.route('/admin-accounts')
def admin_accounts():
    if 'user_type' in session and session['user_type'] == 'admin':
        return render_template('admin-accounts.html')
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

@app.route('/get_sales', methods=['GET'])
def get_sales():
    data = Sales().get_sales()
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

@app.route('/add_product', methods=['POST'])
def add_product():
    try:
        # Retrieve form data
        product_name = request.form.get('name')
        product_price = request.form.get('price')
        product_size = request.form.get('size')
        barcode_id = request.form.get('barcode_id')
        category_id = request.form.get('category_id')

        # Check if an image was uploaded
        if 'image' not in request.files:
            return jsonify({'error': 'No image uploaded'}), 400

        product_image = request.files['image']

        # Check if the file has a valid name
        if product_image.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        # Secure the filename and save the image
        filename = secure_filename(product_image.filename)
        image_path = os.path.join(UPLOAD_FOLDER, filename)
        product_image.save(image_path)

        # Convert price to a float, and ensure stock is set correctly (default is 0)
        product_price = float(product_price) if product_price else 0.0
        stock = 0  # Change this to take stock from the request if needed

        # Example: Save the product information to the database
        Products().create_product(
            name=product_name,
            category_id=category_id,
            price=product_price,
            stock=stock,
            size=product_size,
            barcode_id=barcode_id,
            product_image=image_path  # Ensure you are passing 'product_image'
        )

        # Respond with a success message
        return jsonify({'message': 'Product added successfully', 'image_path': image_path}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/read_products', methods=['GET'])
def read_products():
    data = Products().read_products()
    return jsonify(data)

@app.route('/read_stocks', methods=['GET'])
def read_stocks():
    data = Stocks().readStocks()
    return jsonify(data)

@app.route('/delete_product', methods=['POST'])
def delete_product():
    id = request.json.get('product_id')
    Products().delete_product(id)
    return jsonify(1)

@app.route('/delete_sales', methods=['POST'])
def delete_sales():
    id = request.json.get('product_id')
    print(id)
    Sales().delete_sales(id)
    return jsonify(1)

@app.route('/delete_stocks', methods=['POST'])
def delete_stocks():
    id = request.json.get('product_id')
    print(id)
    Stocks().delete_stocks(id)
    return jsonify(1)

@app.route('/add_stock', methods=['POST'])
def add_stock():
    # Get data from the request
    data = request.form
    product_id = data.get('id')
    product_stocks = data.get('stocks')
    type = 'stock in'
    Stocks().addStocks(product_id, product_stocks, type)

    return jsonify(data)

@app.route('/create_sale', methods=['POST'])
def create_sale():
    # Get the JSON data from the request
    data = request.get_json()

    # Log the payment details (you can store this in a database or file)
    sales_reference = data.get('reference_id')
    cart = data.get('cart')
    subtotal = data.get('subtotal')
    vat = data.get('vat')
    total = data.get('total')
    payment = data.get('payment')
    change = data.get('change')

    # Process each item in the cart
    for item in cart:
        item_id = item.get('id')
        item_name = item.get('name')
        price = item.get('price')
        product_image = item.get('product_image')
        qty = item.get('qty')
        size = item.get('size')
        stock = item.get('stock')

        # Here you should call a separate function to handle the actual sale processing
        Sales().create_sale(sales_reference, item_id, item_name, price, product_image, qty, size, stock, subtotal, total, payment, change)
        Stocks().outStocks(item_id, qty, 'stock out')

    # Return a success response
    return jsonify({"message": "Payment logged successfully", "sales_reference": sales_reference}), 200

@app.route('/get_receipt', methods=['POST'])
def get_receipt():
    # Get reference_id from the request
    reference_id = request.form.get('reference_id')
    data = Sales().get_sale_by_reference(reference_id)
    return jsonify(data) 

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
    # Tables().createTables()