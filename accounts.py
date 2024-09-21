from database import Database

class Accounts(Database):
    def create_account(self, fname, lname, address, contact, email, username, password, role):
        # Insert a new account
        self.cursor.execute('''
            INSERT INTO Accounts (fname, lname, address, contact, email, username, password, role) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        ''', (fname, lname, address, contact, email, username, password, role))
        self.conn.commit()
        print(f"Account for '{username}' created successfully!")

    def read_accounts(self):
        # Retrieve all accounts
        self.cursor.execute('SELECT * FROM Accounts;')
        accounts = self.cursor.fetchall()
        for account in accounts:
            print(account)
        return accounts

    def update_account(self, account_id, fname=None, lname=None, address=None, contact=None, email=None, username=None, password=None, role=None):
        # Update the account based on given arguments
        updates = []
        params = []

        if fname:
            updates.append("fname = ?")
            params.append(fname)
        if lname:
            updates.append("lname = ?")
            params.append(lname)
        if address:
            updates.append("address = ?")
            params.append(address)
        if contact:
            updates.append("contact = ?")
            params.append(contact)
        if email:
            updates.append("email = ?")
            params.append(email)
        if username:
            updates.append("username = ?")
            params.append(username)
        if password:
            updates.append("password = ?")
            params.append(password)
        if role:
            updates.append("role = ?")
            params.append(role)

        # Only proceed if there is something to update
        if updates:
            sql_query = f"UPDATE Accounts SET {', '.join(updates)} WHERE id = ?"
            params.append(account_id)
            self.cursor.execute(sql_query, tuple(params))
            self.conn.commit()
            print(f"Account ID {account_id} updated successfully!")
        else:
            print("No fields provided for update.")

    def delete_account(self, account_id):
        # Delete an account by ID
        self.cursor.execute('''
            DELETE FROM Accounts 
            WHERE id = ?;
        ''', (account_id,))
        self.conn.commit()
        print(f"Account ID {account_id} deleted successfully!")

    def close_connection(self):
        # Close the database connection
        self.conn.close()