    
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
        console.log(this.buildEnergy)
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
    HARVESTER: new RoleConfig(1, [WORK, WORK, CARRY, MOVE], 100, {max:8, min:1}, "HARVESTER"),
    UPGRADER: new RoleConfig(2, [WORK, CARRY, CARRY, MOVE, MOVE], 10, {max: 20, min:0}, "UPGRADER"),
    MOVER: new RoleConfig(3, [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], 90, {max: 4, min:1}, "MOVER")
}

module.exports  = {
    ROLE_CONFIG: ROLE_CONFIG,
}