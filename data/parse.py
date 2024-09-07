import csv
import json
import os

def filter_and_save_players(csv_file_path, output_file_path):
    # List of offense positions we are interested in
    offense_positions = {'QB', 'WR', 'TE', 'RB'}
    filtered_players = []

    # Check if the CSV file exists
    if not os.path.exists(csv_file_path):
        print(f"File not found: {csv_file_path}")
        return

    # Open and read the CSV file
    with open(csv_file_path, mode='r', newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)

        # Loop through each row in the CSV
        for row in reader:
            # Check if the player's status is 'ACT' and their position is one of the offense positions
            if row['status'] == 'ACT' and row['position'] in offense_positions:
                filtered_players.append(row)

    # Create JSON string from the filtered players list
    filtered_players_json = json.dumps(filtered_players, indent=4)

    # Prepare the output content with the specified prefix
    prefix = """import { Player } from "@/lib/types"

export const OFFENSE_PLAYERS: Array<Player> ="""
    output_content = f"{prefix} {filtered_players_json};"

    # Write the output content to the specified file
    with open(output_file_path, mode='w', encoding='utf-8') as output_file:
        output_file.write(output_content)

# Path to the CSV file
csv_file_path = 'players.csv'  # Make sure this path is correct

# Path to the output TypeScript file
output_file_path = 'data.ts'

# Call the function to filter players and save to a TypeScript file
filter_and_save_players(csv_file_path, output_file_path)
