from database import Database

class Products(Database):

    def create_table(self):
        # Create the Products table if it doesn't exist
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS Products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                category_id INTEGER,
                price REAL NOT NULL,
                stock INTEGER NOT NULL DEFAULT 0,
                FOREIGN KEY (category_id) REFERENCES Category (id)
            );
        ''')
        self.conn.commit()

    def create_product(self, name, category_id, price, stock=0):
        # Insert a new product
        self.cursor.execute('''
            INSERT INTO Products (name, category_id, price, stock) 
            VALUES (?, ?, ?, ?);
        ''', (name, category_id, price, stock))
        self.conn.commit()
        print(f"Product '{name}' created successfully!")

    def read_products(self):
        # Retrieve all products
        self.cursor.execute('SELECT * FROM Products;')
        products = self.cursor.fetchall()
        for product in products:
            print(product)
        return products

    def update_product(self, product_id, name=None, category_id=None, price=None, stock=None):
        # Update the product based on given arguments
        updates = []
        params = []

        if name:
            updates.append("name = ?")
            params.append(name)
        if category_id:
            updates.append("category_id = ?")
            params.append(category_id)
        if price:
            updates.append("price = ?")
            params.append(price)
        if stock is not None:
            updates.append("stock = ?")
            params.append(stock)

        # Only proceed if there is something to update
        if updates:
            sql_query = f"UPDATE Products SET {', '.join(updates)} WHERE id = ?"
            params.append(product_id)
            self.cursor.execute(sql_query, tuple(params))
            self.conn.commit()
            print(f"Product ID {product_id} updated successfully!")
        else:
            print("No fields provided for update.")

    def delete_product(self, product_id):
        # Delete a product by ID
        self.cursor.execute('''
            DELETE FROM Products 
            WHERE id = ?;
        ''', (product_id,))
        self.conn.commit()
        print(f"Product ID {product_id} deleted successfully!")

    def close_connection(self):
        # Close the database connection
        self.conn.close()