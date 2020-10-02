const { initial, filter } = require('lodash');
var utils = require('utils');

class RoleFactor{
    constructor(spawn){
        this.spawn = spawn
    }

    buildRole(roleConfig){
        var spawn = this.spawn
        if (spawn.room.energyAvailable >= roleConfig.buildEnergy) {
            if (spawn.spawning == null ){
                var name = utils.randomString(5)
                var fullName = roleConfig.prefix + "-" + name
                var targeRoomName
                if (roleConfig.targetRoomName != null ) {
                    targeRoomName = roleConfig.targetRoomName
                } else {
                    targeRoomName = "UN_DEFINED"
                }
                spawn.spawnCreep(
                    roleConfig.body,
                    fullName,
                    {
                        memory:{
                            type: roleConfig.type,
                            targetRoomName: targeRoomName
                        }
                    }
                );
                console.log("buildRole", fullName)
                return true
            } else {
                console.log("buildRole - spawn spawning", spawn.spawning.name)
            }   
        }
        return false
    }
}

module.exports  = {
    RoleFactor,
}