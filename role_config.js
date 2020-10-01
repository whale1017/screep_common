    
var BODY_ENERGY = {
    'work':100,
    'move':50,
    'carry':50,
    'attack':80,
    'ranged_attack':150,
    'heal':250,
    'tough':10,
}

class RoleConfig {
    constructor(type, bodyConfigs, level, sizeRange, prefix, config){
        this.type = type
        this.config = {}
        if (config) {
            this.config = config
        }

        var body = []
        
        // var entries = Object.entries(bodyConfig.ROLE_CONFIG)
        // entries = entries.sort(function(a,b){
        //     return b[1].level - a[1].level}
        // )
        // var key,value
        // console.log(entries)
        for (var bodyConfig of bodyConfigs){
            for(var i = 0; i < bodyConfig.count; i++){
                body.push(bodyConfig.type)
            }
        }

        console.log(body)
        this.body = body
        this.level = level
        this.sizeRange = sizeRange
        this.prefix = prefix
        this.buildEnergy = this.getBuildEnergy(body)
        console.log(this.type, this.buildEnergy)
    }

    getBuildEnergy(body){
        var res = 0;
        // console.log(body)
        for(var b in body){

            // console.log(body)
            console.log(b, body[b], BODY_ENERGY[body[b]])
            res = res + BODY_ENERGY[body[b]]
        }
        return res
    }

}

var ROLE_CONFIG = {

    // backup
    BACKUP_HARVESTER: new RoleConfig(1000, [{type:WORK, count:1}, {type:CARRY, count:0},{type:MOVE, count:1}], 1090, {max:1, min:1}, "BACKUP_HARVESTER"), 
    BACKUP_UPGRADER: new RoleConfig(2000, [{type:WORK, count:1}, {type:CARRY, count:1},{type:MOVE, count:1}], 1060, {max:1, min:1}, "BACKUP_UPGRADER"), 
    BACKUP_COLLECTOR: new RoleConfig(3000, [{type:WORK, count:0}, {type:CARRY, count:1},{type:MOVE, count:1}], 1080, {max:1, min:1}, "BACKUP_COLLECTOR"),
    BACKUP_REPAIR: new RoleConfig(4000, [{type:WORK, count:1}, {type:CARRY, count:1},{type:MOVE, count:1}], 1050, {max:1, min:0}, "BACKUP_REPAIR"),
    BACKUP_MOVER: new RoleConfig(5000, [{type:WORK, count:0}, {type:CARRY, count:1},{type:MOVE, count:1}], 1070, {max: 1, min:1}, "BACKUP_MOVER"),

    // 300
    // MINI_HARVESTER: new RoleConfig(1, [{type:WORK, count:2}, {type:CARRY, count:0},{type:MOVE, count:2}], 390, {max:2, min:1}, "MINI_HARVESTER"), 
    // MINI_UPGRADER: new RoleConfig(2, [{type:WORK, count:1}, {type:CARRY, count:2},{type:MOVE, count:2}], 360, {max:1, min:1}, "MINI_UPGRADER"), 
    // MINI_COLLECTOR: new RoleConfig(3, [{type:WORK, count:0}, {type:CARRY, count:3},{type:MOVE, count:3}], 380, {max:2, min:1}, "MINI_COLLECTOR"),
    // MINI_REPAIR: new RoleConfig(4, [{type:WORK, count:1}, {type:CARRY, count:2},{type:MOVE, count:2}], 350, {max:1, min:0}, "MINI_REPAIR"),
    // MINI_MOVER: new RoleConfig(5, [{type:WORK, count:0}, {type:CARRY, count:3},{type:MOVE, count:3}], 370, {max: 2, min:1}, "MINI_MOVER"),

    // 550
    MID_HARVESTER: new RoleConfig(10, [{type:WORK, count:4}, {type:CARRY, count:0},{type:MOVE, count:3}], 490, {max:3, min:1}, "MID_HARVESTER"), 
    MID_UPGRADER: new RoleConfig(20, [{type:WORK, count:2}, {type:CARRY, count:4},{type:MOVE, count:3}], 460, {max:6, min:1}, "MID_UPGRADER"), 
    MID_COLLECTOR: new RoleConfig(30, [{type:WORK, count:0}, {type:CARRY, count:7},{type:MOVE, count:4}], 480, {max:3, min:6}, "MID_COLLECTOR"),
    MID_REPAIR: new RoleConfig(40, [{type:WORK, count:2}, {type:CARRY, count:4},{type:MOVE, count:3}], 450, {max:1, min:0}, "MID_REPAIR"),
    MID_MOVER: new RoleConfig(50, [{type:WORK, count:0}, {type:CARRY, count:7},{type:MOVE, count:4}], 470, {max:3, min:3}, "MID_MOVER"),
    
    
    
    // HARVESTER: new RoleConfig(1, [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE], 100, {max:2, min:1}, "HARVESTER"),
    // COLLECTOR: new RoleConfig(3, [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], 90, {max: 2, min:1}, "COLLECTOR"),
    // REPAIR: new RoleConfig(4, [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], 50, {max: 1, min:0}, "REPAIR"),
    // MOVER: new RoleConfig(5, [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 200, {max: 2, min:1}, "MOVER"),

    // MINI_MOVER: new RoleConfig(6, [CARRY, MOVE], 300, {max: 2, min:1}, "MINI_MOVER"),
    // MINI_COLLECTOR: new RoleConfig(7, [CARRY, MOVE], 300, {max: 2, min:1}, "MINI_COLLECTOR"),
    // MINI_HARVESTER: new RoleConfig(8, [WORK, MOVE], 300, {max:2, min:1}, "MINI_HARVESTER"), 

    // HARVESTER: new RoleConfig(1, [{type:WORK, count:6}, {type:CARRY, count:0},{type:MOVE, count:4}], 100, {max:2, min:1}, "HARVESTER"),
    // COLLECTOR: new RoleConfig(3, [{type:WORK, count:0}, {type:CARRY, count:6},{type:MOVE, count:5}], 90, {max: 2, min:1}, "COLLECTOR"),
    // REPAIR: new RoleConfig(4, [{type:WORK, count:3}, {type:CARRY, count:2},{type:MOVE, count:3}], 50, {max: 1, min:0}, "REPAIR"),
    // MOVER: new RoleConfig(5, [{type:WORK, count:0}, {type:CARRY, count:9},{type:MOVE, count:7}], 200, {max: 2, min:1}, "MOVER"),
    
    // MINI_MOVER: new RoleConfig(6, [{type:WORK, count:0}, {type:CARRY, count:1},{type:MOVE, count:1}], 300, {max: 2, min:1}, "MINI_MOVER"),
    // MINI_COLLECTOR: new RoleConfig(7, [{type:WORK, count:0}, {type:CARRY, count:1},{type:MOVE, count:1}], 300, {max: 2, min:1}, "MINI_COLLECTOR"),
    // MINI_HARVESTER: new RoleConfig(8, [{type:WORK, count:1}, {type:CARRY, count:0},{type:MOVE, count:1}], 300, {max:2, min:1}, "MINI_HARVESTER"), 
    
    // UPGRADER: new RoleConfig(2, [{type:WORK, count:1}, {type:CARRY, count:1},{type:MOVE, count:2}], 10, {max: 2, min:1}, "UPGRADER"),
    
    // ATTACKER: new RoleConfig(100, [{type:ATTACK, count:7}, {type:RANGED_ATTACK, count:0}, {type:HEAL, count:1}, {type:TOUGH, count:4}, {type:MOVE, count:9}], 10, {max: 1, min:0}, "ATTACKER", {targetRoomName: "W7N4"}),
    // UPGRADER_MAX: new RoleConfig(2, [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], 10, {max: 1, min:1}, "UPGRADER"),
}

module.exports  = {
    ROLE_CONFIG: ROLE_CONFIG,
}