var role = require('role');
var utils = require('utils');

module.exports.loop = function () {
    var spawn = Game.spawns['Spawn1']
    

    var sources = spawn.room.find(FIND_SOURCES);
    initMemory()
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        role.run(creep)
    }
    var harvesterSize = {'min':1, 'max':8}
    var moverSize = {'min':1, 'max':4}
    var upgraderSize = {'min':0, 'max':30}
    // var harvesterSize = 6
    if(spawn.store.energy >=300 ){

        if(spawn.spawning != null){
            return
        }

        var harvesterCount = role.count(role.ROLE_TYPE['HARVESTER'])
        var moverCount = role.count(role.ROLE_TYPE['MOVER'])
        var upgraderCount = role.count(role.ROLE_TYPE['UPGRADER'])
        // var upgraderCount = role.count(role.ROLE_TYPE['UPGRADER'])
        // console.log("harvesterCount:", harvesterCount, ", ", "upgraderCount:", upgraderCount)
        // Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, WORK, MOVE], "REPAIR-"+"3", {memory:{type:10}} );
        var name = utils.randomString(5)
        if(harvesterCount < harvesterSize.min){
            console.log("build role: harvester", harvesterCount)
            spawn.spawnCreep( [WORK, WORK, CARRY, MOVE], "HARVESTER-"+name, {
                memory:{
                    type:1
                }
            } );
            return
        } 
        if (moverCount < moverSize.min) {
            console.log("build role: mover", moverCount)
            spawn.spawnCreep( [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], "MOVER-"+name, {
                memory:{
                    type:3
                }
            } );
            return
        }

        if(harvesterCount < harvesterSize.max){
            console.log("build role: harvester", harvesterCount)
            spawn.spawnCreep( [WORK, WORK, CARRY, MOVE], "HARVESTER-"+name, {
                memory:{
                    type:1
                }
            } );
            return
        } 
        if (moverCount < moverSize.max) {
            console.log("build role: mover", moverCount)
            spawn.spawnCreep( [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], "MOVER-"+name, {
                memory:{
                    type:3
                }
            } );
            return
        }
        if (upgraderCount < upgraderSize.max) {
            console.log("build role: upgrader", upgraderCount)
            spawn.spawnCreep( [CARRY, WORK, CARRY, MOVE, MOVE], "UPGRADER-"+name, {
                memory:{
                    type:2
                }
            } );
            return
        }

    }
}

function initMemory(){
    // for(const name in Memory.creeps) {
    //     if(!Game.creeps[name]) {
    //         // 不再删除了！
    //         delete Memory.creeps[name]
    
    //         // 向 spawn 发送生成任务
    //         // ...
    //     }
    // }
    var memCreeps = Memory.creeps
    for(name in memCreeps){
        if(!Game.creeps[name]) {
            // 不再删除了！
            delete memCreeps[name]
    
            // 向 spawn 发送生成任务
            // ...
        }
        // if (Game.creeps[memCreep] == null){
        //     memCreeps.delete(memCreep)
        // }
    }

}