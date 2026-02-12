const scanner = require('./scanner')
const axios = require('axios')
const {subnet} = require('./subnetFetch')()

const bruteScan = async(subnet,i)=>{
    const url = `http://${subnet}.${i}:3000`
    try{
        await axios.get(url,{timeout:500})
        return {ip:`${subnet}.${i}`,status:"Exists and online"}
    }catch(e){
        if (e.code === 'ECONNREFUSED') {
            return { ip:`${subnet}.${i}`, status: 'ONLINE_DEVICE' };
        }
        if (e.code === 'ETIMEDOUT') {
            return { ip:`${subnet}.${i}`, status: 'REFUSED' };
        }
        return null;
    }
}

const start = async ()=>{
    console.time("scan")
    try{
        let initialScan = await scanner()
        let job = []
        for (let i = 1;i<255;i++){
            job.push(bruteScan(subnet,i))
        }
        let doneJob = await Promise.all(job)
        let result = doneJob.filter(Boolean)
        console.log(initialScan)
        console.log(result)

    }catch(e){
        console.log(e)
    }
    console.timeEnd("scan")
}
start()

