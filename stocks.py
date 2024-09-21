from database import Database

class Stocks(Database):

    def add_stock(self, product_id, stock_in=0, stock_out=0, date=None):
        # Insert a new stock record
        self.cursor.execute('''
            INSERT INTO Stocks (product_id, stock_in, stock_out, date) 
            VALUES (?, ?, ?, ?);
        ''', (product_id, stock_in, stock_out, date))
        self.conn.commit()
        print(f"Stock record added for Product ID {product_id}.")

    def read_stocks(self):
        # Retrieve all stock records
        self.cursor.execute('SELECT * FROM Stocks;')
        stocks = self.cursor.fetchall()
        for stock in stocks:
            print(stock)
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
        if date:
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
