class RateLimiter {
    constructor(maxRequests = 5, timeWindow = 1000) {
        this.maxRequests = maxRequests;
        this.timeWindow = timeWindow;
        this.requests = [];
    }

    async waitForSlot() {
        const now = Date.now();
        
        // Remove old requests outside the time window
        this.requests = this.requests.filter(time => now - time < this.timeWindow);
        
        // If we've hit the limit, wait until the oldest request expires
        if (this.requests.length >= this.maxRequests) {
            const oldestRequest = this.requests[0];
            const waitTime = this.timeWindow - (now - oldestRequest);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            return this.waitForSlot();
        }
        
        // Add current request
        this.requests.push(now);
    }
}

export const rateLimiter = new RateLimiter(5, 1000); // 5 requests per second 