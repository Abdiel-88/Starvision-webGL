#!/usr/bin/env python3
import sqlite3
import json

# Connect to the SQLite database
conn = sqlite3.connect('planetinfo.db')
cursor = conn.cursor()

# Query all data from the PlanetData table
cursor.execute('SELECT * FROM PlanetData')
rows = cursor.fetchall()

# Convert query result to list of dictionaries
data = []
for row in rows:
    data.append({
        'Id': row[0],
        'Name': row[1],
        'Biography': row[2]
    })

# Write data to JSON file
with open('planetdata.json', 'w') as json_file:
    json.dump(data, json_file, indent=4)

print("Data exported to planetdata.json successfully.")

# Close the database connection
conn.close()
