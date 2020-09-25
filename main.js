var role = require('role');
var utils = require('utils');

module.exports.loop = function () {
    var spawn = Game.spawns['Hom']
     
    var sources = spawn.room.find(FIND_SOURCES);
    // for(var name in Game.creeps) {
    //     var creep = Game.creeps[name];
    //     role.run(creep)
    // }
    // var harvesterSize = 6
    if(Memory.ActionQueue == null){
        Memory.ActionQueue = []
    }

    Memory.ActionQueue.push([new GetEngineAction(sources[0]), new TransferEngineAction(spawn)])

    actionQueue = Memory.ActionQueue

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        var roler = role.buildRole(creep)
        if(){

        }
        role.run(creep)
    }

    // var harvesterSize = 6
    if(spawn.store.energy >=300 ){
        var harvesterCount = role.count(role.ROLE_TYPE['HARVESTER'])
        var upgraderCount = role.count(role.ROLE_TYPE['UPGRADER'])
        console.log("harvesterCount:", harvesterCount, ", ", "upgraderCount:", upgraderCount)
        var name = utils.randomString(5)
        if(harvesterCount < harvesterSize){
            console.log("build role: harvester")
            spawn.spawnCreep( [WORK, CARRY, WORK, MOVE], "HARVESTER-"+name, {
                memory:{
                    type:1
                }
            } );
            return
        } else {
            console.log("build role: upgrader")
            spawn.spawnCreep( [WORK, CARRY, WORK, MOVE], "UPGRADER-"+name, {
                memory:{
                    type:2
                }
            } );
            return
        }

    }
    
    
}