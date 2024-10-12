from database import Database
from datetime import datetime

class Sales(Database):
    def create_sale(self, sales_reference, item_id, item_name, price, product_image, qty, size, stock, subtotal, total_amount, payment, change):
        query = '''
        INSERT INTO Sales (sales_reference, item_id, item_name, price, product_image, qty, size, stock, subtotal, total_amount, payment, change, sale_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        '''
        
        # Use the current datetime directly for sale_date
        sale_date = datetime.now()
        
        parameters = (sales_reference, item_id, item_name, price, product_image, qty, size, stock, subtotal, total_amount, payment, change, sale_date)
        
        try:
            # Ensure the database connection is open
            self.cursor.execute(query, parameters)
            self.conn.commit()  # Commit the transaction
        except Exception as e:
            print(f"An error occurred: {e}")
            self.conn.rollback()  # Rollback in case of error
        finally:
            # Optional: Keep connection open for further operations or manage connection elsewhere
            pass
    
    def get_sale_by_reference(self, sales_reference):
        query = '''
        SELECT * FROM Sales WHERE sales_reference = ?;
        '''
        try:
            self.cursor.execute(query, (sales_reference,))
            rows = self.cursor.fetchall()  # Fetch all matching records

            # Get column names from the cursor description
            column_names = [description[0] for description in self.cursor.description]
            
            # Convert rows to a list of dictionaries
            result = [dict(zip(column_names, row)) for row in rows]
            
            return result  # Return the result set as a list of dictionaries
        except Exception as e:
            print(f"An error occurred: {e}")
            return None  # Return None or handle as needed


    def close_connection(self):
        """Close the database connection when done."""
        if self.conn:
            self.conn.close()
