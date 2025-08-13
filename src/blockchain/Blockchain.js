import Block from './Block.js';
import Claim from '../core/Claim.js';

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.claimIndex = 1;
    }
    
    createGenesisBlock() {
        const genesisClaim = new Claim(0, "Ragav", "I am an agent");
        return new Block(0, new Date().toISOString(), [genesisClaim.toObject()], "0");
    }
    
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    
    addClaim(agent, claimText) {
        const claim = new Claim(this.claimIndex++, agent, claimText);
        const newBlock = new Block(
            this.chain.length,
            new Date().toISOString(),
            [claim.toObject()],
            this.getLatestBlock().hash
        );
        
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
        
        return claim;
    }
    
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
    
    getAllClaims() {
        const claims = [];
        for (const block of this.chain) {
            claims.push(...block.claims);
        }
        return claims;
    }
    
    toObject() {
        return {
            chain: this.chain.map(block => block.toObject()),
            difficulty: this.difficulty,
            claimIndex: this.claimIndex
        };
    }
    
    static fromObject(obj) {
        const blockchain = new Blockchain();
        blockchain.chain = obj.chain.map(blockData => Block.fromObject(blockData));
        blockchain.difficulty = obj.difficulty;
        blockchain.claimIndex = obj.claimIndex;
        return blockchain;
    }
}

export default Blockchain;