/**
 * Cart Engraving Module
 * Handles adding custom laser engraving to knives from the cart drawer
 */

(function() {
  'use strict';

  // Prevent multiple script initializations (in case script is loaded twice)
  if (window.__cartEngravingInitialized) {
    return;
  }
  window.__cartEngravingInitialized = true;

  // Constants
  const FEE_ONE_LINE = 43781283217459;
  const FEE_TWO_LINES = 43781283250227;
  const MAX_LENGTH = 20;

  // State
  let currentItemData = null;
  let isProcessing = false; // Prevent double submissions
  let cleanupInProgress = false; // Prevent concurrent cleanups

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

    if (!dialog || !modal) {
      return;
    }
  }

  /**
   * Set up all event listeners (only called once)
   */
  function setupEventListeners() {
    // Use event delegation for all clicks to avoid duplicate handlers
    document.addEventListener('click', handleAllClicks);

    // Handle dialog close event (Escape key is handled automatically by native dialog)
    document.addEventListener('close', (e) => {
      if (e.target && e.target.id === 'engraving-modal-dialog') {
        currentItemData = null;
        isProcessing = false;
        setLoading(false);
      }
    }, true);

    // Radio button changes - use delegation
    document.addEventListener('change', (e) => {
      if (e.target.id === 'engraving-one-line' || e.target.id === 'engraving-two-lines') {
        handleLineSelection();
      }
    });

    // Text input changes - use delegation
    document.addEventListener('input', (e) => {
      if (e.target.id === 'engraving-text-1') {
        updateCounter(textInput1, counter1);
        validateForm();
      } else if (e.target.id === 'engraving-text-2') {
        updateCounter(textInput2, counter2);
        validateForm();
      }
    });
  }

  /**
   * Handle all click events via delegation
   */
  function handleAllClicks(e) {
    const target = e.target;
    
    // Handle confirm button click
    if (target.closest('#engraving-modal-confirm')) {
      e.preventDefault();
      e.stopPropagation();
      handleConfirm();
      return;
    }
    
    // Handle close/cancel button clicks
    if (target.closest('#engraving-modal-close') || target.closest('#engraving-modal-cancel')) {
      e.preventDefault();
      closeModal();
      return;
    }
    
    // Handle backdrop click (clicking on dialog itself, not its contents)
    if (target.id === 'engraving-modal-dialog') {
      closeModal();
      return;
    }
    
    // Handle "Add Engraving" button click
    const addEngravingBtn = target.closest('.cart-add-engraving-btn');
    if (addEngravingBtn) {
      e.preventDefault();
      const itemKey = addEngravingBtn.dataset.itemKey;
      const variantId = addEngravingBtn.dataset.variantId;
      const quantity = parseInt(addEngravingBtn.dataset.quantity, 10) || 1;
      const productTitle = addEngravingBtn.dataset.productTitle;
      
      openModal({
        itemKey,
        variantId,
        quantity,
        productTitle
      });
    }
  }

  /**
   * Handle line selection change
   */
  function handleLineSelection() {
    // Re-cache elements in case they changed
    inputGroup2 = document.getElementById('engraving-input-group-2');
    textInput2 = document.getElementById('engraving-text-2');
    twoLinesRadio = document.getElementById('engraving-two-lines');
    counter2 = document.getElementById('engraving-counter-2');
    
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
    // Re-cache elements
    confirmBtn = document.getElementById('engraving-modal-confirm');
    textInput1 = document.getElementById('engraving-text-1');
    textInput2 = document.getElementById('engraving-text-2');
    twoLinesRadio = document.getElementById('engraving-two-lines');
    
    if (!confirmBtn || !textInput1) return;
    
    const text1 = textInput1.value.trim();
    const text2 = textInput2?.value.trim() || '';
    const isTwoLines = twoLinesRadio?.checked;
    
    // Must have text in line 1
    // If two lines selected, must have text in line 2 as well
    const isValid = text1.length > 0 && (!isTwoLines || text2.length > 0);
    
    confirmBtn.disabled = !isValid || isProcessing;
  }

  /**
   * Open the engraving modal
   * @param {Object} itemData - Data about the cart item
   */
  function openModal(itemData) {
    // Re-cache dialog
    dialog = document.getElementById('engraving-modal-dialog');
    modal = document.getElementById('engraving-modal');
    productNameEl = document.getElementById('engraving-modal-product');
    textInput1 = document.getElementById('engraving-text-1');
    
    if (!dialog || !modal) return;
    
    // Reset processing flag when opening new modal
    isProcessing = false;
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
    dialog = document.getElementById('engraving-modal-dialog');
    if (!dialog) return;
    
    dialog.close();
    currentItemData = null;
    isProcessing = false;
    
    // Reset loading state
    setLoading(false);
  }

  /**
   * Reset form to initial state
   */
  function resetForm() {
    textInput1 = document.getElementById('engraving-text-1');
    textInput2 = document.getElementById('engraving-text-2');
    oneLineRadio = document.getElementById('engraving-one-line');
    twoLinesRadio = document.getElementById('engraving-two-lines');
    inputGroup2 = document.getElementById('engraving-input-group-2');
    counter1 = document.getElementById('engraving-counter-1');
    counter2 = document.getElementById('engraving-counter-2');
    
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
    confirmBtn = document.getElementById('engraving-modal-confirm');
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
    // Strict guard against double submissions
    if (isProcessing) {
      console.log('Already processing engraving, ignoring duplicate click');
      return;
    }
    
    if (!currentItemData) {
      console.log('No item data, ignoring click');
      return;
    }
    
    // Re-cache inputs
    textInput1 = document.getElementById('engraving-text-1');
    textInput2 = document.getElementById('engraving-text-2');
    twoLinesRadio = document.getElementById('engraving-two-lines');
    
    const text1 = textInput1?.value.trim() || '';
    const text2 = twoLinesRadio?.checked ? (textInput2?.value.trim() || '') : '';
    const isTwoLines = twoLinesRadio?.checked && text2.length > 0;
    
    if (!text1) return;
    
    // Lock immediately to prevent any duplicate processing
    isProcessing = true;
    setLoading(true);
    
    // Store item data locally in case it gets cleared
    const itemKey = currentItemData.itemKey;
    const variantId = currentItemData.variantId;
    const quantity = currentItemData.quantity;
    
    try {
      // Step 1: Remove the original item from cart
      await removeCartItem(itemKey);
      
      // Step 2: Add the item back with engraving properties
      const properties = {
        'Engraving Text': text1,
        'Knife Quantity': 1
      };
      
      if (isTwoLines) {
        properties['Engraving Text2'] = text2;
      }
      
      await addToCart(variantId, quantity, properties);
      
      // Step 3: Add the engraving fee product
      const feeVariantId = isTwoLines ? FEE_TWO_LINES : FEE_ONE_LINE;
      
      await addToCart(feeVariantId, quantity, {});
      
      // Engraving added successfully - close modal
      closeModal();
      
      // Step 4: Refresh the cart drawer (non-blocking)
      refreshCartDrawer().catch(err => {
        console.warn('Cart refresh failed, but engraving was added:', err);
      });
      
    } catch (error) {
      console.error('Error adding engraving:', error);
      isProcessing = false;
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
      // Fetch cart data and sections in parallel
      const [sectionsResponse, cartResponse] = await Promise.all([
        fetch('/?sections=cart-drawer,cart-icon-bubble'),
        fetch('/cart.js')
      ]);
      
      const sections = await sectionsResponse.json();
      const cartData = await cartResponse.json();
      
      // Dispatch cart:update event to refresh the drawer with all data
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
      // Fallback: reload the page if refresh fails
      window.location.reload();
    }
  }

  /**
   * Check for and remove orphaned engraving fees from cart
   * Orphaned fees are engraving fee products without a matching knife with "Engraving Text"
   */
  async function cleanupOrphanedEngravingFees() {
    // Prevent concurrent cleanup operations
    if (cleanupInProgress) return;
    cleanupInProgress = true;
    
    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();
      
      // Find all knives with engraving
      let requiredOneLineFees = 0;
      let requiredTwoLineFees = 0;
      
      cart.items.forEach(item => {
        if (item.properties && item.properties['Engraving Text']) {
          const knifeQty = parseInt(item.properties['Knife Quantity'], 10) || 1;
          const qty = item.quantity;
          
          if (item.properties['Engraving Text2']) {
            // Two line engraving
            requiredTwoLineFees += qty * knifeQty;
          } else {
            // One line engraving
            requiredOneLineFees += qty * knifeQty;
          }
        }
      });
      
      // Find current fee items in cart
      const feeOneItem = cart.items.find(item => item.variant_id === FEE_ONE_LINE);
      const feeTwoItem = cart.items.find(item => item.variant_id === FEE_TWO_LINES);
      
      const currentOneFees = feeOneItem ? feeOneItem.quantity : 0;
      const currentTwoFees = feeTwoItem ? feeTwoItem.quantity : 0;
      
      // Calculate differences
      const extraOneFees = currentOneFees - requiredOneLineFees;
      const extraTwoFees = currentTwoFees - requiredTwoLineFees;
      
      // Remove extras if any
      const updates = {};
      
      if (extraOneFees > 0) {
        updates[FEE_ONE_LINE] = requiredOneLineFees;
        console.log(`Adjusting one-line engraving fees: ${currentOneFees} -> ${requiredOneLineFees}`);
      }
      
      if (extraTwoFees > 0) {
        updates[FEE_TWO_LINES] = requiredTwoLineFees;
        console.log(`Adjusting two-line engraving fees: ${currentTwoFees} -> ${requiredTwoLineFees}`);
      }
      
      if (Object.keys(updates).length > 0) {
        const updateResponse = await fetch('/cart/update.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ updates })
        });
        
        if (updateResponse.ok) {
          // Refresh cart drawer after cleanup
          await refreshCartDrawer();
        }
      }
    } catch (error) {
      console.error('Error cleaning up orphaned engraving fees:', error);
    } finally {
      cleanupInProgress = false;
    }
  }

  // Set up event listeners once
  setupEventListeners();

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      // Run cleanup on page load
      cleanupOrphanedEngravingFees();
    });
  } else {
    init();
    // Run cleanup on page load
    cleanupOrphanedEngravingFees();
  }

  // Run cleanup after cart updates (handles item deletion)
  document.addEventListener('cart:update', () => {
    // Small delay to ensure cart is updated
    setTimeout(() => {
      init(); // Re-cache DOM elements
      cleanupOrphanedEngravingFees(); // Clean up orphaned fees
    }, 300);
  });

  // Expose functions for external use if needed
  window.CartEngraving = {
    open: openModal,
    close: closeModal,
    cleanup: cleanupOrphanedEngravingFees
  };
})();
