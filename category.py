from database import Database

class Category(Database):
    def create_category(self, name):
        # Insert a new category, the 'created_at' will be automatically handled by SQLite
        self.cursor.execute('''
            INSERT INTO Category (name) 
            VALUES (?);
        ''', (name,))
        self.conn.commit()
        print(f"Category '{name}' created successfully with timestamp!")

    def read_categories(self):
        # Retrieve all categories, including the created_at date
        self.cursor.execute('SELECT id, name, created_at FROM Category;')
        rows = self.cursor.fetchall()

        # Get column names
        column_names = [desc[0] for desc in self.cursor.description]

        # Construct a list of dictionaries
        categories = []
        for row in rows:
            category_dict = {column_names[i]: row[i] for i in range(len(column_names))}
            categories.append(category_dict)

        return categories

    def view_category(self, category_id):
        # Retrieve a single category by ID
        self.cursor.execute('SELECT id, name, created_at FROM Category WHERE id = ?;', (category_id,))
        row = self.cursor.fetchone()

        # If a row is found, return it as a dictionary
        if row:
            column_names = [desc[0] for desc in self.cursor.description]
            return dict(zip(column_names, row))
        else:
            print(f"No category found with ID {category_id}")
            return None

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

# Example Usage (Uncomment to run)
if __name__ == "__main__":
    cat = Category()
    cat.read_categories()
    