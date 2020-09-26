const { initial } = require('lodash');
var roleConfig = require('role_config');
var roleClass = require('role');
var utils = require('utils');

var spawn = Game.spawns['Spawn1']

function countRole(type) {
    var res = 0
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.type == type){
            res = res+1
        }
    }
    return res
}

var ROLE_MAP = new Map()

function init(){
    initByMemory()
    checkAndBuildRole()
}

function initByMemory(){
    for(name in Game.creeps){
        if(ROLE_MAP[name]){
            break
        }

        var creep = Game.creeps[name]
        role = roleClass.buildRole(creep, spawn)
        ROLE_MAP[name] = role
    }

    for(name in ROLE_MAP){
        if(!Game.creeps[name]){
            delete ROLE_MAP[name]
        }
    }
    
}

function assembleToRole(creep){
    if (creep.memory.type == 1){
        role = new roleClass.CreepHarvester(creep)
    } else if (creep.memory.type == 2){
        role = new roleClass.CreepUpgrader(creep)
    } else if (creep.memory.type == 3){
        role = new roleClass.CreepMover(creep, spawn)
    } else if (creep.memory.type == 10){
        role = new roleClass.CreepPreDestory(creep)
    } else {
        console.log("assembleToRole failed", creep.name)
        role = new roleClass.CreepPreDestory(creep)
        // return null
    }
    return role
}

function buildRole(config){
    // console.log(spawn.spawning, spawn.room.energyAvailable, config.buildEnergy)
    if (spawn.spawning == null && spawn.room.energyAvailable >= config.buildEnergy) {
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
    }
    return false
}

function checkAndBuildRole(){
    
    if(spawn.spawning != null){
        return
    }

    var entries = Object.entries(roleConfig.ROLE_CONFIG)

    entries.sort(function(a,b){a[1].type - b[1].type})
    
    for ([key, value] of entries){
        var config = value
        // console.log(value)
        var count = countRole(config.type)
        // console.log(config.sizeRange.min, count)
        if(config.sizeRange.min > count && buildRole(config)){
            return
        }
    }

    for ([key, value] of entries){
        var config = value
        // console.log(value)
        var count = countRole(config.type)
        // console.log(config.sizeRange.min, count)
        if(config.sizeRange.max > count && buildRole(config)){
            return
        }
    }
}

module.exports  = {
    run: function(){init()},
    ROLE_MAP: ROLE_MAP,
}