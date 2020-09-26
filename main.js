var roleFactory = require('role_factory');
var spawn = Game.spawns['Spawn1']

module.exports.loop = function () {

    // console.log("init factory")
    var sources = spawn.room.find(FIND_SOURCES);
    initMemory()
    roleFactory.run()
    for(var name in roleFactory.ROLE_MAP) {
        var role = roleFactory.ROLE_MAP[name];
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