# Series Comparison Page - Implementation Guide

## Overview
I've created a fully customizable Series Comparison section for your Shopify store. This allows you to showcase and compare your knife series (LAN, MO, Retro, Supreme) side-by-side with all the features shown in your reference image.

---

## What's Been Created

### 1. **Section File**: `sections/series-comparison.liquid`
This is the main section that powers the comparison feature. It includes:
- Responsive grid layout (4 columns on desktop, 2 on tablet, 1 on mobile)
- Customizable series blocks
- Star rating system for overall ratings and performance metrics
- Dynamic text fields for all specifications
- Pricing and buy buttons
- Footer notes section
- Matches your dark theme aesthetic

### 2. **Page Template**: `templates/page.series-comparison.json`
A pre-configured page template with all 4 series already set up with example data.

---

## How to Set Up the Comparison Page

### Option 1: Using the Pre-configured Template (Recommended)

1. **In Shopify Admin:**
   - Go to `Online Store` → `Pages`
   - Click `Add page`
   - Enter title: "Series Comparison" (or your preferred name)
   - In the right sidebar, under `Theme template`, select: **"page.series-comparison"**
   - Click `Save`

2. **The page is now live!** Visit it to see the comparison.

3. **To customize the content:**
   - Go to `Online Store` → `Themes` → `Customize`
   - Navigate to your newly created page from the top dropdown
   - Click on the "Series Comparison" section
   - Customize any settings (see customization guide below)

### Option 2: Adding to an Existing Page

1. **In Shopify Theme Editor:**
   - Go to `Online Store` → `Themes` → `Customize`
   - Navigate to the page where you want to add the comparison
   - Click `Add section`
   - Search for **"Series Comparison"**
   - Add it to your page

2. **Add Series Blocks:**
   - Click on the Series Comparison section
   - Click `Add block` → `Series`
   - Repeat for each series you want to compare
   - Configure each series (see customization guide below)

---

## Customization Guide

### Section-Level Settings
Click on the "Series Comparison" section to access these global settings:

#### Header Settings
- **Show Header**: Toggle to show/hide the title and description
- **Title**: Main heading (default: "Know How Each Series Differ")
- **Description**: Subheading text explaining the comparison

#### Styling
- **Color Scheme**: Choose from your theme's color schemes
- **Top Padding**: Adjust spacing above the section (0-200px)
- **Bottom Padding**: Adjust spacing below the section (0-200px)

#### Footer Notes
- **Show Footer Notes**: Toggle to show/hide footer explanations
- **Note 1 Title**: Title for the first note
- **Note 1 Text**: Content for the first note
- **Note 2 Text**: Content for the second note (no title needed)

---

### Block-Level Settings (Each Series)
Click on individual series blocks to customize:

#### Series Information
- **Series Name**: Display name (e.g., "SUPREME SERIES")
- **Series Image**: Upload product image for this series
- **Buy Now Link**: URL where users go when clicking "BUY NOW"

#### Rating Section
- **Star Rating**: Select 1-5 stars for overall rating
- **Rating Value**: Text display (e.g., "4.8 Stars")
- **Review Count**: Number of reviews (e.g., "124 Reviews")

#### Steel & Hardness
- **Core Steel**: Steel type and description (e.g., "X50CrMoV15 (German)**")
- **Hardness**: HRC rating (e.g., "56-58 HRC")

#### Performance Ratings (All use 1-5 star system)
- **Toughness**: Select 1-5 stars
- **Edge Retention**: Select 1-5 stars
- **Corrosion Resistance**: Select 1-5 stars
- **Ease to Sharpen**: Select 1-5 stars

#### Pricing
- **Pricing**: Text display (e.g., "Starts from $62.00")

---

## Managing Series

### Adding a New Series
1. In the theme editor, click on the Series Comparison section
2. Click `Add block` → `Series`
3. Fill in all the fields for the new series
4. The new series will automatically appear in the grid

### Removing a Series
1. Click on the series block you want to remove
2. Click the trash icon or "Remove block"
3. Confirm deletion

### Reordering Series
1. In the section settings, you'll see all series blocks listed
2. Click and drag the ⋮⋮ handle to reorder
3. The display order will update automatically

---

## Linking to the Comparison Page

Once your page is created, you can link to it from:

### Navigation Menu
1. Go to `Online Store` → `Navigation`
2. Select your menu (e.g., Main menu)
3. Click `Add menu item`
4. Name: "Compare Series" (or your preference)
5. Link: Select your series comparison page
6. Click `Add`

### Product Pages
You can add links in product descriptions using the URL of your comparison page.

### Collection Pages
Add a banner or button linking to `/pages/series-comparison` (or whatever you named it)

---

## Design Features

### Responsive Behavior
- **Desktop (>1024px)**: 4 columns grid
- **Tablet (750-1024px)**: 2 columns grid
- **Mobile (<750px)**: 1 column, stacked cards

### Interactive Elements
- Cards have hover effects (lift and border glow)
- Buy Now buttons have hover states
- All clickable elements have transitions

### Dark Theme Integration
- Matches your existing color scheme
- Uses your font families (Sen, Albert Sans)
- Consistent spacing and styling with your theme

---

## Example Data Included

The template comes pre-configured with example data for all 4 series:

1. **Supreme Series**: Entry-level, German steel
2. **Retro Series**: Mid-range, 3-layer steel
3. **LAN Series**: Premium, Damascus VG10
4. **MO Series**: Mid-high range, Japanese steel

You should update all these values to match your actual product specifications!

---

## Tips & Best Practices

### Images
- **Recommended size**: 800x800px minimum
- **Format**: PNG with transparent background works best
- **Style**: Product on a clean background or lifestyle shot
- **Consistency**: Use similar styling across all series for professional look

### Text Content
- Keep series names short and clear
- Use consistent formatting for steel descriptions
- Price format should match across all series
- Review counts should be accurate (can pull from Judge.me)

### Star Ratings
- Be honest with performance ratings
- Consider relative differences between series
- Higher-end series should show clear advantages
- Balance helps customers make informed decisions

### Links
- Test all "Buy Now" links before going live
- Consider linking to collection pages rather than single products
- You can link to specific product pages if preferred

---

## Troubleshooting

### Section Not Appearing
- Make sure you've saved the page after selecting the template
- Clear your browser cache and refresh
- Check that the section is enabled (not hidden)

### Images Not Showing
- Ensure images are uploaded in the theme editor
- Check image file size (should be under 5MB)
- Try re-uploading if issues persist

### Styling Looks Off
- Verify you're using the correct color scheme
- Check if any custom CSS might be conflicting
- Compare with the default settings in the guide

### Mobile Layout Issues
- The layout is responsive by default
- Test on actual mobile devices or Chrome DevTools
- Adjust padding if needed for your specific case

---

## Future Enhancements

You can easily extend this section:

1. **Add More Features**: Edit the liquid file to add new comparison points
2. **Different Layouts**: Modify the CSS for alternative grid arrangements
3. **Filters**: Add JavaScript to let users filter by feature
4. **Comparison Tool**: Add checkboxes to compare selected series only
5. **Print Styles**: Add CSS for printer-friendly comparisons

---

## File Locations

- Section: `sections/series-comparison.liquid`
- Template: `templates/page.series-comparison.json`
- This Guide: `SERIES_COMPARISON_GUIDE.md`

---

## Need Help?

If you need to modify the design or add features:
1. The section file uses standard Liquid, HTML, and CSS
2. All styling is in the `{% style %}` block at the top
3. Content structure is in the HTML section
4. Settings schema is in the `{% schema %}` block at the bottom

The code is well-commented and follows Shopify best practices for easy maintenance.

