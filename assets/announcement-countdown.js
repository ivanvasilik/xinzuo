/**
 * Countdown Timer for Announcement Bar
 * Counts down to 12:00 PM Brisbane time (Australia/Brisbane)
 */
class AnnouncementCountdown extends HTMLElement {
  constructor() {
    super();
    this.targetHour = 12; // 12:00 PM Brisbane time
    this.targetMinute = 0;
    this.intervalId = null;
  }

  connectedCallback() {
    this.render();
    this.startCountdown();
  }

  disconnectedCallback() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  render() {
    this.innerHTML = `
      <span class="countdown-timer">
        <span class="countdown-time"></span>
      </span>
    `;
  }

  getBrisbaneTime() {
    // Get current time in Brisbane timezone
    const now = new Date();
    const brisbaneTime = new Date(
      now.toLocaleString('en-US', { timeZone: 'Australia/Brisbane' })
    );
    return brisbaneTime;
  }

  getTargetTime() {
    const brisbaneNow = this.getBrisbaneTime();
    const target = new Date(brisbaneNow);
    target.setHours(this.targetHour, this.targetMinute, 0, 0);

    // If we've passed today's target time, target tomorrow
    if (brisbaneNow >= target) {
      target.setDate(target.getDate() + 1);
    }

    return target;
  }

  calculateTimeRemaining() {
    const brisbaneNow = this.getBrisbaneTime();
    const target = this.getTargetTime();
    const diff = target - brisbaneNow;

    if (diff <= 0) {
      return null; // Countdown finished
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return {
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0')
    };
  }

  updateDisplay() {
    const timeRemaining = this.calculateTimeRemaining();
    const timeElement = this.querySelector('.countdown-time');

    if (!timeRemaining) {
      // Countdown finished - reset to next day's target
      this.startCountdown();
      return;
    }

    if (timeElement) {
      const parts = [];
      if (parseInt(timeRemaining.hours) > 0) {
        parts.push(`${parseInt(timeRemaining.hours)} hrs`);
      }
      parts.push(`${parseInt(timeRemaining.minutes)} mins`);
      parts.push(`${parseInt(timeRemaining.seconds)} secs`);
      
      timeElement.textContent = parts.join(', ');
    }
  }

  startCountdown() {
    // Update immediately
    this.updateDisplay();

    // Update every 1 second - minimal performance impact
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    this.intervalId = setInterval(() => {
      this.updateDisplay();
    }, 1000);
  }
}

if (!customElements.get('announcement-countdown')) {
  customElements.define('announcement-countdown', AnnouncementCountdown);
}

