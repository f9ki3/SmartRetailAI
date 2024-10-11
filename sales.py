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

    def close_connection(self):
        """Close the database connection when done."""
        if self.conn:
            self.conn.close()
