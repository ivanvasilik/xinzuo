# Delivery Estimate Feature Documentation

## Overview

A fully isolated, modular delivery estimate calculator for product pages. Shows customers when they can expect to receive their order based on their postcode.

## Features

✅ **Express Delivery Zones** - Next business day delivery for major metro areas  
✅ **Standard Delivery** - 1-2 days (QLD) or 1-3 days (other states)  
✅ **Cutoff Time Handling** - Orders before 12pm (configurable) for next-day delivery  
✅ **Weekend Detection** - Automatically skips Saturdays and Sundays  
✅ **Public Holiday Support** - Optional Australian public holiday detection  
✅ **Mobile-First Design** - Optimized for mobile with responsive layout  
✅ **Completely Isolated** - Won't affect other page elements

## Files Created

```
blocks/delivery-estimate.liquid              # Block definition
snippets/delivery-estimate-calculator.liquid # UI template and styles
assets/delivery-estimate.js                  # Logic and calculations
```

## How to Use

### Adding to Product Page (via Shopify Theme Editor)

1. Go to **Shopify Admin** → **Online Store** → **Themes** → **Customize**
2. Navigate to a **Product Page**
3. In the product details section, click **Add block**
4. Select **Delivery Estimate** from the block list
5. Position it after the "Add to Cart" button (recommended)
6. Click **Save**

### Adding Programmatically

The delivery estimate block is already added to `templates/product.json` after the buy buttons block:

```json
"delivery_estimate_block": {
  "type": "delivery-estimate",
  "settings": {
    "cutoff_time": "12:00",
    "enable_public_holidays": true,
    "show_icon": true,
    "background_color": "#f8f9fa",
    "border_color": "#e0e0e0",
    "border_radius": 8,
    "padding-block-start": 16,
    "padding-block-end": 0
  }
}
```

## Configuration Options

### Block Settings (Shopify Theme Editor)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `cutoff_time` | Text | "12:00" | Order cutoff time in 24h format (HH:MM) |
| `enable_public_holidays` | Checkbox | true | Skip Australian public holidays |
| `show_icon` | Checkbox | true | Display delivery icon |
| `background_color` | Color | #f8f9fa | Background color |
| `border_color` | Color | #e0e0e0 | Border color |
| `border_radius` | Range | 8px | Corner roundness (0-20px) |
| `padding-block-start` | Range | 0px | Top padding |
| `padding-block-end` | Range | 0px | Bottom padding |

## Delivery Zones

### Express Delivery (Next Business Day)

Applies to these postcode ranges:

| Location | Postcodes |
|----------|-----------|
| **Canberra** | 0200, 2600-2620, 2900-2914 |
| **Sydney** | 1000-1920, 2000-2234, 2555-2574, 2740-2786 |
| **Melbourne** | 3000-3207, 3340-3341, 3750, 3755-3757, 8001-8785 |
| **Brisbane** | 4000-4209, 9016-9464 |
| **Gold Coast** | 2484-2490, 4210-4275, 9726 |
| **Adelaide** | 5000-5174, 5800-5950 |
| **Perth CBD** | 6000-6005, 6800-6892 |
| **Tasmania** | 7000-7019, 7050-7053, 7055, 7248-7250, 7258, 7275-7300, 7315, 7320 |

### Standard Delivery

- **Queensland**: 1-2 business days
- **Other states**: 1-3 business days

## How It Works

### User Flow

1. Customer enters their 4-digit postcode
2. Component validates the postcode
3. System checks if postcode is in express delivery zone
4. Calculates delivery date considering:
   - Current time vs cutoff time
   - Weekends
   - Public holidays (if enabled)
5. Displays personalized delivery estimate

### Example Messages

**Express Delivery (Before Cutoff):**
```
✓ Receive by tomorrow — Order within 3 hours 25 min
  Express delivery available for Brisbane (postcode 4000)
```

**Express Delivery (After Cutoff):**
```
✓ Receive by Wednesday, Nov 13
  Express delivery available for Sydney (postcode 2000)
```

**Standard Delivery (Queensland):**
```
✓ Delivery in 1-2 business days
  Standard delivery to Queensland (postcode 4350)
```

**Standard Delivery (Other States):**
```
✓ Delivery in 1-3 business days
  Standard delivery to your area (postcode 5000)
```

## Maintenance

### Annual Public Holiday Updates

**When**: December each year  
**File**: `assets/delivery-estimate.js`  
**What to update**: `PUBLIC_HOLIDAYS` array

```javascript
static PUBLIC_HOLIDAYS = [
  // 2025
  '2025-01-01', // New Year's Day
  '2025-01-27', // Australia Day
  // ... add new year's holidays here
];
```

### Updating Delivery Zones

If delivery zones change, update the postcode ranges in `assets/delivery-estimate.js`:

```javascript
static EXPRESS_ZONES = {
  Brisbane: [[4000, 4209], [9016, 9464]],
  // Add or modify zones here
};
```

### Changing Cutoff Time

Update via **Shopify Theme Editor** or in `templates/product.json`:

```json
"cutoff_time": "14:00"  // Change to 2:00 PM
```

## Styling Customization

### Via Theme Editor

Use the built-in color and spacing controls in the Shopify Theme Editor.

### Via Code

Modify `snippets/delivery-estimate-calculator.liquid`:

```css
.delivery-estimate-container {
  /* Your custom styles */
  padding: 20px;
  background-color: var(--delivery-bg-color);
}
```

## Testing

### Test Postcodes

| Postcode | Expected Result |
|----------|----------------|
| `4000` | Express - Brisbane |
| `2000` | Express - Sydney |
| `3000` | Express - Melbourne |
| `4350` | Standard - QLD (1-2 days) |
| `5000` | Standard - Other (1-3 days) |
| `1234` | Error - Invalid postcode |

### Test Scenarios

1. **Before cutoff time** - Should show "Order within X hours"
2. **After cutoff time** - Should show next available day
3. **Friday evening** - Should skip to Monday (or Tuesday if Monday is holiday)
4. **Public holiday** - Should skip to next business day
5. **Invalid postcode** - Should show error message

## Troubleshooting

### Component Not Showing

1. Check that the block is added to `templates/product.json`
2. Verify it's in the `block_order` array
3. Clear browser cache and hard refresh (Ctrl+Shift+R)

### Incorrect Delivery Dates

1. Verify cutoff time format is HH:MM (24-hour)
2. Check public holidays list is up to date
3. Ensure `enable_public_holidays` is set correctly

### Styling Issues

1. Check for CSS conflicts with existing styles
2. Verify color variables are being applied
3. Test on different screen sizes

### JavaScript Errors

1. Check browser console for errors
2. Verify `component.js` is loading correctly
3. Ensure no conflicts with other JavaScript

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- ✅ Keyboard navigable
- ✅ Screen reader friendly
- ✅ ARIA labels on form inputs
- ✅ High contrast mode compatible
- ✅ Focus indicators

## Future Enhancements

Potential improvements:

- [ ] Auto-detect postcode from IP geolocation
- [ ] Save postcode in localStorage for return visits
- [ ] Integration with Shopify Checkout postcode
- [ ] State-specific public holiday detection
- [ ] Multiple cutoff times for different product types
- [ ] Real-time courier API integration

## Support

For questions or issues:

1. Check this documentation first
2. Review the code comments in each file
3. Test with the provided test postcodes
4. Contact the development team

---

**Version**: 1.0.0  
**Last Updated**: November 2025  
**Maintained By**: Xinzuo Development Team

