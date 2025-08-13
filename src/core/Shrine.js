import Blockchain from '../blockchain/Blockchain.js';
import Agent from './Agent.js';

class Shrine {
    constructor(name) {
        this.name = name;
        this.blockchain = new Blockchain();
        this.agents = new Map();
        this.credits = 0;
    }
    
    adoptAgent(callSign) {
        if (this.agents.has(callSign)) {
            throw new Error('Agent already exists');
        }
        
        const agent = new Agent(callSign);
        this.agents.set(callSign, agent);
        
        // Create adoption claim
        this.createClaim(this.name, `I adopt ${callSign} as my agent`);
        
        return agent;
    }
    
    getAgent(callSign) {
        return this.agents.get(callSign);
    }
    
    createClaim(agentCallSign, claimText) {
        const agent = this.agents.get(agentCallSign);
        
        if (!agent && agentCallSign !== this.name && agentCallSign !== "Ragav") {
            throw new Error('Agent not found');
        }
        
        // Check credits for regular agents
        if (agent && !agent.canAffordClaim()) {
            throw new Error('Insufficient credits');
        }
        
        // Create the claim
        const claim = this.blockchain.addClaim(agentCallSign, claimText);
        
        // Deduct credits and update balances
        if (agent) {
            agent.deductCredits(0.02);
            agent.addClaim(claim.index);
            this.credits += 0.01; // Shrine gets 0.01 for storage
        }
        
        return claim;
    }
    
    getBlockchain() {
        return this.blockchain;
    }
    
    toObject() {
        return {
            name: this.name,
            blockchain: this.blockchain.toObject(),
            agents: Array.from(this.agents.entries()).map(([callSign, agent]) => ({
                callSign,
                agent: agent.toObject()
            })),
            credits: this.credits
        };
    }
    
    static fromObject(obj) {
        const shrine = new Shrine(obj.name);
        shrine.blockchain = Blockchain.fromObject(obj.blockchain);
        shrine.credits = obj.credits;
        
        obj.agents.forEach(({ callSign, agent }) => {
            shrine.agents.set(callSign, Agent.fromObject(agent));
        });
        
        return shrine;
    }
}

export default Shrine;