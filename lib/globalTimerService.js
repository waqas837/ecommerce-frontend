// timerManager.js
class TimerManager {
  constructor() {
    this.timers = new Map();
    this.checkInterval = null;
  }

  static getInstance() {
    if (!TimerManager.instance) {
      TimerManager.instance = new TimerManager();
    }
    return TimerManager.instance;
  }

  addTimer(id, publishTime, callback) {
    this.timers.set(id, { publishTime, callback });
    this.startChecking();
  }

  removeTimer(id) {
    this.timers.delete(id);
    if (this.timers.size === 0) {
      this.stopChecking();
    }
  }

  startChecking() {
    if (!this.checkInterval) {
      this.checkInterval = setInterval(() => this.checkTimers(), 1000);
    }
  }

  stopChecking() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  checkTimers() {
    const now = new Date().getTime();

    this.timers.forEach(({ publishTime, callback }, id) => {
      const publishDate = new Date(publishTime).getTime();
      if (now >= publishDate) {
        callback();
        this.removeTimer(id);
      }
    });
  }
}

// Initialize the singleton instance
const timerManager = TimerManager.getInstance();
