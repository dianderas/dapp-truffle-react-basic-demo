
export class Observable {
    listeners; // array of (val: T) => void
    value; // T

    constructor(value) {
        this.value = value;
        this.listeners = [];
    }

    // Get current data
    get() {
        return this.value;
    }

    // Set data only if value is a new data, later brodcast the new data
    set(value) {
        if (this.value !== value) {
            this.value = value;
            this.listeners.forEach(l => l(value));
        }
    }

    // Note: return unsubscribe function: () => void
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        }
    }
}
