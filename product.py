from database import Database
import barcode
from barcode.writer import ImageWriter
import os
import time

class Products(Database):
    def create_product(self, name, category_id, price, stock=0, size=None, barcode_id=None, product_image=None):
        try:
            # Validate barcode_id to ensure it is exactly 13 digits long
            if barcode_id and (len(barcode_id) != 13 or not barcode_id.isdigit()):
                raise ValueError("barcode_id must be exactly 13 digits.")

            # Generate a barcode image if barcode_id is provided
            barcode_image_path = self.generate_barcode_image(barcode_id) if barcode_id else None
            barcode_ids = barcode_image_path.replace('.png', '').replace('static/barcodes/', '')

            # Insert a new product with size, barcode_id, barcode image path, and product image path
            self.cursor.execute('''
                INSERT INTO Products (name, category_id, price, stock, size, barcode_id, barcode_image, product_image) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?);
            ''', (name, category_id, price, stock, size, barcode_ids, barcode_image_path, product_image))

            # Commit the transaction to the database
            self.conn.commit()
            print(f"Product '{name}' created successfully with barcode ID '{barcode_id}', size '{size}', and product image.")

        except Exception as e:
            print(f"Failed to create product: {str(e)}")
            self.conn.rollback()  # Rollback if there's an error

    def generate_barcode_image(self, barcode_id, save_path="static/barcodes/"):
        # Ensure the save directory exists
        if not os.path.exists(save_path):
            os.makedirs(save_path)  # Create the directory if it doesn't exist

        # Ensure barcode_id is valid for EAN-13 (must be 13 digits)
        if len(barcode_id) != 13 or not barcode_id.isdigit():
            raise ValueError("EAN must have 13 digits.")

        # Generate barcode image using the barcode_id directly
        EAN = barcode.get_barcode_class('ean13')
        ean = EAN(barcode_id, writer=ImageWriter())

        # Save barcode image using the full 13-digit barcode_id
        file_name = f"{ean}.png"  # Use the full 13 digits for the filename
        file_path = os.path.join(save_path, file_name)

        try:
            print("Attempting to save barcode image...")
            ean.save(file_path[:-4])  # Save without the .png extension to avoid double extensions
            print(f"Barcode image saved at {file_path}")

            # Verify file creation
            if not os.path.isfile(file_path):
                raise Exception(f"File was not created: {file_path}")

            # Optional: Add a delay to ensure the file is fully written
            time.sleep(0.5)  # Sleep for 500 milliseconds
            print("Sleeping to allow file system to catch up...")

        except Exception as e:
            raise Exception(f"Failed to save barcode image: {str(e)}")

        # Return the file path as a string (path to the barcode image file)
        return file_path



    

    def read_products(self):
        # Retrieve all products along with their category names
        self.cursor.execute('''
            SELECT p.*, c.name AS category_name
            FROM Products p
            JOIN Category c ON p.category_id = c.id;
        ''')
        products = self.cursor.fetchall()

        # Get column names
        column_names = [column[0] for column in self.cursor.description]

        # Create a list of dictionaries for each product
        product_list = []
        for product in products:
            product_dict = dict(zip(column_names, product))  # Zip column names with product values
            product_list.append(product_dict)

        return product_list  # Return the list of product dictionaries

        
        # Get column names
        column_names = [column[0] for column in self.cursor.description]

        # Create a list of dictionaries for each product
        product_list = []
        for product in products:
            product_dict = dict(zip(column_names, product))  # Zip column names with product values
            product_list.append(product_dict)

        return product_list  # Return the list of product dictionaries

    def get_product_by_barcode(self, barcode):
        # Retrieve the product with its category name using a parameterized query
        self.cursor.execute(f'''
            SELECT p.*, c.name AS category_name
            FROM Products p
            JOIN Category c ON p.category_id = c.id
            WHERE p.barcode_id = {barcode};
        ''')
        
        # Fetch the product
        product = self.cursor.fetchone()
        
        # If no product is found, return None
        if not product:
            return None
        
        # Get column names
        column_names = [column[0] for column in self.cursor.description]
        
        # Create a dictionary for the product
        product_dict = dict(zip(column_names, product))  # Zip column names with product values
        
        return product_dict  # Return the product dictionary


    def update_product(self, product_id, name=None, category_id=None, price=None, stock=None, size=None, product_image=None):
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
