const {RoleManager} = require('role_manager');
var spawnName = "Spawn1"

module.exports.loop = function () {

    var spawn = Game.spawns[spawnName]
    var roleManager = new RoleManager(spawn)
    var sources = spawn.room.find(FIND_SOURCES);
    initMemory()
    for(var name in roleManager.ROLE_MAP) {
        var role = roleManager.ROLE_MAP[name];
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