# Delivery Estimate Testing Guide

## Quick Test Checklist

Use this checklist to verify the delivery estimate feature is working correctly.

## Pre-Flight Checks

- [ ] Files exist:
  - `blocks/delivery-estimate.liquid`
  - `snippets/delivery-estimate-calculator.liquid`
  - `assets/delivery-estimate.js`
- [ ] Block added to `templates/product.json`
- [ ] Block in `block_order` array
- [ ] Development server running

## Visual Verification

### Desktop View
The component should appear below the "Add to Cart" button with:
- Icon on the left (blue delivery icon)
- Title: "Check Delivery Estimate"
- Subtitle text explaining functionality
- Input field and "Check" button side-by-side
- Clean, professional appearance

### Mobile View (< 750px)
- Icon hidden (mobile optimization)
- Input and button stacked vertically
- Full-width layout
- Easy to tap/interact with
- Maintains readability

## Functional Tests

### Test 1: Express Delivery (Before Cutoff)

**Scenario**: Test at 10:00 AM (before 12:00 PM cutoff)

| Postcode | Expected Result |
|----------|----------------|
| 4000 | "Receive by tomorrow — Order within X hours" |
| 2000 | "Receive by tomorrow — Order within X hours" |
| 3000 | "Receive by tomorrow — Order within X hours" |

**What to check**:
- ✅ Green success message appears
- ✅ Shows time remaining until cutoff
- ✅ Location name is correct (Brisbane, Sydney, Melbourne)
- ✅ Animation is smooth

### Test 2: Express Delivery (After Cutoff)

**Scenario**: Test at 2:00 PM (after 12:00 PM cutoff)

| Postcode | Expected Result |
|----------|----------------|
| 4000 | "Receive by [next business day]" |
| 2000 | "Receive by [next business day]" |

**What to check**:
- ✅ No "Order within" message
- ✅ Shows correct next business day
- ✅ Skips weekends
- ✅ Skips public holidays (if enabled)

### Test 3: Standard Delivery (Queensland)

| Postcode | Expected Result |
|----------|----------------|
| 4350 | "Delivery in 1-2 business days" |
| 4570 | "Delivery in 1-2 business days" |
| 4800 | "Delivery in 1-2 business days" |

**What to check**:
- ✅ Shows "1-2 business days"
- ✅ Mentions "Queensland"
- ✅ Green success message

### Test 4: Standard Delivery (Other States)

| Postcode | Expected Result |
|----------|----------------|
| 5000 | "Delivery in 1-3 business days" |
| 6000 | "Delivery in 1-3 business days" (not in Perth CBD express zone) |
| 3500 | "Delivery in 1-3 business days" |

**What to check**:
- ✅ Shows "1-3 business days"
- ✅ Mentions "your area"
- ✅ Green success message

### Test 5: Error Handling

| Input | Expected Error |
|-------|---------------|
| (empty) | "Please enter a postcode" |
| 123 | "Please enter a valid 4-digit Australian postcode" |
| 12345 | Truncated to 4 digits automatically |
| abc4 | Only numbers allowed (letters stripped) |
| 0100 | "Please enter a valid Australian postcode" |

**What to check**:
- ✅ Red error message appears
- ✅ Error icon shows
- ✅ Clear, helpful error text
- ✅ Previous results are hidden

### Test 6: Weekend Handling

**Scenario**: Test on Friday after cutoff

| Day | Time | Postcode | Expected |
|-----|------|----------|----------|
| Friday | 2:00 PM | 4000 | Monday (skip weekend) |
| Saturday | Any | 4000 | Monday |
| Sunday | Any | 4000 | Monday |

### Test 7: Public Holiday Handling

**Scenario**: Test when next business day is a public holiday

**Setup**: 
1. Set date to day before public holiday
2. Enter express delivery postcode

**Expected**:
- ✅ Skips the public holiday
- ✅ Shows day after holiday
- ✅ Correctly chains (holiday + weekend = Tuesday)

## UI/UX Tests

### Interaction Tests

- [ ] Input field accepts numbers only
- [ ] Input field limits to 4 characters
- [ ] Enter key triggers check
- [ ] Button click triggers check
- [ ] Focus indicators work
- [ ] Tab navigation works
- [ ] Animations are smooth

### Responsive Tests

| Screen Size | Test |
|------------|------|
| Mobile (320px) | Layout doesn't break |
| Mobile (375px) | Comfortable to use |
| Tablet (768px) | Smooth transition |
| Desktop (1024px) | Icon appears, side-by-side layout |
| Desktop (1440px+) | Doesn't stretch excessively |

### Accessibility Tests

- [ ] Screen reader announces results
- [ ] Keyboard navigation works
- [ ] Focus visible on all interactive elements
- [ ] Color contrast meets WCAG standards
- [ ] Error messages are announced
- [ ] ARIA labels present

## Integration Tests

### Product Page Integration

- [ ] Component appears in correct position
- [ ] Doesn't break other blocks
- [ ] Doesn't affect add-to-cart functionality
- [ ] Doesn't interfere with variant selection
- [ ] Maintains spacing/layout

### Theme Editor Tests

- [ ] Block appears in block list
- [ ] Settings are editable
- [ ] Color changes apply immediately
- [ ] Padding adjustments work
- [ ] Toggle icon on/off works
- [ ] Cutoff time changes apply

## Performance Tests

- [ ] Component loads quickly
- [ ] No console errors
- [ ] No console warnings
- [ ] Smooth animations (60fps)
- [ ] Input is responsive
- [ ] Works on slow connections

## Browser Compatibility

Test on:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Edge Cases

### Special Dates

- [ ] New Year's Eve → New Year's Day
- [ ] Christmas Eve → Boxing Day
- [ ] Long weekends (3+ days)
- [ ] Multiple consecutive holidays

### Special Postcodes

- [ ] 0200 (Canberra)
- [ ] 9016-9464 (Brisbane PO Boxes)
- [ ] 8001-8785 (Melbourne)
- [ ] Boundary postcodes (e.g., 2620, 4209)

### User Behavior

- [ ] Rapid clicking doesn't break UI
- [ ] Multiple postcodes in sequence work
- [ ] Changing postcode updates result
- [ ] Refreshing page works correctly

## Regression Tests

After any changes, verify:

- [ ] Existing product page features still work
- [ ] Other blocks aren't affected
- [ ] Cart functionality works
- [ ] Checkout flow works
- [ ] Mobile navigation works

## Test Data

### Express Zone Postcodes by City

```
Canberra: 0200, 2600, 2610, 2620, 2900, 2914
Sydney: 1000, 2000, 2100, 2200, 2560, 2750
Melbourne: 3000, 3100, 3200, 3340, 3750, 3755, 8000
Brisbane: 4000, 4100, 4200, 9016, 9400
Gold Coast: 2484, 4210, 4220, 4270, 9726
Adelaide: 5000, 5100, 5170, 5800, 5900
Perth CBD: 6000, 6003, 6005, 6800
Tasmania: 7000, 7010, 7050, 7055, 7248, 7275, 7315, 7320
```

### Standard Delivery Postcodes

```
QLD: 4350, 4570, 4800, 4850
NSW: 2300, 2400, 2500, 2830
VIC: 3300, 3500, 3800
SA: 5200, 5300, 5600
WA: 6100, 6200, 6500
TAS: 7100, 7200, 7300
```

## Issue Reporting Template

If you find an issue:

```markdown
**Issue**: [Brief description]
**Steps to Reproduce**:
1. 
2. 
3. 

**Expected**: [What should happen]
**Actual**: [What actually happened]
**Postcode Tested**: [####]
**Time of Test**: [HH:MM]
**Date of Test**: [YYYY-MM-DD]
**Browser**: [Browser name & version]
**Device**: [Desktop/Mobile/Tablet]
**Screenshot**: [If applicable]
```

## Success Criteria

All tests must pass:

✅ All postcodes return correct delivery estimates  
✅ Weekends are skipped  
✅ Public holidays are handled (if enabled)  
✅ Cutoff time logic works  
✅ Mobile and desktop layouts work  
✅ No console errors  
✅ Accessible via keyboard  
✅ Error messages are helpful  
✅ Component is isolated (no side effects)  

---

**Last Updated**: November 2025  
**Testing Version**: 1.0.0

