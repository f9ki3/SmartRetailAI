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
    
    def get_sales(self, sales_reference=None):
        if sales_reference:
            query = '''
            SELECT 
                sale_id as id,
                sales_reference,
                subtotal,
                total_amount,
                change,
                sale_date,
                subtotal * 0.12 AS vat  -- Calculate 12% of subtotal as VAT
            FROM Sales
            WHERE sales_reference = ?
            GROUP BY sales_reference;
            '''
            parameters = (sales_reference,)
        else:
            query = '''
            SELECT 
                sale_id as id,
                sales_reference,
                subtotal,
                total_amount,
                change,
                sale_date,
                subtotal * 0.12 AS vat  -- Calculate 12% of subtotal as VAT
            FROM Sales
            GROUP BY sales_reference;
            '''
            parameters = ()

        try:
            self.cursor.execute(query, parameters)
            rows = self.cursor.fetchall()  # Fetch all matching records (grouped)

            # Get column names from the cursor description
            column_names = [description[0] for description in self.cursor.description]
            
            # Convert rows to a list of dictionaries, including the VAT calculation
            result = [dict(zip(column_names, row)) for row in rows]
            
            return result  # Return the result set as a list of dictionaries
        except Exception as e:
            print(f"An error occurred: {e}")
            return None  # Return None or handle as needed
    
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
        
    def delete_sales(self, sale_id):
            """Delete a sales record by sale_id."""
            query = '''
            DELETE FROM Sales
            WHERE sale_id = ?;
            '''
            
            parameters = (sale_id,)
            
            try:
                self.cursor.execute(query, parameters)
                self.conn.commit()
                print("Sales record deleted successfully!")
            except Exception as e:
                print(f"An error occurred while deleting the sales record: {e}")
                self.conn.rollback()

    def sales_dashboard(self):
        # Get today's date and the first day of the current month
        today_date = datetime.now().date()
        first_day_of_month = today_date.replace(day=1)

        # Query for total sales today
        query_today = '''
        SELECT 
            SUM(qty * price) AS today_sales
        FROM Sales
        WHERE DATE(sale_date) = ?;  -- Filter by today's date
        '''

        # Query for total sales this month
        query_month = '''
        SELECT 
            SUM(qty * price) AS month_sales
        FROM Sales
        WHERE DATE(sale_date) >= ?;  -- Filter by the first day of the current month
        '''

        # Query to count cashiers
        query_count_cashier = '''
        SELECT 
            COUNT(*) AS count_cashier
        FROM Accounts
        WHERE role = 'cashier'
        '''

        # Query to count admins
        query_count_admin = '''
        SELECT 
            COUNT(*) AS count_admin
        FROM Accounts
        WHERE role = 'admin'
        '''

        try:
            # Get total sales for today
            self.cursor.execute(query_today, (today_date,))
            row_today = self.cursor.fetchone()
            total_sales_today = row_today[0] if row_today else 0  # Handle case where there are no sales today

            # Get total sales for the current month
            self.cursor.execute(query_month, (first_day_of_month,))
            row_month = self.cursor.fetchone()
            total_sales_month = row_month[0] if row_month else 0  # Handle case where there are no sales this month

            # Get total count of cashiers
            self.cursor.execute(query_count_cashier)
            row_cashier = self.cursor.fetchone()
            count_cashier = row_cashier[0] if row_cashier else 0  # Handle case where there are no cashiers

            # Get total count of admins
            self.cursor.execute(query_count_admin)
            row_admin = self.cursor.fetchone()
            count_admin = row_admin[0] if row_admin else 0  # Handle case where there are no admins

            return {
                'total_sales_today': total_sales_today,
                'total_sales_month': total_sales_month,
                'count_cashier': count_cashier,
                'count_admin': count_admin
            }  # Return total sales and counts in a dictionary
        except Exception as e:
            print(f"An error occurred: {e}")
            return None  # Return None or handle as needed


if __name__ == "__main__":
    Sales().delete_sales(111)
