from database import Database

class Category(Database):
    def create_table(self):
        # Create the Category table if it doesn't exist
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS Category (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL
            );
        ''')
        self.conn.commit()

    def create_category(self, name):
        # Insert a new category
        self.cursor.execute('''
            INSERT INTO Category (name) 
            VALUES (?);
        ''', (name,))
        self.conn.commit()
        print(f"Category '{name}' created successfully!")

    def read_categories(self):
        # Retrieve all categories
        self.cursor.execute('SELECT * FROM Category;')
        categories = self.cursor.fetchall()
        for category in categories:
            print(category)
        return categories

    def update_category(self, category_id, new_name):
        # Update the name of an existing category by ID
        self.cursor.execute('''
            UPDATE Category 
            SET name = ? 
            WHERE id = ?;
        ''', (new_name, category_id))
        self.conn.commit()
        print(f"Category ID {category_id} updated to '{new_name}' successfully!")

    def delete_category(self, category_id):
        # Delete a category by ID
        self.cursor.execute('''
            DELETE FROM Category 
            WHERE id = ?;
        ''', (category_id,))
        self.conn.commit()
        print(f"Category ID {category_id} deleted successfully!")

    def close_connection(self):
        # Close the database connection
        self.conn.close()