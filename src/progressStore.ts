type ProgressListener = (value: number | null) => void;

class ProgressStore {
  private listeners: Set<ProgressListener> = new Set();
  private value: number | null = null;
  private interval: ReturnType<typeof setInterval> | null = null;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;

  public config = {
    transitionTime: 300,
    loaderSpeed: 500,
    waitingTime: 1000,
  };

  subscribe(listener: ProgressListener) {
    this.listeners.add(listener);
    listener(this.value);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.value));
  }

  start(loaderType: "continuous" | "static" = "continuous") {
    if (loaderType === "static") {
      this.staticStart();
    } else {
      this.continuousStart();
    }
  }

  continuousStart(startingValue?: number, refreshRate?: number) {
    this.cleanup();
    this.value =
      startingValue !== undefined
        ? startingValue
        : Math.floor(Math.random() * 10) + 20;
    this.notify();

    this.interval = setInterval(() => {
      if (this.value !== null && this.value < 90) {
        const inc = Math.floor(Math.random() * 8) + 2;
        this.value = Math.min(this.value + inc, 90);
        this.notify();
      }
    }, refreshRate || this.config.loaderSpeed);
  }

  staticStart(startingValue?: number) {
    this.cleanup();
    this.value =
      startingValue !== undefined
        ? startingValue
        : Math.floor(Math.random() * 20) + 30;
    this.notify();
  }

  complete() {
    this.finish();
  }

  finish() {
    this.cleanup();
    if (this.value === null) return;

    this.value = 100;
    this.notify();

    this.hideTimer = setTimeout(() => {
      this.value = null;
      this.notify();
    }, this.config.waitingTime);
  }

  reset() {
    this.cleanup();
    this.value = null;
    this.notify();
  }

  set(value: number) {
    this.cleanup();
    this.value = value;
    this.notify();
    if (value >= 100) {
      this.finish();
    }
  }

  increase(amount: number) {
    if (this.value !== null) {
      this.value = Math.min(this.value + amount, 100);
      this.notify();
      if (this.value === 100) this.finish();
    }
  }

  decrease(amount: number) {
    if (this.value !== null) {
      this.value = Math.max(0, this.value - amount);
      this.notify();
    }
  }

  private cleanup() {
    if (this.interval) clearInterval(this.interval);
    if (this.hideTimer) clearTimeout(this.hideTimer);
  }

  getValue() {
    return this.value;
  }

  getProgress() {
    return this.value;
  }
}

const progressStore = new ProgressStore();

export const useProgressStore = () => progressStore;

export const startProgress = (type?: "continuous" | "static") =>
  progressStore.start(type);
export const continuousStart = (startingValue?: number, refreshRate?: number) =>
  progressStore.continuousStart(startingValue, refreshRate);
export const staticStart = (startingValue?: number) =>
  progressStore.staticStart(startingValue);
export const finishProgress = () => progressStore.finish();
export const completeProgress = () => progressStore.complete();
export const increaseProgress = (value: number) =>
  progressStore.increase(value);
export const decreaseProgress = (value: number) =>
  progressStore.decrease(value);
export const getProgress = () => progressStore.getProgress();
export const setProgress = (value: number) => progressStore.set(value);
export const resetProgress = () => progressStore.reset();

export const withProgress = async <T>(promise: Promise<T>): Promise<T> => {
  startProgress();
  try {
    const result = await promise;
    finishProgress();
    return result;
  } catch (err) {
    finishProgress();
    throw err;
  }
};
