# Xinzuo Design System & Style Guide

**Version:** 1.0  
**Last Updated:** November 2024  
**Reference:** Series Comparison Page  

This document captures the design patterns, colors, typography, and component styles used across Xinzuo pages for consistent, beautiful experiences.

---

## 🎨 Color Palette

### Background Colors
```css
/* Primary backgrounds */
--bg-dark-primary: rgba(41, 42, 51, 0.5);     /* Main card backgrounds */
--bg-dark-secondary: rgba(0, 0, 0, 0.3);      /* Section headers, darker areas */
--bg-dark-dropdown: rgba(41, 42, 51, 0.8);    /* Form elements */

/* Transparent */
--bg-transparent: transparent;                 /* Section backgrounds to inherit page color */
```

### Text Colors
```css
/* Primary text */
--text-white: #fff;                           /* Headings, primary content, values */
--text-gray: #c9c9cc;                         /* Body text, labels, secondary content */

/* Accent colors */
--accent-red: #ff0004;                        /* Primary CTA, stars, highlights */
--accent-red-hover: #cc0003;                  /* Button hover state */
--accent-red-active: #aa0002;                 /* Button active/pressed state */
--accent-red-subtle: rgba(255, 0, 4, 0.1);    /* Highlight boxes, backgrounds */
```

### Border & Divider Colors
```css
--border-subtle: rgba(255, 255, 255, 0.1);    /* Card borders, dividers */
--border-medium: rgba(255, 255, 255, 0.2);    /* Form inputs, emphasized borders */
--border-accent: 3px solid #ff0004;           /* Left border on highlight boxes */
```

### UI Element Colors
```css
/* Empty/inactive states */
--star-empty: rgba(255, 255, 255, 0.2);       /* Empty star rating */
```

---

## 🔤 Typography

### Font Families
```css
--font-primary: "Sen";                        /* Headings, labels, buttons, UI elements */
--font-secondary: "Albert Sans";              /* Body text, descriptions, paragraphs */
```

### Mobile Typography (Base - <750px)

#### Headings
```css
h1, .page-title:        28px, Sen, 600, 130% line-height
h2, .section-heading:   28px, Sen, 600, 130% line-height
h3, .subsection:        18px, Sen, 600, 1.3 line-height
```

#### Body Text
```css
.body-large:            16px, Albert Sans, 400, 1.5 line-height
.body-medium:           15px, Albert Sans, 400, 1.4 line-height
.body-default:          14px, Albert Sans, 400, 1.6 line-height
.body-small:            13px, Albert Sans, 400, 1.4-1.7 line-height
```

#### Labels & UI
```css
.label-large:           14px, Sen, 600, 1.3 line-height
.label-default:         13px, Sen, 600, 1.3 line-height
.label-small:           12px, Sen, 600, 1.3 line-height, uppercase, 0.5px letter-spacing
```

#### Interactive Elements
```css
.button-text:           14px, Sen, 600
.dropdown-text:         13px, Sen, 600
.link-text:             14px, Sen, 600
```

### Tablet Typography (750-1024px)

#### Headings
```css
h1, .page-title:        36px, Sen, 600, 130% line-height
h2, .section-heading:   36px, Sen, 600, 130% line-height
h3, .subsection:        20px, Sen, 600, 1.3 line-height
```

#### Body Text
```css
.body-large:            17px, Albert Sans, 400, 1.5 line-height
.body-medium:           15px, Albert Sans, 400, 1.6-1.7 line-height
.body-default:          15px, Albert Sans, 400, 1.6 line-height
```

#### Labels & UI
```css
.label-default:         13-14px, Sen, 600
```

### Desktop Typography (1024px+)

#### Headings
```css
h1, .page-title:        48px, Sen, 600, 130% line-height
h2, .section-heading:   48px, Sen, 600, 130% line-height
h3, .subsection:        22px, Sen, 600, 1.3 line-height
```

#### Body Text
```css
.body-large:            18px, Albert Sans, 400, 1.5 line-height
.body-medium:           17px, Albert Sans, 400, 1.4 line-height
.body-default:          16px, Albert Sans, 400, 1.6-1.7 line-height
```

#### Labels & UI
```css
.label-large:           15px, Sen, 600
.label-default:         14-15px, Sen, 600
```

#### Interactive Elements
```css
.button-text:           16-17px, Sen, 600
.dropdown-text:         15px, Sen, 600
```

---

## 📏 Spacing System

### Mobile Spacing (Base)
```css
/* Section spacing */
--section-padding-y:      40px;
--section-padding-x:      16px;

/* Component spacing */
--component-gap-small:    8px;
--component-gap-medium:   12px;
--component-gap-large:    16px;
--component-gap-xlarge:   24px;

/* Internal padding */
--card-padding:           20px 16px;
--button-padding:         12px 20px;
--input-padding:          12px;
--small-button-padding:   12px 16px;

/* Margins */
--margin-small:           12px;
--margin-medium:          16px;
--margin-large:           20px;
--margin-xlarge:          32px;
```

### Tablet Spacing (750-1024px)
```css
--section-padding-y:      60px;
--section-padding-x:      24px;
--component-gap-large:    20px;
--card-padding:           22px 20px;
```

### Desktop Spacing (1024px+)
```css
--section-padding-y:      80px;
--section-padding-x:      32px;
--component-gap-large:    24px;
--card-padding:           28px 24px;
--max-content-width:      1400px;
--max-comparison-width:   1200px;
```

---

## 🎯 Component Patterns

### Primary Button (CTA)
```css
/* Mobile */
padding: 12px 20px;
font: 14px Sen, 600;
background: #ff0004;
color: #fff;
border-radius: 4px;
border: none;

/* Active state */
background: #aa0002;
transform: scale(0.98);

/* Desktop */
padding: 14-16px 24px;
font: 16-17px Sen, 600;

/* Hover (desktop only) */
background: #cc0003;
```

### Secondary Button (Shop/Collection)
Same as primary button but can be smaller context:
```css
padding: 12px 16px;
font: 14px Sen, 600;
```

### Cards
```css
/* Structure */
background: rgba(41, 42, 51, 0.5);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 8px;
overflow: hidden;

/* Hover (desktop) */
transform: translateY(-4px);
border-color: rgba(255, 255, 255, 0.2);
transition: transform 0.3s ease, border-color 0.3s ease;
```

### Dropdowns/Select Inputs
```css
/* Mobile */
padding: 12px 32px 12px 12px;
font: 13px Sen, 600;
background: rgba(41, 42, 51, 0.8);
border: 1px solid rgba(255, 255, 255, 0.2);
border-radius: 6px;
color: #fff;

/* Include dropdown arrow SVG */
background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
background-repeat: no-repeat;
background-position: right 8px center;
```

### Form Labels (Above Inputs)
```css
font: 12px Sen, 600;
color: #c9c9cc;
text-transform: uppercase;
letter-spacing: 0.5px;
margin-bottom: 6px;
```

### Section Headers
```css
/* Mobile */
font: 14px Sen, 600;
color: #fff;
text-transform: uppercase;
letter-spacing: 0.5px;
padding: 12px 16px;
background: rgba(0, 0, 0, 0.3);
border-bottom: 1px solid rgba(255, 255, 255, 0.1);

/* Desktop */
font: 16-18px Sen, 600;
padding: 16px;
```

### Star Ratings
```css
/* Filled star */
color: #ff0004;
font-size: 18px (mobile), 27px (desktop);
line-height: 1;

/* Empty star */
color: rgba(255, 255, 255, 0.2);

/* Half star (CSS overlay) */
position: relative;
color: rgba(255, 255, 255, 0.2);
&:before {
  content: '★';
  position: absolute;
  width: 50%;
  overflow: hidden;
  color: #ff0004;
}
```

### Feature Items (Spec Listings)
```css
/* Label */
font: 13px Sen, 600;
color: #c9c9cc;
margin-bottom: 4px;

/* Value */
font: 15px Albert Sans, 400;
color: #fff;
line-height: 1.4;

/* With star rating */
display: flex;
align-items: center;
gap: 3px;
margin-top: 4px;
```

### Highlight Box (Recommendations)
```css
/* Mobile */
padding: 12px 16px;
background: rgba(255, 0, 4, 0.1);
border-left: 3px solid #ff0004;
border-radius: 4px;
font: 14px Albert Sans, 400;
color: #c9c9cc;
line-height: 1.6;

/* Desktop */
padding: 16px 24px;
font-size: 16px;
```

### Content Lists
```css
ul {
  margin: 8px 0 16px 0;
  padding-left: 20px;
  list-style: none;
}

li {
  font: 14px Albert Sans, 400;
  color: #c9c9cc;
  line-height: 1.7;
  margin-bottom: 8px;
  padding-left: 12px;
  position: relative;
}

/* Red bullet */
li:before {
  content: "•";
  color: #ff0004;
  font-weight: bold;
  position: absolute;
  left: 0;
}
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First (Base) */
Default: < 750px

/* Tablet */
@media (min-width: 750px) { }

/* Desktop */
@media (min-width: 1024px) { }
```

### Responsive Patterns

#### Grid Layouts
```css
/* Mobile: */
grid-template-columns: 1fr;                    /* Single column */
gap: 12-16px;

/* Tablet: */
grid-template-columns: repeat(2, 1fr);         /* 2 columns */
gap: 20px;

/* Desktop: */
grid-template-columns: repeat(2-4, 1fr);       /* 2-4 columns depending on content */
gap: 24px;
max-width: 1200-1400px;
margin: 0 auto;
```

#### Container Padding
```css
/* Mobile: */
padding: 0 16px;

/* Tablet: */
padding: 0 24px;

/* Desktop: */
padding: 0 32px;
```

---

## 🖼️ Image Best Practices

### Responsive Images (Shopify)
```liquid
{% liquid
  assign sizes = '(min-width: 750px) 50vw, 100vw'
  assign widths = '400, 600, 800, 1000, 1200'
  assign loading = 'lazy'
  
  # Eager load above-the-fold images
  if is_first_or_default
    assign loading = 'eager'
  endif
%}

{{ image | image_url: width: 1200 | image_tag: 
  loading: loading,
  sizes: sizes,
  widths: widths,
  class: 'image-class',
  alt: alt_text
}}
```

### Image Aspect Ratios
```css
/* Square images (product photos) */
aspect-ratio: 1 / 1;
object-fit: cover;

/* Wide images (banners) */
aspect-ratio: 16 / 9;
object-fit: cover;
```

### Image Hover Effects
```css
/* Subtle zoom on hover (desktop only) */
transition: transform 0.3s ease;

&:hover {
  transform: scale(1.05);
}
```

---

## 🎭 Interactive States

### Buttons
```css
/* Default */
background: #ff0004;
transition: background-color 0.3s ease;

/* Hover (desktop) */
background: #cc0003;

/* Active/Pressed (mobile) */
background: #aa0002;
transform: scale(0.98);

/* Touch optimization */
-webkit-tap-highlight-color: transparent;
touch-action: manipulation;
```

### Cards
```css
/* Default */
border: 1px solid rgba(255, 255, 255, 0.1);
transition: transform 0.3s ease, border-color 0.3s ease;

/* Hover (desktop only) */
transform: translateY(-4px);
border-color: rgba(255, 255, 255, 0.2);
```

---

## 📐 Layout Patterns

### Two-Column Comparison
```css
.comparison-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;              /* Mobile */
  gap: 20px;              /* Tablet */
  gap: 24px;              /* Desktop */
}
```

### Vertical Alignment (Grid)
Use CSS Grid with defined rows for consistent vertical alignment across columns:
```css
.features {
  display: grid;
  grid-template-rows: repeat(8, auto);  /* 8 feature items */
  gap: 14px;
}
```

JavaScript height equalization for dynamic content:
```javascript
// Measure and equalize heights of matching items
const height1 = item1.offsetHeight;
const height2 = item2.offsetHeight;
const maxHeight = Math.max(height1, height2);
item1.style.minHeight = maxHeight + 'px';
item2.style.minHeight = maxHeight + 'px';
```

### Content Sections
```css
/* Section structure */
.section {
  padding: 40px 0;        /* Mobile */
  padding: 60px 0;        /* Tablet */
  padding: 80px 0;        /* Desktop */
}

/* Content wrapper */
.section-content {
  padding: 0 16px;        /* Mobile */
  padding: 0 24px;        /* Tablet */
  padding: 0 32px;        /* Desktop */
  max-width: 1200-1400px;
  margin: 0 auto;
}
```

---

## 🎪 Common Components

### Dropdown Selector with Label
```html
<div class="selector-wrapper">
  <div class="selector-label">COMPARE 1</div>
  <select class="selector-dropdown">
    <option>Option 1</option>
  </select>
</div>
```

```css
.selector-label {
  font: 12px Sen, 600;
  color: #c9c9cc;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.selector-dropdown {
  width: 100%;
  padding: 12px 32px 12px 12px;
  font: 13px Sen, 600;
  background: rgba(41, 42, 51, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #fff;
}
```

### Info Card with Border
```html
<div class="info-card">
  <div class="card-header">
    <div class="card-title">SUPREME SERIES</div>
  </div>
  <div class="card-content">
    <!-- Content here -->
  </div>
</div>
```

```css
.info-card {
  background: rgba(41, 42, 51, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.card-header {
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card-title {
  font: 14px Sen, 600;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-content {
  padding: 20px 16px;
}
```

### Spec/Feature Item
```html
<div class="feature-item">
  <div class="feature-label">Edge Retention</div>
  <div class="feature-value">
    <!-- Stars or text value -->
  </div>
</div>
```

```css
.feature-item {
  /* Use in Grid for alignment */
}

.feature-label {
  font: 13px Sen, 600;
  color: #c9c9cc;
  margin-bottom: 4px;
  line-height: 1.3;
}

.feature-value {
  font: 15px Albert Sans, 400;
  color: #fff;
  line-height: 1.4;
}
```

### Star Rating Display
```html
<div class="rating-stars">
  <span class="star">★</span>
  <span class="star">★</span>
  <span class="star half">★</span>
  <span class="star empty">★</span>
  <span class="star empty">★</span>
  <span class="rating-text">3.5 Stars (124 Reviews)</span>
</div>
```

---

## 🎨 Border Radius Standards

```css
--radius-small:     4px;     /* Buttons, small elements */
--radius-medium:    6px;     /* Inputs, dropdowns */
--radius-large:     8px;     /* Cards, major containers */
```

---

## 🌊 Transitions & Animations

### Standard Transitions
```css
/* Color transitions */
transition: background-color 0.3s ease;
transition: color 0.3s ease;
transition: border-color 0.3s ease;

/* Transform transitions */
transition: transform 0.3s ease;

/* Combined */
transition: transform 0.3s ease, border-color 0.3s ease;
```

### Performance Optimizations
```css
/* Touch optimization */
-webkit-tap-highlight-color: transparent;
touch-action: manipulation;
```

```javascript
// Use requestAnimationFrame for smooth updates
requestAnimationFrame(function() {
  // DOM manipulation here
});

// Debounce expensive operations
let timeout;
function debounced() {
  clearTimeout(timeout);
  timeout = setTimeout(actualFunction, 100);
}
```

---

## 📋 Content Structure Patterns

### Page Header (Centered)
```html
<div class="page-header">
  <h1>Know How Each Series Differ</h1>
  <p>Discover which Xinzuo knife fits you best by comparing performance...</p>
</div>
```

```css
.page-header {
  text-align: center;
  margin-bottom: 32px;      /* Mobile */
  margin-bottom: 48px;      /* Desktop */
  padding: 0 16px;
}
```

### Rich Text Content Sections
```html
<div class="content-section">
  <h3>Supreme Series vs Retro Series</h3>
  <p>Main description paragraph...</p>
  <p><strong>Key Differences:</strong></p>
  <ul>
    <li><strong>Feature:</strong> Explanation</li>
  </ul>
  <p><strong>→ Choose X</strong> for reason<br><strong>→ Choose Y</strong> for reason</p>
</div>
```

Use `<br>` for line breaks within paragraphs when semantic separation isn't needed.

---

## 🎯 Design Principles

### 1. Mobile-First Approach
- Start with mobile styles (base)
- Progressively enhance for tablet and desktop
- Never use `max-width` media queries
- Always use `min-width` for enhancement

### 2. Visual Hierarchy
```
Primary:    White (#fff) - Main values, headings, key info
Secondary:  Light gray (#c9c9cc) - Labels, body text, descriptions
Accent:     Red (#ff0004) - CTAs, highlights, important elements
```

### 3. Spacing Consistency
- Use multiples of 4px (4, 8, 12, 16, 20, 24, etc.)
- Consistent gaps within components
- Increase spacing proportionally on larger screens

### 4. Typography Scale
- Minimum body text: 13px (labels) to 14px (body)
- Comfortable reading: 15-16px on mobile, 16-18px on desktop
- Headings scale: 28px → 36px → 48px

### 5. Touch Targets
- Minimum button height: 44px (12px padding + 14px text + 12px padding = 38px, with padding reaches ~44px)
- Comfortable gaps between tappable elements
- Active states for touch feedback

---

## 🔧 Technical Implementation

### Scoped CSS
Always scope section styles to prevent global pollution:
```liquid
.section-name-{{ section.id }} .element { }
```

### Liquid Variables
Use consistent naming:
```liquid
{% assign value_floor = value | floor %}
{% assign value_ceil = value | ceil %}
{% assign has_half = value | modulo: 1 %}
```

### JavaScript Patterns
```javascript
// Self-executing function for scope isolation
(function() {
  // Check DOM ready state
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  function init() {
    // Implementation
  }
})();
```

---

## 📦 Reusable Code Snippets

### Responsive Image (Shopify)
```liquid
{% liquid
  assign sizes = '(min-width: 750px) 50vw, 100vw'
  assign widths = '400, 600, 800, 1000, 1200'
  assign loading = 'lazy'
%}

{{ image | image_url: width: 1200 | image_tag: 
  loading: loading,
  sizes: sizes,
  widths: widths,
  class: 'responsive-image',
  alt: alt_text
}}
```

### Star Rating Loop (with half-stars)
```liquid
{% assign rating_floor = rating | floor %}
{% assign rating_ceil = rating | ceil %}
{% assign has_half = rating | modulo: 1 %}
{% for i in (1..5) %}
  {% if i <= rating_floor %}
    <span class="star">★</span>
  {% elsif i == rating_ceil and has_half >= 0.5 %}
    <span class="star half">★</span>
  {% else %}
    <span class="star empty">★</span>
  {% endif %}
{% endfor %}
```

### HRC Format with Plus/Minus
```
Format: "57 +/- 1 HRC" (not "56-58 HRC")
Use middle value with tolerance range
```

---

## 🎯 When to Use What

### Font Choice
- **Sen**: UI elements, labels, headings, buttons, anything that needs emphasis
- **Albert Sans**: Body text, descriptions, explanations, paragraphs

### Color Choice
- **White (#fff)**: Primary content, values, data that user needs to read
- **Gray (#c9c9cc)**: Labels, supporting text, descriptions
- **Red (#ff0004)**: CTAs, important actions, ratings, highlights

### Button Styling
- **Primary (Red)**: Main actions (Shop Now, Buy, Add to Cart)
- **Size**: Proportional to importance and screen size
- **Always full-width on mobile** for easy tapping

### Card Usage
- **Transparent borders** on dark backgrounds
- **Subtle hover effects** on desktop only
- **No hover on mobile** - use active states instead

---

## 📝 Quick Reference

### Most Common Values

| Property | Mobile | Tablet | Desktop |
|----------|--------|--------|---------|
| **Section Padding Y** | 40px | 60px | 80px |
| **Section Padding X** | 16px | 24px | 32px |
| **H1/H2 Size** | 28px | 36px | 48px |
| **Body Text** | 14-16px | 15-17px | 16-18px |
| **Button Padding** | 12px 20px | 13px 18px | 14-16px 24px |
| **Card Border Radius** | 8px | 8px | 8px |
| **Input Border Radius** | 6px | 6px | 6px |
| **Component Gap** | 12-16px | 20px | 24px |
| **Star Size** | 18px | 18px | 27px |

---

## 🚀 Performance Guidelines

1. **Always use lazy loading** except for above-the-fold images
2. **Use responsive srcset** for all images
3. **Debounce expensive operations** (layout calculations, resize handlers)
4. **Use requestAnimationFrame** for DOM manipulations
5. **Scope all CSS** to section IDs
6. **Minimize JavaScript** - keep under 200 lines per section

---

## 💡 Usage Instructions

When creating new pages:

1. **Start with mobile** - Define base styles first
2. **Use the color palette** - Stick to #fff, #c9c9cc, #ff0004
3. **Use correct fonts** - Sen for UI, Albert Sans for content
4. **Follow spacing system** - Use 4px multiples
5. **Add progressive enhancement** - Tablet at 750px, Desktop at 1024px
6. **Test on mobile first** - 95% of traffic is mobile
7. **Scope everything** - Use section IDs to prevent conflicts

---

## 📋 Component Checklist

When building a new component:

- [ ] Mobile-first styles defined
- [ ] Tablet enhancement added (750px+)
- [ ] Desktop enhancement added (1024px+)
- [ ] Touch targets are 44px+ height
- [ ] Colors match palette (white, gray, red)
- [ ] Fonts correct (Sen for UI, Albert Sans for content)
- [ ] Borders use rgba(255, 255, 255, 0.1-0.2)
- [ ] Border radius matches standard (4px, 6px, or 8px)
- [ ] Transitions added (0.3s ease)
- [ ] Hover states on desktop only
- [ ] Active states for mobile touch
- [ ] Images use responsive srcset
- [ ] Images lazy loaded (except first)
- [ ] JavaScript scoped and debounced
- [ ] No global CSS pollution
- [ ] Spacing uses 4px increments

---

## 🎨 Reference Files

- **Primary Reference**: `sections/series-comparison.liquid`
- **Template Example**: `templates/page.series-comparison.json`
- **Color Scheme**: scheme-5 (dark theme)

---

## 📞 Quick Copy-Paste

### Card Structure
```css
background: rgba(41, 42, 51, 0.5);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 8px;
overflow: hidden;
```

### Button
```css
padding: 12px 20px;
background-color: #ff0004;
border: none;
border-radius: 4px;
font-family: "Sen";
font-weight: 600;
font-size: 14px;
color: #fff;
transition: background-color 0.3s ease;
```

### Heading
```css
font-family: "Sen";
font-weight: 600;
font-size: 28px;
color: #fff;
line-height: 130%;
```

### Body Text
```css
font-family: "Albert Sans";
font-weight: 400;
font-size: 14px;
color: #c9c9cc;
line-height: 1.6;
```

---

**This design system ensures consistency across all Xinzuo pages while maintaining the dark, premium aesthetic and mobile-first approach.**

