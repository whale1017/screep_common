const { map } = require("lodash")

var ROLE_TYPE = {
    'HARVESTER':1,
    'UPGRADER':2,
    'BUILDER':3
}

module.exports  = {
    buildRole: function(creep) {
        var role
        if (creep.memory.type == 1){
            role = new CreepHarvester(creep)
        } else if (creep.memory.type == 2){
            role = new CreepUpgrader(creep)
        }
        return role
    },
    ROLE_TYPE: ROLE_TYPE,
    count: function(type) {
        var res = 0
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.type == type){
                res = res+1
            }
        }
        return res
    }
}

class CreepRole {
    constructor(creep) {
        this.creep = creep
    }
    
    isFree(){
        var memoryActions = this.creep.memory.actions
        return memoryActions == null || memoryActions.length==0
    }

    addAction(actions){
        var memoryActions = this.creep.memory.actions
        if (memoryActions == null){
            this.creep.memory.actions = []
        }
        for (action in actions) {
            this.creep.memory.actions.push(action)
        }
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

        action.run()

        var source = sources[0]
        
        var action = new GetEngineAction(source)

        action.start(creep)
        action.run()
        if (action.done()) {

        }
        var creep = this.creep
        

        // console.log("CreepHarvester run", creep.name)
        if (creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        } else {
            if (creep.transfer(Game.spawns['Hom'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Hom']);
            }
        }
    }
}

class CreepUpgrader extends CreepRole {
    constructor(creep) {
        super(creep)
    }
    run() {
        var creep = this.creep
        // console.log("CreepUpgrader run", creep.name)
        var sourceId = 1
        if (creep.carry.energy == 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[sourceId]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[sourceId]);
            }
        }
        else if (creep.carry.energy >= 50) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    
        else {
    
            //对控制器进行升级，如果不在范围则向控制器移动
            if (creep.upgradeController(creep.room.controller) != ERR_NOT_IN_RANGE) {
                return;
            }
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[sourceId]) != ERR_NOT_IN_RANGE) {
                return;
            }
            creep.moveTo(creep.room.controller);
        }
    }
}

class CreepBuilder extends CreepRole {
    constructor(creep) {
        super(creep)
    }
    run() {
        var creep = this.creep
        console.log("CreepBuilder run", creep.name)
        if (creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
            if (creep.transfer(Game.spawns['Hom'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Hom']);
            }
        }
    }
}
