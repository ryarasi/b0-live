import crypto from 'crypto';

class Block {
    constructor(index, timestamp, claims, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.claims = claims;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    
    calculateHash() {
        const data = this.index + this.timestamp + JSON.stringify(this.claims) + this.previousHash + this.nonce;
        if (typeof window !== 'undefined') {
            // Browser environment - use Web Crypto API
            return this.browserHash(data);
        }
        // Node.js environment
        return crypto.createHash('sha256').update(data).digest('hex');
    }
    
    async browserHash(data) {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }
    
    toObject() {
        return {
            index: this.index,
            timestamp: this.timestamp,
            claims: this.claims,
            previousHash: this.previousHash,
            hash: this.hash,
            nonce: this.nonce
        };
    }
    
    static fromObject(obj) {
        const block = new Block(obj.index, obj.timestamp, obj.claims, obj.previousHash);
        block.hash = obj.hash;
        block.nonce = obj.nonce;
        return block;
    }
}

export default Block;