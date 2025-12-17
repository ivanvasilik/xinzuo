/**
 * Cart Engraving Module
 * Handles adding custom laser engraving to knives from the cart drawer
 */

(function() {
  'use strict';

  // Constants
  const FEE_ONE_LINE = 43781283217459;
  const FEE_TWO_LINES = 43781283250227;
  const MAX_LENGTH = 20;

  // State
  let currentItemData = null;

  /**
   * Get DOM elements (fresh lookup each time to handle DOM updates)
   */
  function getElements() {
    return {
      dialog: document.getElementById('engraving-modal-dialog'),
      productNameEl: document.getElementById('engraving-modal-product'),
      textInput1: document.getElementById('engraving-text-1'),
      textInput2: document.getElementById('engraving-text-2'),
      counter1: document.getElementById('engraving-counter-1'),
      counter2: document.getElementById('engraving-counter-2'),
      inputGroup2: document.getElementById('engraving-input-group-2'),
      oneLineRadio: document.getElementById('engraving-one-line'),
      twoLinesRadio: document.getElementById('engraving-two-lines'),
      confirmBtn: document.getElementById('engraving-modal-confirm')
    };
  }

  /**
   * Handle line selection change
   */
  function handleLineSelection() {
    const { inputGroup2, textInput2, twoLinesRadio, counter2 } = getElements();
    
    if (twoLinesRadio?.checked) {
      inputGroup2?.classList.remove('engraving-modal__input-group--hidden');
      textInput2?.focus();
    } else {
      inputGroup2?.classList.add('engraving-modal__input-group--hidden');
      if (textInput2) textInput2.value = '';
      updateCounter(textInput2, counter2);
    }
    validateForm();
  }

  /**
   * Update character counter
   */
  function updateCounter(input, counter) {
    if (!input || !counter) return;
    counter.textContent = `${input.value.length}/${MAX_LENGTH}`;
  }

  /**
   * Validate form and update confirm button state
   */
  function validateForm() {
    const { confirmBtn, textInput1, textInput2, twoLinesRadio } = getElements();
    if (!confirmBtn || !textInput1) return;
    
    const text1 = textInput1.value.trim();
    const text2 = textInput2?.value.trim() || '';
    const isTwoLines = twoLinesRadio?.checked;
    
    const isValid = text1.length > 0 && (!isTwoLines || text2.length > 0);
    confirmBtn.disabled = !isValid;
  }

  /**
   * Open the engraving modal
   */
  function openModal(itemData) {
    const { dialog, productNameEl, textInput1 } = getElements();
    if (!dialog) return;
    
    currentItemData = itemData;
    
    if (productNameEl) {
      productNameEl.textContent = itemData.productTitle || 'Your Knife';
    }
    
    resetForm();
    dialog.showModal();
    setTimeout(() => textInput1?.focus(), 100);
  }

  /**
   * Close the engraving modal
   */
  function closeModal() {
    const { dialog, confirmBtn } = getElements();
    if (!dialog) return;
    
    dialog.close();
    currentItemData = null;
    
    if (confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.classList.remove('is-loading');
    }
  }

  /**
   * Reset form to initial state
   */
  function resetForm() {
    const { textInput1, textInput2, oneLineRadio, twoLinesRadio, inputGroup2, counter1, counter2 } = getElements();
    
    if (textInput1) textInput1.value = '';
    if (textInput2) textInput2.value = '';
    if (oneLineRadio) oneLineRadio.checked = true;
    if (twoLinesRadio) twoLinesRadio.checked = false;
    inputGroup2?.classList.add('engraving-modal__input-group--hidden');
    
    updateCounter(textInput1, counter1);
    updateCounter(textInput2, counter2);
    validateForm();
  }

  /**
   * Handle confirm button click
   */
  async function handleConfirm() {
    if (!currentItemData) return;
    
    const { textInput1, textInput2, twoLinesRadio, confirmBtn } = getElements();
    
    const text1 = textInput1?.value.trim() || '';
    const text2 = twoLinesRadio?.checked ? (textInput2?.value.trim() || '') : '';
    const isTwoLines = twoLinesRadio?.checked && text2.length > 0;
    
    if (!text1) return;
    
    // Disable button to prevent double clicks
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.classList.add('is-loading');
    }
    
    // Store data locally before any async operations
    const { itemKey, variantId, quantity } = currentItemData;
    
    try {
      // Step 1: Remove the original item
      await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemKey, quantity: 0 })
      });
      
      // Step 2: Add item with engraving properties
      const properties = {
        'Engraving Text': text1,
        'Knife Quantity': 1
      };
      if (isTwoLines) {
        properties['Engraving Text2'] = text2;
      }
      
      await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: variantId, quantity, properties })
      });
      
      // Step 3: Add engraving fee
      const feeVariantId = isTwoLines ? FEE_TWO_LINES : FEE_ONE_LINE;
      await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: feeVariantId, quantity })
      });
      
      // Close and refresh
      closeModal();
      refreshCart();
      
    } catch (error) {
      console.error('Error adding engraving:', error);
      if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.classList.remove('is-loading');
      }
      alert('Sorry, there was an error adding engraving. Please try again.');
    }
  }

  /**
   * Refresh the cart UI
   */
  async function refreshCart() {
    try {
      const [sectionsRes, cartRes] = await Promise.all([
        fetch('/?sections=cart-drawer,cart-icon-bubble'),
        fetch('/cart.js')
      ]);
      
      const sections = await sectionsRes.json();
      const cartData = await cartRes.json();
      
      document.dispatchEvent(new CustomEvent('cart:update', {
        detail: { data: { itemCount: cartData.item_count, sections } }
      }));
    } catch (error) {
      window.location.reload();
    }
  }

  /**
   * Clean up orphaned engraving fees (runs on page load only)
   * Real-time updates are handled by component-cart-items.js
   */
  async function cleanupOrphanedFees() {
    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();
      
      // Count required fees based on knives with engraving
      let requiredOneLine = 0;
      let requiredTwoLine = 0;
      
      cart.items.forEach(item => {
        if (item.properties?.['Engraving Text']) {
          const qty = item.quantity * (parseInt(item.properties['Knife Quantity'], 10) || 1);
          if (item.properties['Engraving Text2']) {
            requiredTwoLine += qty;
          } else {
            requiredOneLine += qty;
          }
        }
      });
      
      // Find current fees
      const feeOne = cart.items.find(i => i.variant_id === FEE_ONE_LINE);
      const feeTwo = cart.items.find(i => i.variant_id === FEE_TWO_LINES);
      
      const currentOne = feeOne?.quantity || 0;
      const currentTwo = feeTwo?.quantity || 0;
      
      // Update if there are extras
      const updates = {};
      if (currentOne > requiredOneLine) updates[FEE_ONE_LINE] = requiredOneLine;
      if (currentTwo > requiredTwoLine) updates[FEE_TWO_LINES] = requiredTwoLine;
      
      if (Object.keys(updates).length > 0) {
        await fetch('/cart/update.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ updates })
        });
        // Don't call refreshCart() - let page reload naturally or user interaction trigger refresh
        // This prevents cascading cart:update events
      }
    } catch (error) {
      console.error('Error cleaning up fees:', error);
    }
  }

  /**
   * Set up event listeners using delegation
   */
  function setupEventListeners() {
    // Single delegated click handler
    document.addEventListener('click', (e) => {
      const target = e.target;
      
      // Confirm button
      if (target.closest('#engraving-modal-confirm')) {
        e.preventDefault();
        handleConfirm();
        return;
      }
      
      // Close/cancel buttons
      if (target.closest('#engraving-modal-close') || target.closest('#engraving-modal-cancel')) {
        closeModal();
        return;
      }
      
      // Backdrop click
      if (target.id === 'engraving-modal-dialog') {
        closeModal();
        return;
      }
      
      // Add Engraving button
      const addBtn = target.closest('.cart-add-engraving-btn');
      if (addBtn) {
        e.preventDefault();
        openModal({
          itemKey: addBtn.dataset.itemKey,
          variantId: addBtn.dataset.variantId,
          quantity: parseInt(addBtn.dataset.quantity, 10) || 1,
          productTitle: addBtn.dataset.productTitle
        });
      }
    });

    // Radio changes
    document.addEventListener('change', (e) => {
      if (e.target.name === 'engraving-lines') {
        handleLineSelection();
      }
    });

    // Text input changes
    document.addEventListener('input', (e) => {
      const { counter1, counter2, textInput1, textInput2 } = getElements();
      if (e.target.id === 'engraving-text-1') {
        updateCounter(textInput1, counter1);
        validateForm();
      } else if (e.target.id === 'engraving-text-2') {
        updateCounter(textInput2, counter2);
        validateForm();
      }
    });

  }

  // Initialize
  setupEventListeners();
  
  // Run cleanup only on initial page load (safety net)
  // Real-time fee updates are handled by component-cart-items.js
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cleanupOrphanedFees);
  } else {
    cleanupOrphanedFees();
  }

  // Expose for external use
  window.CartEngraving = { open: openModal, close: closeModal, cleanup: cleanupOrphanedFees };
})();
