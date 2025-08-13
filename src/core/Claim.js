class Claim {
    constructor(index, agent, claimText) {
        if (claimText.length > 250) {
            throw new Error('Claim cannot exceed 250 characters');
        }
        
        this.index = index;
        this.datetime = new Date().toISOString();
        this.agent = agent;
        this.claim = claimText;
    }
    
    toObject() {
        return {
            index: this.index,
            datetime: this.datetime,
            agent: this.agent,
            claim: this.claim
        };
    }
    
    static fromObject(obj) {
        const claim = new Claim(obj.index, obj.agent, obj.claim);
        claim.datetime = obj.datetime;
        return claim;
    }
}

export default Claim;