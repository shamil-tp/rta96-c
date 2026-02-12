const os = require('os');
const interfaces = os.networkInterfaces()

const findInterface = function(){
    for (const name of Object.keys(interfaces)){
        for (const interface of interfaces[name]){
            if(interface.family === "IPv4" && !(interface.internal)){
                // console.log("MY IP ADDRESS: "+ interface.address)
                // console.log("MY SUBNET IS: "+interface.address.split('.').slice(0,-1).join('.'))
                return {
                    ip:interface.address,
                    subnet:interface.address.split('.').slice(0,-1).join('.')
                }
            }
        }
    }
    return null
}

module.exports = findInterface