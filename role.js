const { map } = require("lodash")
var utils = require('utils');

var ROLE_TYPE = {
    HARVESTER:1,
    UPGRADER:2,
    MOVER:3
}


class CreepRole {
    constructor(creep) {
        this.creep = creep
    }
    run() {
        console.log("CreepRole run, name:", this.creep.name)
    }
}

class CreepHarvester extends CreepRole {
    constructor(creep) {
        super(creep)
    }
    run() {
        var creep = this.creep
        // console.log("CreepHarvester run", creep.name)
        // console.log("CreepRepair run", creep.name, JSON.stringify(target))
        var sources = creep.room.find(FIND_SOURCES);
        sources.sort()
        var souceId = Math.abs(utils.getHashCode(creep.name) % 2)
        var source = sources[1-souceId]
        if (creep.carry.energy < creep.carryCapacity) {
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {

                console.log("CreepHarvester run, ", creep.name, "move to", source.pos)
                creep.moveTo(source);
            }
        } else {
            creep.drop(RESOURCE_ENERGY);
        }
    }


    containersWithEnergy(){
        const containersWithEnergy = this.creep.room.find(FIND_STRUCTURES, 
            {
                filter: (i) => i.structureType == STRUCTURE_CONTAINER //&& i.store[RESOURCE_ENERGY] > 0
            }
        )
            ;
        return containersWithEnergy
    }
}

class CreepUpgrader extends CreepRole {
    constructor(creep) {
        super(creep)
    }
    run() {
        var creep = this.creep
        // console.log("CreepUpgrader run", creep.name)

        var store = creep.store


        if (store.energy == 0) {

            const targetEnergy = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            if(targetEnergy) {
                if(creep.pickup(targetEnergy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetEnergy);
                }
            }
    
        } else if (store.energy >= store.getCapacity()) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
    
                creep.moveTo(creep.room.controller);
    
            }
        } else {
    
            //对控制器进行升级，如果不在范围则向控制器移动
            if (creep.upgradeController(creep.room.controller) != ERR_NOT_IN_RANGE) {
                return;
            }
    
            const targetEnergy = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            if(targetEnergy) {
                if(creep.pickup(targetEnergy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetEnergy);
                    return
                }
            }

            creep.moveTo(creep.room.controller);    
        }
    }
}

class CreepRepair extends CreepRole {
    constructor(creep) {
        super(creep)
    }
    run() {
        var creep = this.creep
        // console.log("CreepRepair run", creep.name)
        var target = this.containersWithEnergy()[0]
        // console.log("CreepRepair run", creep.name, JSON.stringify(target))
        var sources = creep.room.find(FIND_SOURCES);
        var source = sources[0]
        if (creep.carry.energy < creep.carryCapacity) {
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        } else {
            if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
}


class CreepMover extends CreepRole {
    constructor(creep, target) {
        super(creep)
        this.target = target
    }
    run() {
        var creep = this.creep
        // console.log("CreepRepair run", creep.name)
        var target = this.target
        var store = creep.store
        if (store.energy < store.getCapacity()) {
            const targetEnergy = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            if(targetEnergy) {
                if(creep.pickup(targetEnergy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetEnergy);
                }
            }
        } else {
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
}


class CreepPreDestory extends CreepRole {
    constructor(creep) {
        super(creep)
    }
    run() {
        var creep = this.creep
        // console.log("CreepRepair run", creep.name)
        var spawn = Game.spawns['Spawn1']

        if (spawn.recycleCreep(creep) == ERR_NOT_IN_RANGE) {
            creep.moveTo(spawn)
        }
    }
}


module.exports  = {
    buildRole: function (creep, spawn){
        if (creep.memory.type == 1){
            role = new CreepHarvester(creep)
        } else if (creep.memory.type == 2){
            role = new CreepUpgrader(creep)
        } else if (creep.memory.type == 3){
            role = new CreepMover(creep, spawn)
        } else if (creep.memory.type == 10){
            role = new CreepPreDestory(creep)
        } else {
            console.log("assembleToRole failed", creep.name)
            role = new CreepPreDestory(creep)
            // return null
        }
        return role
    }
}
