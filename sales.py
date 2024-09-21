from database import Database

class Sales(Database):
    def create_sale(self, product_id, quantity, total_price, sale_date=None):
        # Use the current date if no sale_date is provided
        if sale_date is None:
            sale_date = 'CURRENT_TIMESTAMP'  # Use SQLite's CURRENT_TIMESTAMP
        else:
            sale_date = f'"{sale_date}"'  # Format date for SQL

        # Insert a new sale record
        self.cursor.execute(f'''
            INSERT INTO Sales (product_id, quantity, total_price, sale_date) 
            VALUES (?, ?, ?, {sale_date});
        ''', (product_id, quantity, total_price))
        self.conn.commit()
        print(f"Sale recorded for Product ID {product_id}.")

    def read_sales(self):
        # Retrieve all sales records, including sale_date
        self.cursor.execute('SELECT id, product_id, quantity, total_price, sale_date FROM Sales;')
        sales = self.cursor.fetchall()
        for sale in sales:
            print(f"ID: {sale[0]}, Product ID: {sale[1]}, Quantity: {sale[2]}, Total Price: {sale[3]}, Sale Date: {sale[4]}")
        return sales

    def update_sale(self, sale_id, product_id=None, quantity=None, total_price=None, sale_date=None):
        # Update sale information based on provided parameters
        updates = []
        params = []

        if product_id is not None:
            updates.append("product_id = ?")
            params.append(product_id)
        if quantity is not None:
            updates.append("quantity = ?")
            params.append(quantity)
        if total_price is not None:
            updates.append("total_price = ?")
            params.append(total_price)
        if sale_date is not None:
            updates.append("sale_date = ?")
            params.append(sale_date)

        if updates:
            sql_query = f"UPDATE Sales SET {', '.join(updates)} WHERE id = ?"
            params.append(sale_id)
            self.cursor.execute(sql_query, tuple(params))
            self.conn.commit()
            print(f"Sale ID {sale_id} updated.")
        else:
            print("No updates provided.")

    def delete_sale(self, sale_id):
        # Delete a sale record by ID
        self.cursor.execute('''
            DELETE FROM Sales 
            WHERE id = ?;
        ''', (sale_id,))
        self.conn.commit()
        print(f"Sale ID {sale_id} deleted.")

    def close_connection(self):
        # Close the database connection
        self.conn.close()
