from database import Database

class Stocks(Database):
    def addStocks(self, product_id, stocks, stock_type):
        # Insert the new stock record
        self.cursor.execute('''
            INSERT INTO Stocks (product_id, stocks, type) VALUES (?, ?, ?);
        ''', (product_id, stocks, stock_type))
        
        # Commit the transaction for the stock insertion
        self.conn.commit()
        
        # Retrieve the current stock from the products table
        self.cursor.execute('''
            SELECT stock FROM Products WHERE id = ?;
        ''', (product_id,))
        current_stock = self.cursor.fetchone()
        
        if current_stock is not None:
            # If the product exists, add the new stocks to the current stock
            new_stock_value = current_stock[0] + int(stocks)
            
            # Update the products table with the new stock value
            self.cursor.execute('''
                UPDATE Products SET stock = ? WHERE id = ?;
            ''', (new_stock_value, product_id))
            
            # Commit the transaction for the stock update
            self.conn.commit()
        else:
            print("Product not found.")
    
    def outStocks(self, product_id, stocks, stock_type): 
        # Insert the new stock record
        self.cursor.execute('''
            INSERT INTO Stocks (product_id, stocks, type) VALUES (?, ?, ?);
        ''', (product_id, stocks, stock_type))
        
        # Commit the transaction for the stock insertion
        self.conn.commit()   
        # Retrieve the current stock from the products table
        self.cursor.execute('''
            SELECT stock FROM Products WHERE id = ?;
        ''', (product_id,))
        current_stock = self.cursor.fetchone()
        
        if current_stock is not None:
            # If the product exists, add the new stocks to the current stock
            new_stock_value = current_stock[0] - int(stocks)
            
            # Update the products table with the new stock value
            self.cursor.execute('''
                UPDATE Products SET stock = ? WHERE id = ?;
            ''', (new_stock_value, product_id))
            
            # Commit the transaction for the stock update
            self.conn.commit()
        else:
            print("Product not found.")


    def readStocks(self, stock_id=None):
        if stock_id:
            self.cursor.execute('SELECT * FROM Stocks WHERE id = ?;', (stock_id,))
            return self.cursor.fetchone()  # Return a single record
        else:
            self.cursor.execute('SELECT * FROM Stocks;')
            return self.cursor.fetchall()  # Return all records

    def delete(self, stock_id):
        self.cursor.execute('DELETE FROM Stocks WHERE id = ?;', (stock_id,))
        self.conn.commit()
