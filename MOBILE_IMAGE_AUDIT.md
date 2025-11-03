# Mobile Image & Video Margin Audit

## ISSUE
Images and videos across product-info sections don't have proper horizontal margins on mobile (< 750px), causing them to stretch edge-to-edge.

---

## SECTIONS TO AUDIT

### 1. product-info.liquid
**Current mobile CSS (line 203-205):**
```css
.section-{{ section.id }} .product-info > img {
    padding: 24px 16px;  ✅ FIXED
}
```
**Status:** ✅ FIXED

---

### 2. product-info2.liquid
**Images:**
- Line 64-67: `.product-info2 img { width: 100%; height: auto; }` - No mobile override
- Line 349-351: Added `.product-info2 > img { padding: 24px 16px; }` ✅
- Line 396-399: Added `.product-info2 img { padding: 0 16px; }` ✅

**Videos:**
- Line 441: `{{ section.settings.video | video_tag: ... }}` - Rendered directly
- **NO mobile styling for video elements** ❌

**Status:** ⚠️ IMAGES FIXED, VIDEOS NOT FIXED

---

### 3. product-info3.liquid
**Images:**
- Line 30-34: `.product-info3-left img { width: 100%; height: 100%; object-fit: cover; }`
- **NO mobile margin override** ❌

**Status:** ❌ NOT FIXED

---

### 4. product-info4.liquid
**Need to check**

---

### 5. product-info5.liquid
**Need to check**

---

### 6. product-info6.liquid
**Images:**
- Line 155-160: Images rendered in left/right divs
- **Need to check mobile CSS**

---

### 7. product-info7.liquid
**Need to check**

---

## ROOT CAUSE

The problem is that I added padding to specific selectors, but:
1. **Videos** are rendered as raw `<video>` tags without wrapper classes
2. **Some images** are rendered differently (child vs direct)
3. **Mobile CSS** needs to be more comprehensive

---

## COMPREHENSIVE FIX NEEDED

For EACH product-info section, add at mobile breakpoint:

```css
@media screen and (max-width: 750px) {
    /* All direct images */
    .section-{{ section.id }} > img,
    .section-{{ section.id }} img {
        padding-left: 16px;
        padding-right: 16px;
    }
    
    /* All videos */
    .section-{{ section.id }} video {
        padding-left: 16px;
        padding-right: 16px;
    }
}
```

---

**STATUS: AUDIT IN PROGRESS - NEED TO CHECK ALL 7 SECTIONS**

