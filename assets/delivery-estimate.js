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

    // Wait for refs to be populated
    requestAnimationFrame(() => {
      this.postcodeInput = this.refs.postcodeInput;
      this.checkButton = this.refs.checkButton;
      this.destinationText = this.refs.destinationText;
      this.errorContainer = this.refs.errorContainer;
      this.errorMessage = this.refs.errorMessage;
      this.detectLocationButton = this.refs.detectLocationButton;

      this.bindEvents();
      this.autoDetectPostcode();
    });
  }

  bindEvents() {
    if (!this.checkButton || !this.postcodeInput) return;

    // Handle check button click
    this.checkButton.addEventListener('click', () => this.handleCheck());

    // Handle detect location button
    if (this.detectLocationButton) {
      this.detectLocationButton.addEventListener('click', () => this.detectPostcodeManually());
    }

    // Handle Enter key in input
    this.postcodeInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleCheck();
      }
    });

    // Only allow numbers in input
    this.postcodeInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
  }

  /**
   * Auto-detect postcode using IP geolocation (no permission needed)
   * Falls back silently if detection fails
   */
  async autoDetectPostcode() {
    try {
      // Check if already saved in session storage
      const savedPostcode = sessionStorage.getItem('detectedPostcode');
      if (savedPostcode && savedPostcode.length === 4) {
        this.postcodeInput.value = savedPostcode;
        return;
      }

      // Use free IP geolocation API (no key required for basic use)
      const response = await fetch('https://ipapi.co/json/', {
        signal: AbortSignal.timeout(3000), // 3 second timeout
      });

      if (!response.ok) return;

      const data = await response.json();

      // Check if it's Australia and has a postcode
      if (data.country_code === 'AU' && data.postal) {
        const postcode = data.postal;
        if (postcode.length === 4 && /^\d{4}$/.test(postcode)) {
          this.postcodeInput.value = postcode;
          // Save to session storage for this session
          sessionStorage.setItem('detectedPostcode', postcode);
        }
      }
    } catch (error) {
      // Silently fail - user can still enter manually
      console.log('Postcode auto-detection unavailable');
    }
  }

  /**
   * Manual location detection using browser geolocation API
   * Requires user permission
   */
  async detectPostcodeManually() {
    if (!navigator.geolocation) {
      this.showError('Location detection not supported in your browser');
      return;
    }

    // Show loading state - disable button and add loading class
    this.detectLocationButton.disabled = true;
    this.detectLocationButton.classList.add('loading');

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        });
      });

      const { latitude, longitude } = position.coords;

      // Reverse geocode to get postcode using free API
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );

      if (!response.ok) throw new Error('Geocoding failed');

      const data = await response.json();

      if (data.postcode && /^\d{4}$/.test(data.postcode)) {
        this.postcodeInput.value = data.postcode;
        sessionStorage.setItem('detectedPostcode', data.postcode);
        // Auto-check after detection
        this.handleCheck();
      } else {
        this.showError('Could not determine postcode from your location');
      }
    } catch (error) {
      if (error.code === 1) {
        this.showError('Location permission denied. Please enter postcode manually.');
      } else {
        this.showError('Could not detect location. Please enter postcode manually.');
      }
    } finally {
      // Restore button state
      this.detectLocationButton.disabled = false;
      this.detectLocationButton.classList.remove('loading');
    }
  }

  handleCheck() {
    const postcode = this.postcodeInput.value.trim();

    // Hide previous results
    this.hideResults();

    // Validate postcode
    if (!postcode) {
      this.showError('Please enter a postcode');
      return;
    }

    if (postcode.length !== 4) {
      this.showError('Please enter a valid 4-digit Australian postcode');
      return;
    }

    const postcodeNum = parseInt(postcode, 10);

    // Check if valid Australian postcode range (0200-9999)
    if (postcodeNum < 200 || postcodeNum > 9999) {
      this.showError('Please enter a valid Australian postcode');
      return;
    }

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
      const formattedDate = this.formatDeliveryDate(deliveryDate);
      const timeRemaining = this.getTimeRemaining(brisbaneTime, cutoffHour, cutoffMinute);

      return {
        type: 'express',
        zone: expressZone,
        date: deliveryDate,
        formattedDate,
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
      
      const earliestFormatted = this.formatDeliveryDate(earliestDate);
      const latestFormatted = this.formatDeliveryDate(latestDate);

      return {
        type: 'standard',
        minDays,
        maxDays,
        isQLD,
        postcode,
        timeRemaining,
        earliestDate,
        latestDate,
        earliestFormatted,
        latestFormatted,
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
    const options = { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short',
      timeZone: 'Australia/Brisbane'
    };
    return date.toLocaleDateString('en-AU', options);
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
    if (estimate.type === 'express') {
      if (estimate.timeRemaining) {
        // Before cutoff - show countdown with styling
        this.destinationText.innerHTML = `<strong>Order within</strong> <span class="time-countdown">${estimate.timeRemaining}</span> <span class="delivery-date-text">to receive it by ${estimate.formattedDate} to <span class="delivery-postcode">${estimate.postcode}</span></span>`;
      } else {
        // After cutoff - just show date with styling
        this.destinationText.innerHTML = `<span class="delivery-date-text">Get it by ${estimate.formattedDate} to <span class="delivery-postcode">${estimate.postcode}</span></span>`;
      }
    } else {
      // Standard delivery with date range
      if (estimate.timeRemaining) {
        // Before cutoff - show countdown
        this.destinationText.innerHTML = `<strong>Order within</strong> <span class="time-countdown">${estimate.timeRemaining}</span> <span class="delivery-date-text">to receive it between ${estimate.earliestFormatted} - ${estimate.latestFormatted} to <span class="delivery-postcode">${estimate.postcode}</span></span>`;
      } else {
        // After cutoff - just show date range
        this.destinationText.innerHTML = `<span class="delivery-date-text">Get it between ${estimate.earliestFormatted} - ${estimate.latestFormatted} to <span class="delivery-postcode">${estimate.postcode}</span></span>`;
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
    this.destinationText.textContent = 'Enter postcode to see delivery date';
    this.destinationText.style.color = '';
    this.hideError();
  }
}

customElements.define('delivery-estimate-component', DeliveryEstimateComponent);

