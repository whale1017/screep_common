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
        this.isSay = false
    }
    run() {
        console.log("CreepRole run, name:", this.creep.name)
    }

    changeStatus(status){
        this.status = status
        this.creep.memory.status = status
    }

    creepSay(content){
        if(this.isSay){
            this.creep.say(content)
        }
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
        if (creep.room.controller.level > 6){
            return
        }
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
            this.creepSay('empty')
            this.changeStatus(1)
        } else if (store.energy == store.getCapacity()) {
            this.creepSay('full')
            this.changeStatus(2)
        } else {
            this.creepSay(store.energy + '/' + store.getCapacity())
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
        this.creepSay("error")
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
        var store = creep.store


        if(this.status == 0){
            this.changeStatus(1)
        }

        if(store.energy == 0){
            this.creepSay('empty')
            this.changeStatus(1)
        } else if (store.energy == store.getCapacity()) {
            this.creepSay('full')
            this.changeStatus(2)
        } else {
            this.creepSay(store.energy + '/' + store.getCapacity())
        }


        
        const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);

        if (this.status == 1) {

            var containers = this.containersWithEnergy()
            var index = Math.abs(utils.getHashCode(creep.name) % containers.length)
            var from = containers[index]
            console.log("CreepRepair run", containers.length)
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
                filter: (i) => (i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE) && i.store[RESOURCE_ENERGY] > 0
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

            // var targetEnergy = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,
            //     {
            //         filter: function(obj) {
            //             return obj.resourceType == RESOURCE_ENERGY// && obj.amount > 50
            //         }
            //     });
            var targetEnergy = null
            var targetEnergyList = creep.room.find(FIND_DROPPED_RESOURCES, 
                {
                    filter: function(obj) {
                        return obj.resourceType == RESOURCE_ENERGY
                    }
                })
            if (targetEnergyList.length > 0) {
                targetEnergyList = targetEnergyList.sort((a,b) => b.amount - a.amount)
                targetEnergy = targetEnergyList[0]
            }
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
                
                filter: (i) => {
                    return (i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE) && i.store[RESOURCE_ENERGY] < i.store.getCapacity()
                }
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
            this.creepSay('empty')
            this.changeStatus(1)
        } else if (store.energy == store.getCapacity()) {
            this.creepSay('full')
            this.changeStatus(2)
        } else {
            this.creepSay(store.energy + '/' + store.getCapacity())
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
                filter: (i) => (i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE) && i.store[RESOURCE_ENERGY] > 0
            }
        );
        return containersWithEnergy
    }

    getTargetList(creep){
        var target = null

        target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
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


        // target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
        //     filter: function(object) {
        //         // if ((object.structureType == STRUCTURE_EXTENSION || object.structureType == STRUCTURE_SPAWN)){
        //         //     console.log(object.name, object.structureType, object.store.energy, object.store.getCapacity(RESOURCE_ENERGY))
        //         // }
        //         return (
        //             object.structureType == STRUCTURE_TOWER
        //             ) 
        //             && object.store.getFreeCapacity(RESOURCE_ENERGY) > 0 //object.store.energy < object.store.getCapacity();
        //     }
        // });
        // if (target != null){
        //     return target
        // }

        var targetList = creep.room.find(FIND_MY_STRUCTURES, {
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
        targetList = targetList.sort()
        if (targetList.length <= 0){
            return target
        }
        
        var targetId = Math.abs(utils.getHashCode(creep.name) % targetList.length)
        return targetList[targetId]
    }
}



class CreepAttacker extends CreepRole {
    constructor(creep) {
        super(creep)
        var memStatus = creep.memory.status
        if (memStatus == null){
            creep.memory.status = 0 // 0-初始， 1-获取， 2-放置
        }
        this.status = creep.memory.status
        // console.log(JSON.stringify(creep.memory.config))
        this.targetRoomName = creep.memory.targetRoomName
    }
    run() {
        var creep = this.creep
        var targetRoomName = this.targetRoomName

        if(creep.room.name != targetRoomName) {
            // console.log("CreepAttacker run", creep.room.name, targetRoomName, creep.room.name != targetRoomName)
            const exitDir = Game.map.findExit(creep.room, targetRoomName);
            const exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit);
            return
        } else {
            var attackTarget = this.getAttackTarget()
            if (attackTarget) {
                var res = creep.attack(attackTarget)
                // console.log("CreepAttacker run", attackTarget, res)
                if(res == ERR_NOT_IN_RANGE){
                    creep.moveTo(attackTarget)
                } else if(res == OK){
                    // return
                }
                res = creep.rangedAttack(attackTarget)
                if(res == ERR_NOT_IN_RANGE){
                    creep.moveTo(attackTarget)
                } else if(res == OK){
                    // return
                }
                return
            }

            if (creep.hits < creep.hitsMax) {
                creep.heal(creep)
                return
            }
        }
    }

    getAttackTarget(){
        var target = null

        targetStruct = this.creep.room.find(FIND_STRUCTURES,
            {
                filter: (structure) => !structure.my && structure.structureType == STRUCTURE_SPAWN
            })
        if (targetStruct != null){
            target = targetStruct
            return target
        }

        var targetCreep = this.creep.pos.findClosestByRange(FIND_CREEPS,
            {
                filter: (creep) => !creep.my
            })
        if (targetCreep != null){
            target = targetCreep
            return target
        }

        targetList = this.creep.pos.findClosestByRange(FIND_STRUCTURES,
            {
                filter: (structure) => !structure.my && structure.structureType != STRUCTURE_CONTROLLER
            })
        if (targetList.length > 0){
            target = targetList[0]
            return target
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

class TowerRole {
    constructor(tower) {
        this.tower = tower
    }
    run() {
        var attackTarget = this.getAttackTarget()
        // console.log(attackTarget)
        if (attackTarget) {
            this.tower.attack(attackTarget)
            return
        }

        if(this.tower.store[RESOURCE_ENERGY] < this.tower.store.getCapacity(RESOURCE_ENERGY) / 2){
            return
        }
        const targets = this.tower.room.find(FIND_STRUCTURES, {
            filter: object => (object.hits < object.hitsMax && object.hits < 1*1000*1000 && object.structureType)
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
        var target = null
        var targetList = this.tower.room.find(FIND_CREEPS,
            {
                filter: (creep) => !creep.my
            })
        if (targetList.length > 0){
            target = targetList[0]
        }
        return target
    }
}

module.exports  = {
    // buildHarvester: function(creep){return new CreepHarvester(creep)},
    // buildUpgrader: function(creep){return new CreepUpgrader(creep)},
    // buildCollector: function(creep, target){return new CreepCollector(creep, target)},
    // buildRepair: function(creep){return new CreepRepair(creep)},
    // buildPreDestory: function(creep) {return new CreepPreDestory(creep)},
    // buildMover: function(creep, from, target){return new CreepMover(creep, from, target)},
    // buildAttacker: function(creep){return new CreepAttacker(creep)},
    // buildTower: function(tower){return new TowerRole(tower)},

    CreepHarvester,
    CreepUpgrader,
    CreepCollector,
    CreepRepair,
    CreepPreDestory,
    CreepMover,
    CreepAttacker,
    TowerRole,
}
