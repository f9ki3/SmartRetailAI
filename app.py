from flask import Flask
from database import Tables
from accounts import *
from category import *
from product import *
from sales import *
from stocks import *
app = Flask(__name__)

@app.route('/')
def home():
    return 'Hello World'

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
    Tables().createTables()
