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
            # Join Stocks and Products tables where stock_id matches
            self.cursor.execute('''
                SELECT Stocks.*, Products.name AS product_name, Stocks.type AS stock_type, Stocks.stocks AS stocks
                FROM Stocks
                JOIN Products ON Stocks.product_id = Products.id
                WHERE Stocks.id = ?;
            ''', (stock_id,))
            row = self.cursor.fetchone()
            if row:
                # Return single record as a dictionary
                return {description[0]: value for description, value in zip(self.cursor.description, row)}
            return None  # If no record found, return None
        else:
            # Join Stocks and Products tables to fetch all stock records
            self.cursor.execute('''
                SELECT Stocks.*, Products.name AS product_name, Stocks.type AS stock_type, Stocks.stocks AS stocks
                FROM Stocks
                JOIN Products ON Stocks.product_id = Products.id;
            ''')
            rows = self.cursor.fetchall()
            # Return all records as a list of dictionaries
            return [{description[0]: value for description, value in zip(self.cursor.description, row)} for row in rows]


    def delete_stocks(self, stock_id):
        self.cursor.execute('DELETE FROM Stocks WHERE id = ?;', (stock_id,))
        self.conn.commit()
