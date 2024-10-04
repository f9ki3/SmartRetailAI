from database import Database

class Products(Database):

    def create_product(self, name, category_id, price, stock=0, size=None, barcode_id=None, barcode_image=None, product_image=None):
        # Insert a new product with size, barcode_id, barcode image, and product image
        self.cursor.execute('''
            INSERT INTO Products (name, category_id, price, stock, size, barcode_id, barcode_image, product_image) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        ''', (name, category_id, price, stock, size, barcode_id, barcode_image, product_image))
        self.conn.commit()
        print(f"Product '{name}' created successfully with barcode ID '{barcode_id}', size '{size}', and product image.")

    def read_products(self):
        # Retrieve all products, including the created_at date, size, and product image
        self.cursor.execute('SELECT id, name, category_id, price, stock, size, barcode_id, barcode_image, product_image, created_at FROM Products;')
        products = self.cursor.fetchall()
        for product in products:
            print(f"ID: {product[0]}, Name: {product[1]}, Category ID: {product[2]}, Price: {product[3]}, Stock: {product[4]}, Size: {product[5]}, Barcode ID: {product[6]}, Barcode Image: {product[7]}, Product Image: {product[8]}, Created At: {product[9]}")
        return products

    def update_product(self, product_id, name=None, category_id=None, price=None, stock=None, size=None, barcode_id=None, barcode_image=None, product_image=None):
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
        if size:
            updates.append("size = ?")
            params.append(size)
        if barcode_id:
            updates.append("barcode_id = ?")
            params.append(barcode_id)
        if barcode_image is not None:
            updates.append("barcode_image = ?")
            params.append(barcode_image)
        if product_image is not None:
            updates.append("product_image = ?")
            params.append(product_image)

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
