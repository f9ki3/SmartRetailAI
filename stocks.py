from database import Database

class Stocks(Database):

    def add_stock(self, product_id, stock_in=0, stock_out=0, date=None):
        # Use the current date if no date is provided
        if date is None:
            date = 'CURRENT_TIMESTAMP'  # Use SQLite's CURRENT_TIMESTAMP
        else:
            date = f'"{date}"'  # Format date for SQL

        # Insert a new stock record
        self.cursor.execute(f'''
            INSERT INTO Stocks (product_id, stock_in, stock_out, date) 
            VALUES (?, ?, ?, {date});
        ''', (product_id, stock_in, stock_out))
        self.conn.commit()
        print(f"Stock record added for Product ID {product_id}.")

    def read_stocks(self):
        # Retrieve all stock records
        self.cursor.execute('SELECT id, product_id, stock_in, stock_out, date FROM Stocks;')
        stocks = self.cursor.fetchall()
        for stock in stocks:
            print(f"ID: {stock[0]}, Product ID: {stock[1]}, Stock In: {stock[2]}, Stock Out: {stock[3]}, Date: {stock[4]}")
        return stocks

    def update_stock(self, stock_id, stock_in=None, stock_out=None, date=None):
        # Update stock information based on provided parameters
        updates = []
        params = []

        if stock_in is not None:
            updates.append("stock_in = ?")
            params.append(stock_in)
        if stock_out is not None:
            updates.append("stock_out = ?")
            params.append(stock_out)
        if date is not None:
            updates.append("date = ?")
            params.append(date)

        if updates:
            sql_query = f"UPDATE Stocks SET {', '.join(updates)} WHERE id = ?"
            params.append(stock_id)
            self.cursor.execute(sql_query, tuple(params))
            self.conn.commit()
            print(f"Stock ID {stock_id} updated.")
        else:
            print("No updates provided.")

    def delete_stock(self, stock_id):
        # Delete a stock record by ID
        self.cursor.execute('''
            DELETE FROM Stocks 
            WHERE id = ?;
        ''', (stock_id,))
        self.conn.commit()
        print(f"Stock ID {stock_id} deleted.")

    def close_connection(self):
        # Close the database connection
        self.conn.close()
