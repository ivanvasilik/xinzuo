#!/usr/bin/env python3
"""
Generate thumbnail labels for Shopify products from CSV export.
Creates a Matrixify-compatible CSV with Handle and Metafield: custom.thumbnail_label
"""

import csv
import re
from pathlib import Path


def extract_thumbnail_label(title):
    """
    Extract a short thumbnail label from product title.
    
    Examples:
        "8\" Chef Knife - Supreme Series (X02)" -> "Chef"
        "7\" Cai Dao Cleaver - Supreme Series (X02)" -> "Cai Dao"
        "2-Piece Knife Set (8\" Chef + 5\" Utility) - Supreme Series (X02)" -> "2-Piece"
        "10\" Carving Knife - Lan Series (B37)" -> "Carving"
    """
    
    # Split by " - " to get the product name part (before series)
    parts = title.split(" - ")
    if len(parts) == 0:
        return title
    
    product_name = parts[0].strip()
    
    # Handle X-Piece sets
    if "-Piece" in product_name or "-piece" in product_name:
        # Extract just "2-Piece", "5-Piece", etc.
        match = re.search(r'(\d+-[Pp]iece)', product_name)
        if match:
            return match.group(1).title()
    
    # Remove size prefix (e.g., 8", 10", 12")
    # Match any number followed by "
    product_name = re.sub(r'^\d+(\.\d+)?"?\s*', '', product_name)
    
    # Special multi-word knife types
    multi_word_types = {
        'Cai Dao': 'Cai Dao',
        'Butcher\'s Cleaver': 'Butcher\'s',
        'Granton-Edge': 'Granton',
        'Granton - Edge': 'Granton',
        'Carving Fork': 'Fork',
    }
    
    for pattern, label in multi_word_types.items():
        if pattern.lower() in product_name.lower():
            return label
    
    # Remove common suffixes
    product_name = product_name.replace(' Knife', '')
    product_name = product_name.replace(' Set', '')
    
    # Take first word for simple cases
    first_word = product_name.split()[0] if product_name.split() else product_name
    
    return first_word.strip()


def main():
    input_file = Path('current_products.csv')
    output_file = Path('thumbnail_labels_import.csv')
    
    if not input_file.exists():
        print(f"Error: {input_file} not found!")
        return
    
    print(f"Reading {input_file}...")
    
    # Track unique products by handle
    products = {}
    
    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            handle = row.get('Handle', '').strip()
            title = row.get('Title', '').strip()
            is_knife = row.get('Metafield: custom.isknife [boolean]', '').strip().lower()
            
            # Skip if no handle or title
            if not handle or not title:
                continue
            
            # Only process knives
            if is_knife != 'true':
                continue
            
            # Only process first occurrence of each handle
            if handle not in products:
                label = extract_thumbnail_label(title)
                products[handle] = {
                    'Handle': handle,
                    'Title': title,
                    'Metafield: custom.thumbnail_label [single_line_text_field]': label
                }
    
    print(f"Processed {len(products)} unique products")
    
    # Write output CSV for Matrixify
    with open(output_file, 'w', encoding='utf-8', newline='') as f:
        fieldnames = ['Handle', 'Command', 'Metafield: custom.thumbnail_label [single_line_text_field]']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        
        writer.writeheader()
        for product in products.values():
            writer.writerow({
                'Handle': product['Handle'],
                'Command': 'MERGE',
                'Metafield: custom.thumbnail_label [single_line_text_field]': product['Metafield: custom.thumbnail_label [single_line_text_field]']
            })
    
    print(f"\n[SUCCESS] Created {output_file}")
    print(f"\nSample output:")
    print("-" * 80)
    
    # Show first 10 examples
    for i, (handle, data) in enumerate(list(products.items())[:10]):
        print(f"{data['Title'][:60]:<60} -> {data['Metafield: custom.thumbnail_label [single_line_text_field]']}")
    
    print("-" * 80)
    print(f"\n[NEXT STEPS]")
    print(f"1. Review {output_file}")
    print(f"2. Upload to Shopify via Matrixify app")
    print(f"3. Select 'Update' mode (not 'Replace')")
    print(f"4. Map columns and import")


if __name__ == '__main__':
    main()

