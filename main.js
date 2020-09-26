var roleFactory = require('role_factory');
var spawnName = "Spawn1"

module.exports.loop = function () {

    var spawn = Game.spawns[spawnName]
    // console.log("init factory")
    var sources = spawn.room.find(FIND_SOURCES);
    initMemory()
    var factory = roleFactory.run(spawn)
    for(var name in factory.ROLE_MAP) {
        var role = factory.ROLE_MAP[name];
        role.run()
        // console.log("name run", name)
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