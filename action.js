var ACTION_TYPE = {
    'HARVESTER':1,
    'UPGRADER':2,
    'BUILDER':3
}

class Action {
    constructor() {
        this.level = 0
    }

    start(role){

    }

    run(creep) {
        if(!this.done()){
            this.work()
        }
        this.refresh()
    }

    work(){

    }

    done(){
        this.status = 3
    }

    refresh(){
    }
}

class GetEngineAction extends Action {
    constructor(target) {
        super()
        this.target = target
        this.status = 0 // 0-创建，1-执行中，2-完成
    }
    
    start(creep){
        if (this.status == 0) {
            this.status = 1
            this.creep = creep
            return true
        } else {
            return false
        }
    }

    work(){
        var creep = this.creep
        var source = this.target
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    }

    refresh(){
        var creep = this.creep
        var store = target.store
        var targetEnergy
        if (store == null) {
            targetEnergy = target.energy
        } else {
            targetEnergy = store.energy
        }

        if (creep.carry.energy < creep.carryCapacity && targetEnergy > 0) {
            return false
        } else {
            this.status = 2
            return true
        }
    }
}

class TransferEngineAction extends Action {
    constructor(target) {
        super()
        this.target = target
        this.status = 0 // 0-创建，1-执行中，2-完成
    }
    
    start(creep){
        if (this.status == 0) {
            this.status = 1
            this.creep = creep
            return true
        } else {
            return false
        }
    }

    work(){
        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }

    refresh(){
        var creep = this.creep
        var store = target.store

        if (store.getFreeCapacity(RESOURCE_ENERGY) > 0 && creep.store[RESOURCE_ENERGY] > 0) {
            return false
        } else {
            this.status = 2
            return true
        }
    }
}