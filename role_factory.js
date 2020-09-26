const { initial, filter } = require('lodash');
var roleConfig = require('role_config');
var roleClass = require('role');
var utils = require('utils');

class RoleFactor{
    constructor(spawn){
        this.ROLE_MAP = new Map()
        this.spawn = spawn
    }

    init(){
        this.initByMemory()
        this.checkAndBuildRole()
    }

    initByMemory(){
        var spawn = this.spawn
        for(name in Game.creeps){
            var creep = Game.creeps[name]
            var role = this.assembleToRole(creep, spawn)
            this.ROLE_MAP[name] = role
            // console.log("RoleFactor - initByMemory", name)
        }
        var towers = spawn.room.find(FIND_MY_STRUCTURES, {
            filter: function(obj) {
                return obj.structureType == STRUCTURE_TOWER
            }
        })
        for(var index in towers){
            var tower = towers[index]
            var role = this.assembleToTower(tower)
            this.ROLE_MAP[tower.id] = role
            // console.log("RoleFactor - initByMemory", name)
        }
    }

    assembleToRole(creep, spawn){
        var role
        if (creep.memory.type == 1){
            role = roleClass.buildHarvester(creep)
        } else if (creep.memory.type == 2){
            role = roleClass.buildUpgrader(creep)
        } else if (creep.memory.type == 3){
            role = roleClass.buildCollector(creep)
        } else if (creep.memory.type == 4){
            role = roleClass.buildRepair(creep)
        } else if (creep.memory.type == 5){
            role = roleClass.buildMover(creep, null, null)
        } else if (creep.memory.type == 10){
            role = roleClass.buildPreDestory(creep)
        } else {
            console.log("assembleToRole failed", creep.name)
            role = new CreepPreDestory(creep)
            // return null
        }
        return role
    }


    assembleToTower(tower){
        var role = roleClass.buildTower(tower)
        return role
    }

    buildRole(config){
        var spawn = this.spawn
        // console.log(spawn.spawning, spawn.room.energyAvailable, config.buildEnergy)
        if (spawn.room.energyAvailable >= config.buildEnergy) {
            if (spawn.spawning == null ){
                var name = utils.randomString(5)
                var fullName = config.prefix + "-" + name
                spawn.spawnCreep(
                    config.body,
                    fullName,
                    {
                        memory:{
                            type:config.type
                        }
                    }
                );
                console.log("buildRole", fullName)
                return true
            } else {
                console.log("buildRole - spawn spawning", spawn.spawning.name)
            }   
        }
        return false
    }

    
    countRole(type) {
        var res = 0
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.type == type){
                res = res+1
            }
        }
        return res
    }

    checkAndBuildRole(){
        var entries = Object.entries(roleConfig.ROLE_CONFIG)
        entries = entries.sort(function(a,b){
            return b[1].level - a[1].level}
        )
        var key,value
        // console.log(entries)
        for ([key, value] of entries){
            var config = value
            // console.log(value)
            var count = this.countRole(config.type)
            // console.log("minSize", config.sizeRange.min, count)
            if(config.sizeRange.min > count && this.buildRole(config)){
                return
            }
        }
        for ([key, value] of entries){
            var config = value
            // console.log(value)
            var count = this.countRole(config.type)
            // console.log("maxSize", config.sizeRange.min, count)
            if(config.sizeRange.max > count && this.buildRole(config)){
                return
            }
        }
    }
}


// function assembleToRole(creep){
//     if (creep.memory.type == 1){
//         role = new roleClass.CreepHarvester(creep)
//     } else if (creep.memory.type == 2){
//         role = new roleClass.CreepUpgrader(creep)
//     } else if (creep.memory.type == 3){
//         role = new roleClass.CreepMover(creep, spawn)
//     } else if (creep.memory.type == 10){
//         role = new roleClass.CreepPreDestory(creep)
//     } else {
//         console.log("assembleToRole failed", creep.name)
//         role = new roleClass.CreepPreDestory(creep)
//         // return null
//     }
//     return role
// }

// function 

// function 

module.exports  = {
    run: function(spawn){
        var factor = new RoleFactor(spawn)
        factor.init()
        return factor
    },
}