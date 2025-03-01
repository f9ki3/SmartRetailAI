import sqlite3

class Database:
    def __init__(self):
        self.conn = sqlite3.connect('pos_system.db')  # Use self.conn for the connection object
        self.cursor = self.conn.cursor()  # Use self.cursor for the cursor object

class Tables(Database):  # Inherit from Database
    def createTables(self):
        # Create tables
        self.cursor.executescript('''
            CREATE TABLE IF NOT EXISTS Category (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS Products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                category_id INTEGER,
                price REAL NOT NULL,
                stock INTEGER NOT NULL DEFAULT 0,
                size TEXT,  -- Optional size column
                barcode_id TEXT UNIQUE,  -- Ensure unique barcode for each product
                barcode_image TEXT,  -- Store the barcode image as binary data
                product_image TEXT,  -- Store the product image as binary data
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,  -- Timestamp when the product is created
                FOREIGN KEY (category_id) REFERENCES Category (id)  -- Reference to the Category table
            );



            CREATE TABLE IF NOT EXISTS Accounts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fname TEXT NOT NULL,
                lname TEXT NOT NULL,
                address TEXT NOT NULL,
                contact TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                username TEXT NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL,
                date_created TEXT DEFAULT CURRENT_TIMESTAMP  -- Changed column name to date_created
            );


            CREATE TABLE IF NOT EXISTS Stocks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER,
                type INTEGER DEFAULT 0,
                stocks INTEGER NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (product_id) REFERENCES Products (id)
            );

            CREATE TABLE IF NOT EXISTS Sales (
                sale_id INTEGER PRIMARY KEY AUTOINCREMENT,
                sales_reference TEXT NOT NULL,
                item_id INTEGER NOT NULL,
                item_name TEXT NOT NULL,
                price REAL NOT NULL,
                product_image TEXT,
                qty INTEGER NOT NULL,
                size TEXT,
                stock INTEGER NOT NULL,
                subtotal TEXT NOT NULL,
                total_amount TEXT NOT NULL,
                payment REAL NOT NULL,
                change TEXT NOT NULL,
                sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                type TEXT,
                FOREIGN KEY (item_id) REFERENCES CartItems(id)  -- assuming you have a CartItems table
            );

        ''')
        self.conn.commit() 
        self.conn.close()

if __name__ == "__main__":
    Tables().createTables()
