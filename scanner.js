const arp = require('node-arp');
const iface = require('./subnetFetch')()

const findIP = (i)=>new Promise((resolve,reject)=>{
    arp.getMAC(`${iface.subnet}.${i}`,(err,mac)=>{
        if(!err && mac){
            resolve(`${iface.subnet}.${i}`)
        }else{
            resolve(null)
        }
    })

})

const scanIp = async function(){
    console.time('T')
    let allScans = []
    for(let i=1;i<255;i++){
        allScans.push(findIP(i))
    }
    let foundIp;
    try{
        allScans = await Promise.all(allScans)
        foundIp = allScans.filter(Boolean)
    }catch(e){
        console.log(e)
    }
    console.log(foundIp)
    console.timeEnd("T")
    return foundIp
}
scanIp()

module.exports = scanIp
