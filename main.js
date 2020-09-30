var roleFactory = require('role_factory');
var spawnName = "Spawn1"

module.exports.loop = function () {

    var spawn = Game.spawns[spawnName]
    var sources = spawn.room.find(FIND_SOURCES);
    initMemory()
    var factory = roleFactory.run(spawn)
    for(var name in factory.ROLE_MAP) {
        var role = factory.ROLE_MAP[name];
        role.run()
    }
}

function initMemory(){
    var memCreeps = Memory.creeps
    for(name in memCreeps){
        if(!Game.creeps[name]) {
            delete memCreeps[name]
        }
    }

}