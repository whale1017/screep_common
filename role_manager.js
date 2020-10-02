const { initial, filter } = require('lodash');
var roleConfig = require('role_config');
const { CreepHarvester, CreepUpgrader, CreepCollector, CreepRepair, CreepAttacker, CreepMover, CreepPreDestory, TowerRole } = require('role');
const { RoleFactor } = require('role_factory');

class RoleManager{
    constructor(spawn){
        this.ROLE_MAP = new Map()
        this.spawn = spawn
        this.roleFactor = new RoleFactor(spawn)
        this.init()
    }

    init(){
        this.initByMemory()
        this.checkAndBuildRole()
    }

    // 内存加载 role
    initByMemory(){
        var spawn = this.spawn
        for(const name in Game.creeps){
            var creep = Game.creeps[name]
            var role = this.assembleToRole(creep, spawn)
            this.ROLE_MAP[name] = role
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
        }

    }
    
    // creep => role 转换
    assembleToRole(creep, spawn){
        var role
        if (creep.memory.type == 1 || creep.memory.type == 10 || creep.memory.type == 1000){
            role = new CreepHarvester(creep)
            // role = roleClass.buildHarvester(creep)
        } else if (creep.memory.type == 2 || creep.memory.type == 20 || creep.memory.type == 2000){
            // role = roleClass.buildUpgrader(creep)
            role = new CreepUpgrader(creep)
        } else if (creep.memory.type == 3 || creep.memory.type == 30 || creep.memory.type == 3000){
            // role = roleClass.buildCollector(creep)
            role = new CreepCollector(creep)
        } else if (creep.memory.type == 4 || creep.memory.type == 40 || creep.memory.type == 4000){
            // role = roleClass.buildRepair(creep)
            role = new CreepRepair(creep)
        } else if (creep.memory.type == 5 || creep.memory.type == 50 || creep.memory.type == 5000){
            // role = roleClass.buildMover(creep, null, null)
            role = new CreepMover(creep, null, null)
        } else if (creep.memory.type == 999){
            // role = roleClass.buildAttacker(creep)
            role = new CreepAttacker(creep)
        } else if (creep.memory.type == 0){
            // role = roleClass.buildPreDestory(creep)
            role = new CreepPreDestory(creep)
        } else {
            console.log("assembleToRole failed", creep.name)
            role = new CreepPreDestory(creep)
            // return null
        }
        return role
    }

    // tower => role 转换
    assembleToTower(tower){
        var role = new TowerRole(tower)
        return role
    }
    
    // creep role 计数
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

    // 检测creep配置，并新生成 creep
    checkAndBuildRole(){
        var factory = this.roleFactor
        var entries = Object.entries(roleConfig.ROLE_CONFIG)
        entries = entries.sort(function(a,b){
            return b[1].level - a[1].level}
        )
        var key,value
        for ([key, value] of entries){
            var config = value
            var count = this.countRole(config.type)
            if(config.sizeRange.min > count && factory.buildRole(config)){
                return
            }
        }
        for ([key, value] of entries){
            var config = value
            // console.log(value)
            var count = this.countRole(config.type)
            // console.log("maxSize", config.sizeRange.min, count)
            if(config.sizeRange.max > count && factory.buildRole(config)){
                return
            }
        }
    }
}

module.exports  = {
    RoleManager,
}