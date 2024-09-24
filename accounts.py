from database import Database

class Accounts(Database):
    def __init__(self):
        super().__init__()  # Initialize the parent class
        self.create_admin_account()  # Create admin account on initialization

    def create_account(self, fname, lname, address, contact, email, username, password, role, date_created=None):
        # Use the current date if no date is provided
        if date_created is None:
            date_created = 'CURRENT_TIMESTAMP'  # Use SQLite's CURRENT_TIMESTAMP
        else:
            date_created = f'"{date_created}"'  # Format date for SQL

        # Insert a new account
        self.cursor.execute(f'''
            INSERT INTO Accounts (fname, lname, address, contact, email, username, password, role, date_created) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, {date_created});
        ''', (fname, lname, address, contact, email, username, password, role))
        self.conn.commit()
        print(f"Account for '{username}' created successfully!")

    def create_admin_account(self):
        # Create an admin account with default values
        try:
            self.cursor.execute('''
                SELECT * FROM Accounts WHERE role = 'admin';
            ''')
            if not self.cursor.fetchone():  # Check if admin already exists
                self.create_account(
                    fname="Admin",
                    lname="User",
                    address="Admin Address",
                    contact="1234567890",
                    email="admin@example.com",  # Change if necessary
                    username="admin",
                    password="admin",  # Default password
                    role="admin"
                )
                print("Admin account created successfully.")
            else:
                print("Admin account already exists.")
        except Exception as e:
            print(f"Error creating admin account: {e}")

    def read_accounts(self):
        # Retrieve all accounts
        self.cursor.execute('SELECT id, fname, lname, address, contact, email, username, role, date_created FROM Accounts;')
        accounts = self.cursor.fetchall()
        for account in accounts:
            print(account)
        return accounts

    def update_account(self, account_id, fname=None, lname=None, address=None, contact=None, email=None, username=None, password=None, role=None, date_created=None):
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
        if date_created is not None:
            updates.append("date_created = ?")
            params.append(date_created)

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


if __name__ == "__main__":
    Accounts().create_admin_account()