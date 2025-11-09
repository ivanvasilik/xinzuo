import { Component } from './component.js';

/**
 * Delivery Estimate Component
 * 
 * A fully isolated component for calculating delivery estimates based on Australian postcodes.
 * 
 * Features:
 * - Express delivery zones (next business day) for major metro areas
 * - Standard delivery (1-2 days QLD, 1-3 days other states)
 * - Respects cutoff times (default 12:00 PM)
 * - Automatically skips weekends
 * - Optional public holiday detection
 * - Mobile-first responsive design
 * 
 * Usage:
 * Add the 'delivery-estimate' block type to product pages in the theme editor.
 * 
 * Configuration:
 * - cutoff_time: Order cutoff time in 24h format (default: "12:00")
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
      this.resultContainer = this.refs.resultContainer;
      this.resultTitle = this.refs.resultTitle;
      this.resultDetails = this.refs.resultDetails;
      this.errorContainer = this.refs.errorContainer;
      this.errorMessage = this.refs.errorMessage;

      this.bindEvents();
    });
  }

  bindEvents() {
    if (!this.checkButton || !this.postcodeInput) return;

    // Handle check button click
    this.checkButton.addEventListener('click', () => this.handleCheck());

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
    const now = new Date();
    const [cutoffHour, cutoffMinute] = this.cutoffTime.split(':').map(Number);

    // Check if in express delivery zone
    const expressZone = this.findExpressZone(postcode);

    if (expressZone) {
      // Next business day delivery
      const deliveryDate = this.getNextBusinessDay(now, cutoffHour, cutoffMinute);
      const formattedDate = this.formatDeliveryDate(deliveryDate);
      const timeRemaining = this.getTimeRemaining(now, cutoffHour, cutoffMinute);

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
      const days = isQLD ? '1-2' : '1-3';
      const state = isQLD ? 'Queensland' : 'your area';

      return {
        type: 'standard',
        days,
        state,
        isQLD,
        postcode,
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
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Reset time parts for comparison
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());

    if (dateOnly.getTime() === todayOnly.getTime()) {
      return 'today';
    } else if (dateOnly.getTime() === tomorrowOnly.getTime()) {
      return 'tomorrow';
    } else {
      const options = { weekday: 'long', month: 'short', day: 'numeric' };
      return date.toLocaleDateString('en-AU', options);
    }
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

      if (hoursRemaining > 0) {
        return `${hoursRemaining} hour${hoursRemaining > 1 ? 's' : ''} ${minsRemaining > 0 ? `${minsRemaining} min` : ''}`;
      } else {
        return `${minsRemaining} minute${minsRemaining > 1 ? 's' : ''}`;
      }
    }
    return null;
  }

  showResult(estimate) {
    if (estimate.type === 'express') {
      const timeRemainingText = estimate.timeRemaining
        ? ` — Order within ${estimate.timeRemaining}`
        : '';

      this.resultTitle.textContent = `Receive by ${estimate.formattedDate}${timeRemainingText}`;
      this.resultDetails.textContent = `Express delivery available for ${estimate.zone} (postcode ${estimate.postcode})`;
    } else {
      this.resultTitle.textContent = `Delivery in ${estimate.days} business days`;
      this.resultDetails.textContent = `Standard delivery to ${estimate.state} (postcode ${estimate.postcode})`;
    }

    this.resultContainer.style.display = 'flex';
  }

  showError(message) {
    this.errorMessage.textContent = message;
    this.errorContainer.style.display = 'flex';
  }

  hideResults() {
    this.resultContainer.style.display = 'none';
    this.errorContainer.style.display = 'none';
  }
}

customElements.define('delivery-estimate-component', DeliveryEstimateComponent);

