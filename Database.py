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
                name TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS Products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                category_id INTEGER,
                price REAL NOT NULL,
                stock INTEGER NOT NULL DEFAULT 0,
                FOREIGN KEY (category_id) REFERENCES Category (id)
            );

            CREATE TABLE IF NOT EXISTS Accounts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS Stocks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER,
                stock_in INTEGER DEFAULT 0,
                stock_out INTEGER DEFAULT 0,
                date TEXT NOT NULL,
                FOREIGN KEY (product_id) REFERENCES Products (id)
            );

            CREATE TABLE IF NOT EXISTS Sales (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER,
                quantity INTEGER NOT NULL,
                total_price REAL NOT NULL,
                sale_date TEXT NOT NULL,
                FOREIGN KEY (product_id) REFERENCES Products (id)
            );
        ''')
        self.conn.commit()  # Commit the transaction
        self.conn.close()   # Close the connection
