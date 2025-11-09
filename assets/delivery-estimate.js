import { Component } from './component.js';

/**
 * Delivery Estimate Component
 * 
 * A fully isolated component for calculating delivery estimates based on Australian postcodes.
 * 
 * Features:
 * - Express delivery zones (next business day) for major metro areas
 * - Standard delivery (1-2 days QLD, 1-3 days other states)
 * - Respects cutoff times (default 12:00 PM Brisbane/AEST time)
 * - Automatically skips weekends
 * - Optional public holiday detection
 * - Mobile-first responsive design
 * - Automatic postcode detection via IP geolocation
 * 
 * Important:
 * - All time calculations use Australia/Brisbane timezone (AEST GMT+10)
 * - Queensland doesn't observe daylight saving, so always GMT+10
 * - Cutoff time is based on Brisbane time, not user's local time
 * 
 * Usage:
 * Add the 'delivery-estimate' block type to product pages in the theme editor.
 * 
 * Configuration:
 * - cutoff_time: Order cutoff time in 24h format (default: "12:00" Brisbane time)
 * - enable_public_holidays: Whether to skip public holidays (default: true)
 * - Styling options available in block settings
 * 
 * Maintenance:
 * - Update PUBLIC_HOLIDAYS array annually (around December each year)
 * - Verify postcode ranges if delivery zones change
 * 
 * @author Xinzuo Development Team
 * @version 1.0.0
 */
class DeliveryEstimateComponent extends Component {
  // Express delivery postcode ranges (next business day)
  static EXPRESS_ZONES = {
    Canberra: [[200, 200], [2600, 2620], [2900, 2914]],
    Sydney: [[1000, 1920], [2000, 2234], [2555, 2574], [2740, 2786]],
    Melbourne: [[3000, 3207], [3340, 3341], [3750, 3750], [3755, 3757], [8001, 8785]],
    Brisbane: [[4000, 4209], [9016, 9464]],
    'Gold Coast': [[2484, 2490], [4210, 4275], [9726, 9726]],
    Adelaide: [[5000, 5174], [5800, 5950]],
    'Perth CBD': [[6000, 6005], [6800, 6892]],
    Tasmania: [
      [7000, 7019],
      [7050, 7053],
      [7055, 7055],
      [7248, 7250],
      [7258, 7258],
      [7275, 7300],
      [7315, 7315],
      [7320, 7320],
    ],
  };

  // Queensland postcode ranges (for standard delivery)
  static QLD_POSTCODES = [[4000, 4999], [9000, 9999]];

  // Australian public holidays 2025-2026
  // Note: Update this list annually to maintain accurate delivery estimates
  static PUBLIC_HOLIDAYS = [
    // 2025
    '2025-01-01', // New Year's Day
    '2025-01-27', // Australia Day
    '2025-04-18', // Good Friday
    '2025-04-19', // Easter Saturday
    '2025-04-21', // Easter Monday
    '2025-04-25', // Anzac Day
    '2025-06-09', // Queen's Birthday (varies by state)
    '2025-12-25', // Christmas Day
    '2025-12-26', // Boxing Day
    // 2026
    '2026-01-01', // New Year's Day
    '2026-01-26', // Australia Day
    '2026-04-03', // Good Friday
    '2026-04-04', // Easter Saturday
    '2026-04-06', // Easter Monday
    '2026-04-27', // Anzac Day (observed)
    '2026-06-08', // Queen's Birthday
    '2026-12-25', // Christmas Day
    '2026-12-28', // Boxing Day (observed)
  ];

  connectedCallback() {
    super.connectedCallback();

    this.cutoffTime = this.dataset.cutoffTime || '12:00';
    this.enableHolidays = this.dataset.enableHolidays === 'true';
    this.postcodeData = null;
    this.postcodeDataLoading = false;
    this.postcodeDataLoaded = false;
    this.selectedIndex = -1;
    this.selectedSuburb = null; // Track selected suburb name

    // Wait for refs to be populated
    requestAnimationFrame(() => {
      this.postcodeInput = this.refs.postcodeInput;
      this.checkButton = this.refs.checkButton;
      this.destinationText = this.refs.destinationText;
      this.errorContainer = this.refs.errorContainer;
      this.errorMessage = this.refs.errorMessage;
      this.dropdown = this.refs.dropdown;
      this.dropdownList = this.refs.dropdownList;

      this.bindEvents();
      // Lazy load: Only load postcode data on first interaction
      // This improves PageSpeed scores by not loading 1.2MB on initial page load
      this.autoDetectPostcodeSimple();
    });
  }

  bindEvents() {
    if (!this.checkButton || !this.postcodeInput) return;

    // Handle check button click
    this.checkButton.addEventListener('click', () => this.handleCheck());

    // Handle input for autocomplete
    this.postcodeInput.addEventListener('input', (e) => {
      this.handleAutocomplete(e.target.value);
    });

    // Handle keyboard navigation
    this.postcodeInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.navigateDropdown(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigateDropdown(-1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (this.selectedIndex >= 0) {
          this.selectDropdownItem();
        } else {
          this.handleCheck();
        }
      } else if (e.key === 'Escape') {
        this.hideDropdown();
      }
    });

    // Handle blur to hide dropdown
    this.postcodeInput.addEventListener('blur', () => {
      // Delay to allow click on dropdown item
      setTimeout(() => this.hideDropdown(), 200);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.contains(e.target)) {
        this.hideDropdown();
      }
    });
  }

  /**
   * Load Australian postcode data from JSON file
   */
  async loadPostcodeData() {
    try {
      const response = await fetch('/cdn/shop/t/7/assets/australian_postcodes.json');
      if (!response.ok) {
        console.error('Failed to load postcode data');
        return;
      }
      this.postcodeData = await response.json();
      
      // Auto-detect postcode via IP after data loads
      this.autoDetectPostcode();
    } catch (error) {
      console.error('Error loading postcode data:', error);
    }
  }

  /**
   * Auto-detect postcode using IP geolocation (no permission needed)
   * Auto-calculates delivery once detected
   */
  async autoDetectPostcode() {
    try {
      // Check if already saved in session storage
      const savedPostcode = sessionStorage.getItem('detectedPostcode');
      const savedSuburb = sessionStorage.getItem('detectedSuburb');
      if (savedPostcode && savedPostcode.length === 4) {
        // Show in "Suburb, Postcode" format if suburb is available
        if (savedSuburb) {
          this.postcodeInput.value = `${savedSuburb}, ${savedPostcode}`;
          this.selectedSuburb = savedSuburb;
        } else {
          this.postcodeInput.value = savedPostcode;
        }
        this.handleCheck(); // Auto-calculate on load
        return;
      }

      // Use free IP geolocation API
      const response = await fetch('https://ipapi.co/json/', {
        signal: AbortSignal.timeout(3000),
      });

      if (!response.ok) return;

      const data = await response.json();

      // Check if it's Australia and has a postcode
      if (data.country_code === 'AU' && data.postal) {
        const postcode = data.postal;
        if (postcode.length === 4 && /^\d{4}$/.test(postcode)) {
          // Find suburb for this postcode
          const match = this.postcodeData?.find((item) => item.postcode === postcode);
          
          if (match) {
            this.postcodeInput.value = `${match.locality}, ${postcode}`;
            this.selectedSuburb = match.locality;
            sessionStorage.setItem('detectedSuburb', match.locality);
          } else {
            this.postcodeInput.value = postcode;
          }
          
          sessionStorage.setItem('detectedPostcode', postcode);
          // Auto-calculate delivery estimate
          this.handleCheck();
        }
      }
    } catch (error) {
      // Silently fail - user can still enter manually
      console.log('Postcode auto-detection unavailable');
    }
  }

  /**
   * Handle autocomplete as user types
   */
  handleAutocomplete(query) {
    if (!this.postcodeData) return;

    const trimmedQuery = query.trim().toLowerCase();

    // Hide dropdown if query is too short
    if (trimmedQuery.length < 2) {
      this.hideDropdown();
      return;
    }

    // Filter postcodes - search both postcode and locality
    const matches = this.postcodeData.filter((item) => {
      const postcodeMatch = item.postcode.includes(trimmedQuery);
      const localityMatch = item.locality.toLowerCase().includes(trimmedQuery);
      return postcodeMatch || localityMatch;
    });

    // Limit to first 8 results for performance
    const limitedMatches = matches.slice(0, 8);

    if (limitedMatches.length > 0) {
      this.showDropdown(limitedMatches);
    } else {
      this.hideDropdown();
    }
  }

  /**
   * Display dropdown with filtered results
   */
  showDropdown(matches) {
    this.dropdownList.innerHTML = '';
    this.selectedIndex = -1;

    matches.forEach((item, index) => {
      const li = document.createElement('li');
      li.innerHTML = `${item.locality} <span class="dropdown-postcode">${item.postcode}</span>`;
      li.dataset.postcode = item.postcode;
      li.dataset.locality = item.locality;
      li.dataset.index = index;
      
      li.addEventListener('click', () => {
        // Set input to "Suburb, Postcode" format
        this.postcodeInput.value = `${item.locality}, ${item.postcode}`;
        this.selectedSuburb = item.locality;
        sessionStorage.setItem('detectedPostcode', item.postcode);
        sessionStorage.setItem('detectedSuburb', item.locality);
        this.hideDropdown();
        this.handleCheck(); // Auto-calculate on selection
      });

      this.dropdownList.appendChild(li);
    });

    this.dropdown.style.display = 'block';
  }

  /**
   * Hide the dropdown
   */
  hideDropdown() {
    if (this.dropdown) {
      this.dropdown.style.display = 'none';
      this.selectedIndex = -1;
    }
  }

  /**
   * Navigate dropdown with arrow keys
   */
  navigateDropdown(direction) {
    const items = this.dropdownList.querySelectorAll('li');
    if (items.length === 0) return;

    // Remove previous selection
    if (this.selectedIndex >= 0 && items[this.selectedIndex]) {
      items[this.selectedIndex].classList.remove('selected');
    }

    // Update index
    this.selectedIndex += direction;

    // Loop around
    if (this.selectedIndex < 0) {
      this.selectedIndex = items.length - 1;
    } else if (this.selectedIndex >= items.length) {
      this.selectedIndex = 0;
    }

    // Add new selection
    if (items[this.selectedIndex]) {
      items[this.selectedIndex].classList.add('selected');
      items[this.selectedIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  /**
   * Select the currently highlighted dropdown item
   */
  selectDropdownItem() {
    const items = this.dropdownList.querySelectorAll('li');
    if (this.selectedIndex >= 0 && items[this.selectedIndex]) {
      const postcode = items[this.selectedIndex].dataset.postcode;
      const locality = items[this.selectedIndex].dataset.locality;
      // Set input to "Suburb, Postcode" format
      this.postcodeInput.value = `${locality}, ${postcode}`;
      this.selectedSuburb = locality;
      sessionStorage.setItem('detectedPostcode', postcode);
      sessionStorage.setItem('detectedSuburb', locality);
      this.hideDropdown();
      this.handleCheck(); // Auto-calculate on selection
    }
  }

  handleCheck() {
    let input = this.postcodeInput.value.trim();

    // Hide previous results
    this.hideResults();
    this.hideDropdown();

    // Validate input
    if (!input) {
      this.showError('Please enter a suburb or postcode');
      return;
    }

    let postcode = null;
    let suburb = null;

    // Check if input is in "Suburb, Postcode" format
    if (input.includes(',')) {
      const parts = input.split(',').map(p => p.trim());
      if (parts.length === 2) {
        suburb = parts[0];
        postcode = parts[1];
      }
    }
    // If just postcode (numbers only)
    else if (/^\d{4}$/.test(input)) {
      postcode = input;
      // Try to find a suburb for this postcode
      const match = this.postcodeData?.find((item) => item.postcode === postcode);
      if (match) {
        suburb = match.locality;
        // Update input to show suburb too
        this.postcodeInput.value = `${suburb}, ${postcode}`;
        this.selectedSuburb = suburb;
      }
    }
    // If suburb name only
    else {
      const inputLower = input.toLowerCase();
      const match = this.postcodeData?.find(
        (item) => item.locality.toLowerCase() === inputLower
      );
      
      if (match) {
        postcode = match.postcode;
        suburb = match.locality;
        // Update input to show full format
        this.postcodeInput.value = `${suburb}, ${postcode}`;
        this.selectedSuburb = suburb;
      } else {
        this.showError('Please select a suburb from the dropdown or enter a postcode');
        return;
      }
    }

    // Validate postcode
    if (!postcode || postcode.length !== 4 || !/^\d{4}$/.test(postcode)) {
      this.showError('Please enter a valid 4-digit Australian postcode');
      return;
    }

    const postcodeNum = parseInt(postcode, 10);

    // Check if valid Australian postcode range (0200-9999)
    if (postcodeNum < 200 || postcodeNum > 9999) {
      this.showError('Please enter a valid Australian postcode');
      return;
    }

    // Store suburb for display
    this.selectedSuburb = suburb;

    // Calculate delivery estimate
    const estimate = this.calculateDeliveryEstimate(postcodeNum);
    this.showResult(estimate);
  }

  calculateDeliveryEstimate(postcode) {
    // Get current time in Brisbane/Queensland timezone (AEST GMT+10)
    const brisbaneTime = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Australia/Brisbane' })
    );
    const [cutoffHour, cutoffMinute] = this.cutoffTime.split(':').map(Number);

    // Check if in express delivery zone
    const expressZone = this.findExpressZone(postcode);

    if (expressZone) {
      // Next business day delivery
      const deliveryDate = this.getNextBusinessDay(brisbaneTime, cutoffHour, cutoffMinute);
      const dateInfo = this.formatDeliveryDate(deliveryDate);
      const timeRemaining = this.getTimeRemaining(brisbaneTime, cutoffHour, cutoffMinute);

      return {
        type: 'express',
        zone: expressZone,
        date: deliveryDate,
        dateInfo,
        timeRemaining,
        postcode,
      };
    } else {
      // Standard delivery (1-2 days for QLD, 1-3 days for others)
      const isQLD = this.isQueensland(postcode);
      const minDays = 1;
      const maxDays = isQLD ? 2 : 3;
      const timeRemaining = this.getTimeRemaining(brisbaneTime, cutoffHour, cutoffMinute);
      
      // Calculate earliest delivery date
      const earliestDate = this.getNextBusinessDay(brisbaneTime, cutoffHour, cutoffMinute);
      
      // Calculate latest delivery date (add additional business days)
      let latestDate = new Date(earliestDate);
      let daysToAdd = maxDays - minDays;
      while (daysToAdd > 0) {
        latestDate.setDate(latestDate.getDate() + 1);
        if (!this.isWeekendOrHoliday(latestDate)) {
          daysToAdd--;
        }
      }
      
      const earliestInfo = this.formatDeliveryDate(earliestDate);
      const latestInfo = this.formatDeliveryDate(latestDate);

      return {
        type: 'standard',
        minDays,
        maxDays,
        isQLD,
        postcode,
        timeRemaining,
        earliestDate,
        latestDate,
        earliestInfo,
        latestInfo,
      };
    }
  }

  findExpressZone(postcode) {
    for (const [zone, ranges] of Object.entries(DeliveryEstimateComponent.EXPRESS_ZONES)) {
      for (const [min, max] of ranges) {
        if (postcode >= min && postcode <= max) {
          return zone;
        }
      }
    }
    return null;
  }

  isQueensland(postcode) {
    for (const [min, max] of DeliveryEstimateComponent.QLD_POSTCODES) {
      if (postcode >= min && postcode <= max) {
        return true;
      }
    }
    return false;
  }

  getNextBusinessDay(fromDate, cutoffHour, cutoffMinute) {
    let deliveryDate = new Date(fromDate);

    // Check if before cutoff time today
    const currentHour = fromDate.getHours();
    const currentMinute = fromDate.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    const cutoffTimeMinutes = cutoffHour * 60 + cutoffMinute;

    // If after cutoff, start from tomorrow
    if (currentTime >= cutoffTimeMinutes) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
    } else {
      // If before cutoff, next business day from today
      deliveryDate.setDate(deliveryDate.getDate() + 1);
    }

    // Skip weekends and holidays
    while (this.isWeekendOrHoliday(deliveryDate)) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
    }

    return deliveryDate;
  }

  isWeekendOrHoliday(date) {
    // Check weekend (0 = Sunday, 6 = Saturday)
    const day = date.getDay();
    if (day === 0 || day === 6) {
      return true;
    }

    // Check public holidays if enabled
    if (this.enableHolidays) {
      const dateString = date.toISOString().split('T')[0];
      if (DeliveryEstimateComponent.PUBLIC_HOLIDAYS.includes(dateString)) {
        return true;
      }
    }

    return false;
  }

  formatDeliveryDate(date) {
    // Get tomorrow's date in Brisbane timezone for comparison
    const brisbaneNow = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Australia/Brisbane' })
    );
    const tomorrowBrisbane = new Date(brisbaneNow);
    tomorrowBrisbane.setDate(tomorrowBrisbane.getDate() + 1);
    
    // Compare just the date parts (ignore time)
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const tomorrowOnly = new Date(tomorrowBrisbane.getFullYear(), tomorrowBrisbane.getMonth(), tomorrowBrisbane.getDate());
    
    // Always format the actual date
    const options = { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short',
      timeZone: 'Australia/Brisbane'
    };
    const formattedDate = date.toLocaleDateString('en-AU', options);
    
    // Return object with both tomorrow flag and formatted date
    if (dateOnly.getTime() === tomorrowOnly.getTime()) {
      return {
        isTomorrow: true,
        formatted: formattedDate
      };
    }
    
    return {
      isTomorrow: false,
      formatted: formattedDate
    };
  }

  getTimeRemaining(now, cutoffHour, cutoffMinute) {
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    const cutoffTimeMinutes = cutoffHour * 60 + cutoffMinute;

    if (currentTime < cutoffTimeMinutes) {
      const minutesRemaining = cutoffTimeMinutes - currentTime;
      const hoursRemaining = Math.floor(minutesRemaining / 60);
      const minsRemaining = minutesRemaining % 60;

      if (hoursRemaining > 0 && minsRemaining > 0) {
        return `${hoursRemaining}hrs ${minsRemaining}min`;
      } else if (hoursRemaining > 0) {
        return `${hoursRemaining}hrs`;
      } else {
        return `${minsRemaining}min`;
      }
    }
    return null;
  }

  showResult(estimate) {
    // Helper to format date with underline
    const formatDateDisplay = (dateInfo) => {
      if (dateInfo.isTomorrow) {
        return `<span class="underline-text">Tomorrow, ${dateInfo.formatted}</span>`;
      }
      return `<span class="underline-text">${dateInfo.formatted}</span>`;
    };

    // Format location as "Suburb, Postcode" with underline
    const locationDisplay = this.selectedSuburb 
      ? `<span class="underline-text">${this.selectedSuburb}, ${estimate.postcode}</span>`
      : `<span class="underline-text">${estimate.postcode}</span>`;

    if (estimate.type === 'express') {
      if (estimate.timeRemaining) {
        // Before cutoff - show countdown and date
        this.destinationText.innerHTML = `Order within <span class="underline-text">${estimate.timeRemaining}</span> to receive it by ${formatDateDisplay(estimate.dateInfo)} to ${locationDisplay}`;
      } else {
        // After cutoff - show date
        this.destinationText.innerHTML = `Get it by ${formatDateDisplay(estimate.dateInfo)} to ${locationDisplay}`;
      }
    } else {
      // Standard delivery with date range
      const earliestDisplay = formatDateDisplay(estimate.earliestInfo);
      const latestDisplay = formatDateDisplay(estimate.latestInfo);
      
      if (estimate.timeRemaining) {
        // Before cutoff - show countdown and date range
        this.destinationText.innerHTML = `Order within <span class="underline-text">${estimate.timeRemaining}</span> to receive it between ${earliestDisplay} - ${latestDisplay} to ${locationDisplay}`;
      } else {
        // After cutoff - show date range
        this.destinationText.innerHTML = `Get it between ${earliestDisplay} - ${latestDisplay} to ${locationDisplay}`;
      }
    }
    this.destinationText.style.color = '#ffffff';
    this.hideError();
  }

  showError(message) {
    this.errorMessage.textContent = message;
    this.errorContainer.style.display = 'block';
  }

  hideError() {
    this.errorContainer.style.display = 'none';
  }

  hideResults() {
    this.destinationText.textContent = 'Enter suburb or postcode to check delivery';
    this.destinationText.style.color = '';
    this.hideError();
  }
}

customElements.define('delivery-estimate-component', DeliveryEstimateComponent);

