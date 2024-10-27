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
                SELECT * FROM Accounts WHERE role = 'cashier';
            ''')
            if not self.cursor.fetchone():  # Check if admin already exists
                self.create_account(
                    fname="Cashier",
                    lname="User",
                    address="Cashier Address",
                    contact="1234567890",
                    email="cashier@example.com",  # Change if necessary
                    username="cashier",
                    password="cashier",  # Default password
                    role="cashier"
                )
                print("Admin account created successfully.")
            else:
                print("Admin account already exists.")
        except Exception as e:
            print(f"Error creating admin account: {e}")

    def read_accounts(self):
        # Retrieve all accounts
        self.cursor.execute('SELECT * FROM Accounts;')
        accounts = self.cursor.fetchall()
        column_names = [desc[0] for desc in self.cursor.description]  # Get column names from the cursor description

        # Convert each account tuple to a dictionary
        accounts_dict = [dict(zip(column_names, account)) for account in accounts]

        return accounts_dict


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
    
    def login(self, username, password):
        try:
            # Query the database for the user with the provided username and password
            self.cursor.execute('''
                SELECT * FROM Accounts WHERE username = ? AND password = ?;
            ''', (username, password))
            result = self.cursor.fetchone()
            
            # Check if the account exists
            if result:
                # Assuming the table columns are 'id', 'username', 'password', 'email', etc.
                column_names = [desc[0] for desc in self.cursor.description]
                user_data = dict(zip(column_names, result))
                return user_data  # Return the user information as a dictionary
            else:
                print("Invalid username or password.")
                return None  # Return None if no matching account
        except Exception as e:
            print(f"Error during login: {e}")
            return None  # Return None if an error occurs




    def close_connection(self):
        # Close the database connection
        self.conn.close()


if __name__ == "__main__":
    Accounts().create_admin_account()