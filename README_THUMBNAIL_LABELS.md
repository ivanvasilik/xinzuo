# Thumbnail Label Implementation Guide

## Overview
This guide explains how to set up and use the custom thumbnail labels for the circular product navigation menu on product pages.

## What Was Changed

### 1. Custom Metafield
Added `custom.thumbnail_label` metafield to products for short display names in the circular menu.

### 2. Liquid Template Updates
Modified `blocks/_product-media-gallery.liquid` to:
- **Only show circular menu for knives** (checks `custom.isknife == true`)
- Check for `custom.thumbnail_label` metafield first
- Fall back to parsing logic if metafield is empty
- Filter products to only show same-series items (X02, X03, X06, PM8S, B37)

### 3. Series Filtering
The circular menu now only displays products from the same series:
- **X02** (Supreme Series)
- **X03** (Retro Series)
- **X06** (Mo Series)
- **PM8S** (Lan Series)
- **B37** (Lan Series)

## How to Update Product Labels

### Option 1: Using Matrixify (Bulk Update - RECOMMENDED)

1. **Generate the Import File**
   ```bash
   python generate_thumbnail_labels.py
   ```
   This creates `thumbnail_labels_import.csv` with correct labels for all knife products (only products with `custom.isknife = true`).

2. **Review the CSV**
   - Open `thumbnail_labels_import.csv`
   - Verify the labels are correct
   - Make any manual adjustments if needed

3. **Upload to Shopify**
   - Go to Shopify Admin → Apps → Matrixify
   - Select "Import"
   - Upload `thumbnail_labels_import.csv`
   - The CSV includes these columns:
     - `Handle` - Product handle
     - `Command` - Set to "MERGE" (updates existing products)
     - `Metafield: custom.thumbnail_label [single_line_text_field]` - The label value
   - Run the import

### Option 2: Manual Update (Single Products)

1. Go to Shopify Admin → Products
2. Select a product
3. Scroll to "Metafields"
4. Find "custom.thumbnail_label"
5. Enter the short name (e.g., "Chef", "Carving", "2-Piece")
6. Save

## Label Examples

| Product Title | Thumbnail Label |
|---------------|----------------|
| 8" Chef Knife - Supreme Series (X02) | Chef |
| 10" Carving Knife - Lan Series (B37) | Carving |
| 7" Cai Dao Cleaver - Supreme Series (X02) | Cai Dao |
| 2-Piece Knife Set (8" Chef + 5" Utility) - Supreme Series (X02) | 2-Piece |
| 8" Granton-Edge Chef Knife - Supreme Series (X02) | Granton |
| 7" Butcher's Cleaver - Supreme Series (X02) | Butcher's |

## Testing

A development theme has been created for testing:
- **Theme Name**: Development-Testing-Thumbnails
- **Theme ID**: #140228919347
- **Preview URL**: https://syavzd-hz.myshopify.com?preview_theme_id=140228919347

### Test Checklist
- [ ] Circular menu shows correct labels
- [ ] Only same-series products appear in menu
- [ ] Labels don't wrap to multiple lines
- [ ] All series work correctly (X02, X03, X06, PM8S, B37)

## Files Modified

1. `blocks/_product-media-gallery.liquid` - Circular menu logic
2. `blocks/_product-title-custom.liquid` - Product title display
3. `.gitignore` - Added CSV files
4. `generate_thumbnail_labels.py` - Script to generate import CSV

## Pushing to Live

Once testing is complete:

```bash
shopify theme push --live
```

Or push specific files:
```bash
shopify theme push --live --only blocks/_product-media-gallery.liquid blocks/_product-title-custom.liquid
```

## Troubleshooting

### Labels not showing
1. Check if metafield is set in Shopify Admin
2. Verify metafield namespace and key: `custom.thumbnail_label`
3. Check browser console for JavaScript errors

### Wrong products in circular menu
1. Verify product title contains series code: (X02), (X03), (X06), (PM8S), or (B37)
2. Check that product is in a collection with "Series" in the title

### Labels wrapping to multiple lines
1. Keep labels short (1-2 words max)
2. Use abbreviations where appropriate
3. Update the metafield value to be shorter

## Maintenance

When adding new products:
1. Export products using Matrixify
2. Run `python generate_thumbnail_labels.py`
3. Review and import the generated CSV
4. Test on development theme before pushing live

