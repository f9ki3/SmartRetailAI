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
        categories = self.cursor.fetchall()
        for category in categories:
            print(f"ID: {category[0]}, Name: {category[1]}, Created At: {category[2]}")
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

# Example Usage (Uncomment to run)
if __name__ == "__main__":
    cat = Category()
    cat.create_category('Shirt')
    cat.create_category('Shoes')
    cat.create_category('Pants')
    cat.read_categories()
    cat.update_category(1, 'T-Shirts')
    cat.delete_category(3)
    cat.read_categories()
    cat.close_connection()
