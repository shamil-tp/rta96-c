//      COIN TOSS TEST PROMISES

// const coinFlip = function(){
//     return new Promise((resolve,reject)=>{
//     const number = Math.random()
//     if(number > 0.5){
//         resolve("HEAD is on")
//     }
//     else{
//         reject("TAIL is on")
//     }
// });
// }

// for(let i = 0;i<5;i++){
//     coinFlip()
//     .then(m=>console.log(m))
//     .catch(e=>console.log(e));
// }

// const subnet = '192.168.29.'

// const arpTable = ['192.168.29.2','192.168.29.20','192.168.29.78','192.168.29.56','192.168.29.143','192.168.29.200',]

// const scanIP = function(ip){
//     return new Promise((resolve,reject)=>{
//         console.log("Scanning IP ...."+ ip)
//         setTimeout(() => {
//             if(arpTable.includes(ip)){
//                 resolve(ip + "is found")
//             }else{
//                 resolve(null)
//             }
//         }, 2000);
//     })
// }

// const runnerCode = async()=>{
//     let foundip = []
//     for(let i=2;i<255;i++){
//         foundip.push(scanIP(subnet+i))
//     }

//     let result = await Promise.all(foundip)
//     let ip = result.filter(Boolean)
//     // console.log(ip)
//     return ip
// }

// let hello = runnerCode()
// console.log(hello)

// server.js
// const net = require('net');

// // 1. Create the Server
// const server = net.createServer((socket) => {
//     // This function runs EVERY time someone connects!
//     console.log("⚡ A Client connected!");

//     // A. Send a welcome message to the client
//     socket.write("Hello! You have reached the RTA96-C Mainframe.\r\n");

//     // B. Listen for data FROM the client
//     socket.on('data', (data) => {
//         console.log("📩 Client said:", data.toString());
//         // Reply back
//         socket.write("I received your message: " + data.toString());
//     });

//     // C. Handle disconnection
//     socket.on('end', () => {
//         console.log("❌ Client disconnected.");
//     });
// });

// // 2. Start Listening on Port 3000
// server.listen(3000, '0.0.0.0', () => {
//     console.log("👂 Server listening on Port 3000...");
// });

const net = require('net')
const {subnet} = require('./subnetFetch')()

const TARGET_PORT = 80
const TIMEOUT = 1000

const checkDevice = async (ip) =>{
    return new Promise((resolve)=>{
        const socket = new net.Socket
        socket.setTimeout(TIMEOUT)
        socket.connect(TARGET_PORT,ip)
        socket.on('connect', () => {
            socket.destroy(); 
            resolve({ ip, status: 'OPEN (Web Server)' });
        });
        socket.on('error', (err) => {
            socket.destroy();
            if (err.code === 'ECONNREFUSED') {
                resolve({ ip, status: 'ONLINE (No Web Interface)' });
            } else {
                resolve(null);
            }
        });
        socket.on('timeout', () => {
            socket.destroy();
            resolve(null);
        });
    })
}

const searchDevice = async()=>{
    console.time('scan')
    let deviceList = []
    let finalDeviceList = []
    for(let i=1;i<255;i++){
        deviceList.push(checkDevice(`${subnet}.${i}`))
    }
    try{
        let result = await Promise.all(deviceList)
        finalDeviceList = result.filter(Boolean)
        console.log(finalDeviceList)
    }catch(e){
        console.log(e)
    }
    console.timeEnd('scan')
    return finalDeviceList
}

searchDevice()