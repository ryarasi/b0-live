class Agent {
    constructor(callSign) {
        this.callSign = callSign;
        this.credits = 100; // Starting credits
        this.claims = [];
    }
    
    canAffordClaim() {
        return this.credits >= 0.02;
    }
    
    deductCredits(amount) {
        if (this.credits < amount) {
            throw new Error('Insufficient credits');
        }
        this.credits -= amount;
    }
    
    addClaim(claimId) {
        this.claims.push(claimId);
    }
    
    toObject() {
        return {
            callSign: this.callSign,
            credits: this.credits,
            claims: this.claims
        };
    }
    
    static fromObject(obj) {
        const agent = new Agent(obj.callSign);
        agent.credits = obj.credits;
        agent.claims = obj.claims || [];
        return agent;
    }
}

export default Agent;