import json
import os
import shutil

# Read the JSON file
with open('tarot_cards.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Create a mapping of card_id to card_name
card_mapping = {}
for card in data['tarot_cards']:
    card_id = card['card_id']
    card_name = card['card_name']
    card_mapping[card_id] = card_name

# Get the images directory
images_dir = 'images/tarot'

# List all files in the directory
files = os.listdir(images_dir)

print("Starting to rename files...")
renamed_count = 0

for filename in files:
    if filename.endswith('.png'):
        # Extract the card_id from filename (e.g., "Card_Tarot_00.png" -> "Card_Tarot_00")
        card_id = filename.replace('.png', '')

        if card_id in card_mapping:
            # Get the new name
            new_name = card_mapping[card_id] + '.png'

            # Full paths
            old_path = os.path.join(images_dir, filename)
            new_path = os.path.join(images_dir, new_name)

            # Rename the file
            os.rename(old_path, new_path)
            print(f"Renamed: {filename} -> {new_name}")
            renamed_count += 1
        else:
            print(f"Warning: No mapping found for {card_id}")

print(f"\nTotal files renamed: {renamed_count}")
