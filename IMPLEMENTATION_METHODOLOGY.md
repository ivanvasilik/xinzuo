# Copy Implementation Methodology

## PURPOSE
Systematic, micro-step approach to implementing refined copy across all knife series pages with quality controls at every stage.

---

## PHASE 1: PRE-IMPLEMENTATION VALIDATION

### Step 1.1: Legal & Claims Verification
**Objective:** Ensure all claims are legally defensible

**Process:**
1. Review all comparative claims (e.g., "VG10-equivalent")
2. Verify technical specifications against manufacturer data
3. Check for unsubstantiated superlatives
4. Ensure no false advertising

**Legal Assessment - Key Claims:**

| Claim | Series | Legal Status | Rationale |
|-------|--------|--------------|-----------|
| "VG10-equivalent" | Retro, Mo | ✅ SAFE | 10Cr15CoMoV has similar composition to VG10. Industry standard comparison. Not claiming it IS VG10. |
| "German 1.4116 steel" | Supreme | ✅ SAFE | Factual material designation. Verified standard. |
| "Powder steel" | Lan | ✅ SAFE | 14Cr14MoVNb is powder metallurgy steel. Factual. |
| "Months of sharpness" | Retro, Mo, Lan | ✅ SAFE | Reasonable expectation for HRC 58-64 steel with normal use. |
| "Weeks of sharpness" | Supreme | ✅ SAFE | Reasonable for HRC 56-58 steel. Conservative claim. |
| "Easy to sharpen" | Supreme | ✅ SAFE | Lower hardness (56-58 HRC) objectively easier to sharpen. |
| "Extreme edge retention" | Lan | ✅ SAFE | 62-64 HRC with powder steel objectively retains edge longer. |
| "Professional-grade" | Retro, Mo, Lan | ✅ SAFE | These specs meet professional kitchen standards. |
| Specific HRC numbers | All | ✅ SAFE | Match manufacturer specs provided. |
| "Damascus layers" counts | Mo, Lan | ✅ SAFE | Match product specifications (67, 73 layers). |

**Red Flags Removed:**
- ❌ "2× sharper" - No scientific basis
- ❌ "3× tougher" - Unverifiable claim
- ❌ "Revolutionary" - Marketing fluff
- ❌ "Best in market" - Unsubstantiated superlative

---

### Step 1.2: Technical Accuracy Verification
**Objective:** Confirm all specs match actual products

**Checklist per Series:**

**Supreme Series (HEZHEN X02):**
- [x] Steel: German Krupp 1.4116 (X50CrMoV15) ✓
- [x] Hardness: 56-58 HRC ✓
- [x] Thickness: 2.2mm ✓
- [x] Handle: Red wood + stainless rivets ✓
- [x] Construction: Single-layer (NOT Damascus) ✓

**Retro Series (HEZHEN PM8S):**
- [x] Steel: 10Cr15CoMoV (VG10-equivalent) ✓
- [x] Hardness: 58-62 HRC ✓
- [x] Thickness: 2.4mm ✓
- [x] Construction: 3-layer composite ✓
- [x] Handle: Octagonal redwood + buffalo horn ✓
- [x] Edge: 15° ✓

**Mo Series (XINZUO MO):**
- [x] Steel: 10Cr15CoMoV core (VG10-equivalent) ✓
- [x] Damascus: 67 layers total (1 core + 66 cladding) ✓
- [x] Hardness: 60-62 HRC ✓
- [x] Thickness: 2.3mm ✓
- [x] Handle: Burnt white oak + red G10 ✓
- [x] Cladding: 316L stainless ✓

**Lan Series (XINZUO B37):**
- [x] Steel: 14Cr14MoVNb powder steel ✓
- [x] Damascus: 73 layers total ✓
- [x] Hardness: 62-64 HRC ✓
- [x] Thickness: 2.1mm ✓
- [x] Handle: Olive wood + copper rivets ✓
- [x] Process: Powder metallurgy ✓

---

### Step 1.3: Template Structure Analysis
**Objective:** Map exact location and format of each copywriting element

**Template Mapping per Series:**

```
SECTION 1: Steel Composition (product_info_mmnV94)
├── settings.content (Main paragraph - HTML <p> tag)
├── Icon Block 1: settings.content (HTML <p> tag)
├── Icon Block 2: settings.content (HTML <p> tag)
├── Icon Block 3: settings.content (HTML <p> tag)
├── Icon Block 4: settings.content (HTML <p> tag - if exists)
├── Stat Block 1:
│   ├── settings.header (Plain text)
│   ├── settings.content (Plain text)
│   └── settings.footer (Plain text)
├── Stat Block 2: (same structure)
└── Stat Block 3: (same structure)

SECTION 2: Layer Construction (product_info2_7JTdmJ)
├── settings.heading_title (Plain text, uppercase)
├── settings.heading_content (HTML <h2> tag)
├── settings.heading_footer (Plain text)
├── Block 1: settings.content (HTML <p> tag)
└── Block 2: settings.content (HTML <p> tag)

SECTION 3: Manufacturing Process (product_info2_pVhzYj)
├── settings.heading_title (Plain text, uppercase)
├── settings.heading_content (HTML <h2> tag)
├── settings.heading_footer (Plain text)
├── Icon Block 1: settings.content (HTML <p> tag with <strong> tags)
├── Icon Block 2: settings.content (HTML <p> tag with <strong> tags)
└── Icon Block 3: settings.content (HTML <p> tag with <strong> tags)

SECTION 4: Hardness & Edge Specs (product_info3_Gx89LP)
├── settings.heading (Plain text)
├── settings.img_text (Plain text)
├── Spec Block 1:
│   ├── settings.info_header1 (Plain text)
│   ├── settings.info_content1 (Plain text)
│   └── settings.info_footer1 (Plain text)
└── Spec Block 2:
    ├── settings.info_header2 (Plain text)
    ├── settings.info_content2 (Plain text)
    └── settings.info_footer2 (Plain text)

SECTION 5: Handle Design (product_info2_eVwTgB)
├── settings.heading_title (Plain text)
├── settings.heading_content (HTML <h2> tag)
├── settings.footer_left (HTML <p> tag)
└── settings.footer_right (HTML with <h2> and <p> tags)

SECTION 6: Craftsmanship Story (product_info2_GjRq8Y)
├── settings.heading_content (Multiple HTML <h2> tags)
├── settings.footer_left (HTML <p> tag)
├── settings.footer_right (HTML <p> tag)
├── settings.additional_content1 (HTML <p> tag with <strong>)
└── settings.additional_content2 (HTML <p> tag with <strong>)

SECTION 7: Excellence Summary (product_info5_whc3ta)
├── settings.heading (Plain text)
├── Block.settings.title (Plain text)
├── Block.settings.content1 (HTML <p> tag with <strong>)
├── Block.settings.content2 (HTML <p> tag with <strong>)
└── Block.settings.content3 (HTML <p> tag with <strong>)

SECTION 8: Product Description (product_description_t4ATaB)
├── settings.heading (HTML <h2> tag with <br/>)
├── settings.info1 (HTML <p> tag)
└── settings.info2 (HTML <p> tag)
```

---

## PHASE 2: IMPLEMENTATION MICRO-STEPS

### Micro-Step Process (Per Copy Element)

**For EACH copy element, follow this exact sequence:**

1. **READ** current copy from template
2. **VERIFY** new copy from reference document
3. **FORMAT** new copy with correct HTML tags
4. **VALIDATE** character count (ensure it fits visually)
5. **IMPLEMENT** change in template file
6. **VERIFY** change was applied correctly
7. **MARK** as complete in todo list

---

## PHASE 3: QUALITY CONTROL GATES

### QC Gate 1: After Each Section
- [ ] All copy elements updated
- [ ] No JSON syntax errors
- [ ] HTML tags properly formatted
- [ ] Character counts reasonable

### QC Gate 2: After Each Series
- [ ] All 8 sections complete for that series
- [ ] Voice/tone consistent with tier
- [ ] Differentiation clear vs other series
- [ ] No duplicate copy between sections

### QC Gate 3: Before Push to Shopify
- [ ] All 4 series complete
- [ ] File syntax validates
- [ ] No linter errors
- [ ] Ready for deployment

---

## PHASE 4: DEPLOYMENT PROTOCOL

### Deployment Steps:
1. Push ONE series at a time
2. Verify on dev theme after each push
3. Check mobile and desktop rendering
4. Confirm no broken layouts
5. Move to next series

---

## SERIES IMPLEMENTATION ORDER

**Rationale for Order:**
1. **Retro** (Mid-tier) - Most complete, good baseline
2. **Mo** (Premium) - Similar to Retro, validate Damascus copy
3. **Lan** (Flagship) - Most complex, powder steel unique
4. **Supreme** (Entry) - Simplest, fewer sections

---

## ERROR HANDLING

### If Error Encountered:
1. **STOP** implementation
2. **DOCUMENT** the error
3. **ROLLBACK** if necessary
4. **FIX** before continuing
5. **RE-VERIFY** section
6. **RESUME** from checkpoint

---

## SUCCESS CRITERIA

### Copy Quality:
- ✅ Concise (30-50% shorter than original)
- ✅ Benefit-focused (answers "so what?")
- ✅ Technically accurate
- ✅ Legally defensible
- ✅ Conversion-optimized
- ✅ DTC brand voice

### Technical Quality:
- ✅ Valid JSON syntax
- ✅ Proper HTML formatting
- ✅ No linter errors
- ✅ Renders correctly on frontend

---

**STATUS: METHODOLOGY COMPLETE - READY TO CREATE DETAILED TODO LIST**

