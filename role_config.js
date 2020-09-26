    
var BODY_ENERGY = {
    'work':100,
    'move':50,
    'carry':50,
}

class RoleConfig {
    constructor(type, body, level, sizeRange, prefix){
        this.type = type
        this.body = body
        this.level = level
        this.sizeRange = sizeRange
        this.prefix = prefix
        this.buildEnergy = this.getBuildEnergy(body)
        // console.log(this.buildEnergy)
    }

    getBuildEnergy(body){
        var res = 0;
        // console.log(body)
        for(var b in body){

            // console.log(body)
            // console.log(b, body[b], BODY_ENERGY[body[b]])
            res = res + BODY_ENERGY[body[b]]
        }
        return res
    }

}

var ROLE_CONFIG = {
    HARVESTER: new RoleConfig(1, [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE], 100, {max:2, min:1}, "HARVESTER"),
    UPGRADER: new RoleConfig(2, [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], 10, {max: 6, min:1}, "UPGRADER"),
    COLLECTOR: new RoleConfig(3, [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], 90, {max: 2, min:1}, "COLLECTOR"),
    REPAIR: new RoleConfig(4, [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], 10, {max: 1, min:1}, "REPAIR"),
    MOVER: new RoleConfig(5, [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 200, {max: 2, min:1}, "MOVER"),
}

module.exports  = {
    ROLE_CONFIG: ROLE_CONFIG,
}