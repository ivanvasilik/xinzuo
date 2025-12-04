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

  // DOM Elements (cached after init)
  let dialog = null;
  let modal = null;
  let productNameEl = null;
  let textInput1 = null;
  let textInput2 = null;
  let counter1 = null;
  let counter2 = null;
  let inputGroup2 = null;
  let oneLineRadio = null;
  let twoLinesRadio = null;
  let confirmBtn = null;
  let cancelBtn = null;
  let closeBtn = null;

  /**
   * Initialize the engraving module
   */
  function init() {
    // Cache DOM elements
    dialog = document.getElementById('engraving-modal-dialog');
    modal = document.getElementById('engraving-modal');
    productNameEl = document.getElementById('engraving-modal-product');
    textInput1 = document.getElementById('engraving-text-1');
    textInput2 = document.getElementById('engraving-text-2');
    counter1 = document.getElementById('engraving-counter-1');
    counter2 = document.getElementById('engraving-counter-2');
    inputGroup2 = document.getElementById('engraving-input-group-2');
    oneLineRadio = document.getElementById('engraving-one-line');
    twoLinesRadio = document.getElementById('engraving-two-lines');
    confirmBtn = document.getElementById('engraving-modal-confirm');
    cancelBtn = document.getElementById('engraving-modal-cancel');
    closeBtn = document.getElementById('engraving-modal-close');

    if (!dialog || !modal) {
      console.warn('Engraving modal elements not found');
      return;
    }

    // Set up event listeners
    setupEventListeners();
  }

  /**
   * Set up all event listeners
   */
  function setupEventListeners() {
    // Close buttons
    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);
    
    // Close on backdrop click
    dialog?.addEventListener('click', (e) => {
      if (e.target === dialog) {
        closeModal();
      }
    });

    // Handle dialog close event (Escape key is handled automatically by native dialog)
    dialog?.addEventListener('close', () => {
      currentItemData = null;
      setLoading(false);
    });

    // Radio button changes
    oneLineRadio?.addEventListener('change', handleLineSelection);
    twoLinesRadio?.addEventListener('change', handleLineSelection);

    // Text input changes
    textInput1?.addEventListener('input', () => {
      updateCounter(textInput1, counter1);
      validateForm();
    });

    textInput2?.addEventListener('input', () => {
      updateCounter(textInput2, counter2);
      validateForm();
    });

    // Confirm button
    confirmBtn?.addEventListener('click', handleConfirm);

    // Listen for "Add Engraving" button clicks (delegated)
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.cart-add-engraving-btn');
      if (btn) {
        e.preventDefault();
        const itemKey = btn.dataset.itemKey;
        const variantId = btn.dataset.variantId;
        const quantity = parseInt(btn.dataset.quantity, 10) || 1;
        const productTitle = btn.dataset.productTitle;
        
        openModal({
          itemKey,
          variantId,
          quantity,
          productTitle
        });
      }
    });
  }

  /**
   * Handle line selection change
   */
  function handleLineSelection() {
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
    const length = input.value.length;
    counter.textContent = `${length}/${MAX_LENGTH}`;
  }

  /**
   * Validate form and update confirm button state
   */
  function validateForm() {
    if (!confirmBtn || !textInput1) return;
    
    const text1 = textInput1.value.trim();
    const text2 = textInput2?.value.trim() || '';
    const isTwoLines = twoLinesRadio?.checked;
    
    // Must have text in line 1
    // If two lines selected, must have text in line 2 as well
    const isValid = text1.length > 0 && (!isTwoLines || text2.length > 0);
    
    confirmBtn.disabled = !isValid;
  }

  /**
   * Open the engraving modal
   * @param {Object} itemData - Data about the cart item
   */
  function openModal(itemData) {
    if (!dialog || !modal) return;
    
    currentItemData = itemData;
    
    // Set product name
    if (productNameEl) {
      productNameEl.textContent = itemData.productTitle || 'Your Knife';
    }
    
    // Reset form
    resetForm();
    
    // Show modal using native dialog API
    dialog.showModal();
    
    // Focus first input
    setTimeout(() => textInput1?.focus(), 100);
  }

  /**
   * Close the engraving modal
   */
  function closeModal() {
    if (!dialog) return;
    
    dialog.close();
    currentItemData = null;
    
    // Reset loading state
    setLoading(false);
  }

  /**
   * Reset form to initial state
   */
  function resetForm() {
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
   * Set loading state on confirm button
   */
  function setLoading(isLoading) {
    if (!confirmBtn) return;
    
    if (isLoading) {
      confirmBtn.classList.add('is-loading');
      confirmBtn.disabled = true;
    } else {
      confirmBtn.classList.remove('is-loading');
      validateForm(); // Re-enable if form is valid
    }
  }

  /**
   * Handle confirm button click
   */
  async function handleConfirm() {
    if (!currentItemData) return;
    
    const text1 = textInput1?.value.trim() || '';
    const text2 = twoLinesRadio?.checked ? (textInput2?.value.trim() || '') : '';
    const isTwoLines = twoLinesRadio?.checked && text2.length > 0;
    
    if (!text1) return;
    
    setLoading(true);
    
    try {
      // Step 1: Remove the original item from cart
      await removeCartItem(currentItemData.itemKey);
      
      // Step 2: Add the item back with engraving properties
      const properties = {
        'Engraving Text': text1,
        'Knife Quantity': 1
      };
      
      if (isTwoLines) {
        properties['Engraving Text2'] = text2;
      }
      
      await addToCart(currentItemData.variantId, currentItemData.quantity, properties);
      
      // Step 3: Add the engraving fee product
      const feeVariantId = isTwoLines ? FEE_TWO_LINES : FEE_ONE_LINE;
      const feeQuantity = currentItemData.quantity; // 1 fee per knife
      
      await addToCart(feeVariantId, feeQuantity, {});
      
      // Step 4: Refresh the cart drawer
      await refreshCartDrawer();
      
      // Close modal
      closeModal();
      
    } catch (error) {
      console.error('Error adding engraving:', error);
      setLoading(false);
      alert('Sorry, there was an error adding engraving. Please try again.');
    }
  }

  /**
   * Remove an item from the cart
   * @param {string} itemKey - The cart item key
   */
  async function removeCartItem(itemKey) {
    const response = await fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: itemKey,
        quantity: 0
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to remove item from cart');
    }
    
    return response.json();
  }

  /**
   * Add an item to the cart
   * @param {string} variantId - The variant ID
   * @param {number} quantity - The quantity
   * @param {Object} properties - Line item properties
   */
  async function addToCart(variantId, quantity, properties) {
    const body = {
      id: variantId,
      quantity: quantity
    };
    
    if (properties && Object.keys(properties).length > 0) {
      body.properties = properties;
    }
    
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      throw new Error('Failed to add item to cart');
    }
    
    return response.json();
  }

  /**
   * Refresh the cart drawer with updated data
   */
  async function refreshCartDrawer() {
    try {
      // Fetch updated cart sections
      const response = await fetch('/?sections=cart-drawer,cart-icon-bubble');
      const sections = await response.json();
      
      // Dispatch cart:update event to refresh the drawer
      document.dispatchEvent(
        new CustomEvent('cart:update', {
          detail: {
            data: { sections }
          }
        })
      );
      
      // Also fetch cart count for the bubble
      const cartResponse = await fetch('/cart.js');
      const cartData = await cartResponse.json();
      
      // Dispatch another event with item count
      document.dispatchEvent(
        new CustomEvent('cart:update', {
          detail: {
            data: {
              itemCount: cartData.item_count,
              sections
            }
          }
        })
      );
    } catch (error) {
      console.error('Error refreshing cart:', error);
      // Fallback: reload the page
      window.location.reload();
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-initialize after cart updates (in case modal HTML was replaced)
  document.addEventListener('cart:update', () => {
    // Small delay to ensure DOM is updated
    setTimeout(init, 100);
  });

  // Expose openModal for external use if needed
  window.CartEngraving = {
    open: openModal,
    close: closeModal
  };
})();

