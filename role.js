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

    changeStatus(status){
        this.status = status
        this.creep.memory.status = status
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
        var sources = creep.room.find(FIND_SOURCES_ACTIVE);
        sources = sources.sort()
        var souceId = Math.abs(utils.getHashCode(creep.name) % sources.length)
        var source = sources[souceId]
        var res = creep.harvest(source)
        if (res == ERR_NOT_IN_RANGE) {
            // console.log("CreepHarvester run, ", creep.name, "move to", source.pos)
            creep.moveTo(source);
        }
    }

}

class CreepUpgrader extends CreepRole {
    constructor(creep) {
        super(creep)

        var memStatus = creep.memory.status
        if (memStatus == null){
            creep.memory.status = 0 // 0-初始， 1-获取， 2-工作
        }
        this.status = creep.memory.status  
    }
    run() {
        var creep = this.creep
        // console.log("CreepUpgrader run", creep.name)

        var done = false
        var store = creep.store
        // if (store.energy == 0) {

        //     var containers = this.containersWithEnergy()
        //     var index = Math.abs(utils.getHashCode(creep.name) % containers.length)
        //     var from = containers[index]
        //     if(from) {
        //         if(creep.withdraw(from, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        //             creep.moveTo(from);
        //         }
        //         done = true
        //     }
        // } else {
        //     if (store.energy < store.getCapacity()) {
        //         var containers = this.containersWithEnergy()
        //         var index = Math.abs(utils.getHashCode(creep.name) % containers.length)
        //         var from = containers[index]
        //         if(from) {
        //             var res = creep.withdraw(from, RESOURCE_ENERGY)
        //             // console.log(res)
        //             if(res == OK) {
        //                 done = true
        //                 return
        //             }
        //         }
        //     }
            
        //     if (creep.upgradeController(creep.room.controller) != ERR_NOT_IN_RANGE) {
        //         done = true
        //         return
        //     } else {
        //         creep.moveTo(creep.room.controller)
        //         done = true
        //     }

        // }
        
        if(this.status == 0){
            this.changeStatus(1)
        }

        if(store.energy == 0){
            creep.say('empty')
            this.changeStatus(1)
        } else if (store.energy == store.getCapacity()) {
            creep.say('full')
            this.changeStatus(2)
        } else {
            creep.say(store.energy + '/' + store.getCapacity())
        }

        if (this.status == 1){
            var containers = this.containersWithEnergy()
            var index = Math.abs(utils.getHashCode(creep.name) % containers.length)
            var from = containers[index]
            if(from) {
                if(creep.withdraw(from, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(from);
                    return
                }
            }
        } else if (this.status == 2){
            
            var res = creep.upgradeController(creep.room.controller)
            if (res == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller)
                return;
            } else if (res == OK) {
                return
            }
        }
        creep.say("error")
    }


    containersWithEnergy(){
        const containersWithEnergy = this.creep.room.find(FIND_STRUCTURES, 
            {
                filter: (i) => i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] > 0
            }
        );
        return containersWithEnergy
    }
}

class CreepRepair extends CreepRole {
    constructor(creep) {
        super(creep)

        var memStatus = creep.memory.status
        if (memStatus == null){
            creep.memory.status = 0 // 0-初始， 1-获取， 2-工作
        }
        this.status = creep.memory.status  
    }
    run() {
        var creep = this.creep
        // console.log("CreepRepair run", creep.name)
        var store = creep.store


        if(this.status == 0){
            this.changeStatus(1)
        }

        if(store.energy == 0){
            creep.say('empty')
            this.changeStatus(1)
        } else if (store.energy == store.getCapacity()) {
            creep.say('full')
            this.changeStatus(2)
        } else {
            creep.say(store.energy + '/' + store.getCapacity())
        }


        
        const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);

        if (this.status == 1) {

            var containers = this.containersWithEnergy()
            var index = Math.abs(utils.getHashCode(creep.name) % containers.length)
            var from = containers[index]
            if(from) {
                var res = creep.withdraw(from, RESOURCE_ENERGY)
                if(res == ERR_NOT_IN_RANGE) {
                    creep.moveTo(from);
                    return
                } else if (res == OK) {
                    return
                }
            }
        } else if (this.status == 2) {
            if (target) {
                var res = creep.build(target)
                if (res == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target)
                    return;
                } else if (res == OK) {
                    return
                }
            }

            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax
            });

            targets.sort((a,b) => a.hits - b.hits);
            if(targets.length > 0) {
                var res = creep.repair(targets[0])
                if(res == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0])
                    return
                } else if (res == OK) {
                    return
                }
            }
        }
        creep.moveTo(36, 8)
    }

    containersWithEnergy(){
        const containersWithEnergy = this.creep.room.find(FIND_STRUCTURES, 
            {
                filter: (i) => i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] > 0
            }
        );
        return containersWithEnergy
    }
    
}


class CreepCollector extends CreepRole {
    constructor(creep, target) {
        super(creep)
        this.target = target
    }
    run() {
        var creep = this.creep
        // console.log("CreepRepair run", creep.name)
        var target
        if (this.target != null) {
            target = this.target
        } else {
            var containers = this.containersWithEnergy()
            var index = Math.abs(utils.getHashCode(creep.name) % containers.length)
            target = containers[index]
        }

        var store = creep.store
        if (store.energy < store.getCapacity()) {
            const targetEnergy = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,
                {
                    filter: function(obj) {
                        return obj.resourceType == RESOURCE_ENERGY// && obj.amount > 50
                    }
                });
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

    getTargetEnergy(creep){
        var resources = creep.room.find(FIND_DROPPED_RESOURCES,{
            filter: function(obj) {
                return obj.resourceType == RESOURCE_ENERGY //&& obj.amount > 50
            }
        });

        resourceScoreMap = new Map()
        for (var index in resources) {
            var resource = resources[index]
            var pathCount = creep.pos.findPathTo(resource).length
            var score = resources.amount/pathCount
            resourceSco
        }
        resources

        
        creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,
            {
                filter: function(obj) {
                    return obj.resourceType == RESOURCE_ENERGY && obj.amount > 50
                }
            });
    }

    containersWithEnergy(){
        const containersWithEnergy = this.creep.room.find(FIND_STRUCTURES, 
            {
                filter: (i) => i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE && i.store[RESOURCE_ENERGY] < i.store.getCapacity()
            }
        );
        return containersWithEnergy
    }
}


class CreepMover extends CreepRole {
    constructor(creep, from, target) {
        super(creep)
        var memStatus = creep.memory.status
        if (memStatus == null){
            creep.memory.status = 0 // 0-初始， 1-获取， 2-放置
        }
        this.status = creep.memory.status  
        this.from = from
        this.target = target
    }
    run() {
        var creep = this.creep
        // console.log("CreepRepair run", creep.name)
        var from
        if (this.from != null) {
            from = this.from
        } else {
            var containers = this.containersWithEnergy()
            var index = Math.abs(utils.getHashCode(creep.name) % containers.length)
            from = containers[index]
        }

        var store = creep.store
        if(this.status == 0){
            this.changeStatus(1)
        }

        if(store.energy == 0){
            creep.say('empty')
            this.changeStatus(1)
        } else if (store.energy == store.getCapacity()) {
            creep.say('full')
            this.changeStatus(2)
        } else {
            creep.say(store.energy + '/' + store.getCapacity())
        }



        if (this.status == 1) {
            if(creep.withdraw(from, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(from);
            }
        } else if(this.status == 2) {
            var target
            if (this.target != null) {
                target = this.target
            } else {
                target = this.getTargetList(creep)
            }
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }

    containersWithEnergy(){
        const containersWithEnergy = this.creep.room.find(FIND_STRUCTURES, 
            {
                filter: (i) => i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] > 0
            }
        );
        return containersWithEnergy
    }

    getTargetList(creep){
        var target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: function(object) {
                // if ((object.structureType == STRUCTURE_EXTENSION || object.structureType == STRUCTURE_SPAWN)){
                //     console.log(object.name, object.structureType, object.store.energy, object.store.getCapacity(RESOURCE_ENERGY))
                // }
                return (object.structureType == STRUCTURE_EXTENSION 
                    || object.structureType == STRUCTURE_SPAWN 
                    // || object.structureType == STRUCTURE_TOWER
                    ) 
                    && object.store.getFreeCapacity(RESOURCE_ENERGY) > 0 //object.store.energy < object.store.getCapacity();
            }
        });
        if (target != null){
            return target
        }

        target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: function(object) {
                // if ((object.structureType == STRUCTURE_EXTENSION || object.structureType == STRUCTURE_SPAWN)){
                //     console.log(object.name, object.structureType, object.store.energy, object.store.getCapacity(RESOURCE_ENERGY))
                // }
                return (
                    object.structureType == STRUCTURE_TOWER
                    ) 
                    && object.store.getFreeCapacity(RESOURCE_ENERGY) > 0 //object.store.energy < object.store.getCapacity();
            }
        });

        return target
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

class TowerRole {
    constructor(tower) {
        this.tower = tower
    }
    run() {
        var attackTarget = this.getAttackTarget()
        if (attackTarget) {
            this.tower.attack(attackTarget)
            return
        }

        const targets = this.tower.room.find(FIND_STRUCTURES, {
            filter: object => object.hits < object.hitsMax
        });

        targets.sort((a,b) => a.hits - b.hits);
        if(targets.length > 0) {
            var res = this.tower.repair(targets[0])
            if(res != OK) {
                console.log("TowerRole - run repair failed")
            } else {
                return
            }
        }
    }

    getAttackTarget(){
        for(var name in Game.creeps){
            var creep = Game.creeps[name]
            if(!creep.my){
                return creep
            }
            // if (name == 'REPAIR-TmRMm') {
            //     return creep
            // }
        }
        return null
    }
}

module.exports  = {
    buildHarvester: function(creep){return new CreepHarvester(creep)},
    buildUpgrader: function(creep){return new CreepUpgrader(creep)},
    buildCollector: function(creep, target){return new CreepCollector(creep, target)},
    buildRepair: function(creep){return new CreepRepair(creep)},
    buildPreDestory: function(creep) {return new CreepPreDestory(creep)},
    buildMover: function(creep, from, target){return new CreepMover(creep, from, target)},

    buildTower: function(tower){return new TowerRole(tower)},
}
