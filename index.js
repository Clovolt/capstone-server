const net = require('net');
const port = 1337;
const host = '127.0.0.1';

const WaveFile = require('wavefile').WaveFile;
fs = require('fs');
var converter = require('hex2dec');

const server = net.createServer();
server.listen(port, host, () => {
    console.log('TCP Server is running on port ' + port + '.');
});

let sockets = [];

server.on('connection', function (sock) {
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
    sockets.push(sock);

    sock.on('data', function (data) {
        const buf = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
        console.log(buf.toString());
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
        let wav = new WaveFile(fs.readFileSync("CantinaBand3.wav"));
        console.log(wav.data.samples);
        // Write the data back to all the connected, the client will receive it as data from the server
        sockets.forEach(function (sock, index, array) {
            sock.write(wav.data.samples);
        });
    });

    sock.on('close', function (data) {
        let index = sockets.findIndex(function (o) {
            return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
        })
        if (index !== -1) sockets.splice(index, 1);
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });
});

function deneme() {
    let wav = new WaveFile(fs.readFileSync("CantinaBand3.wav"));
    const samples = wav.getSample();
    
    console.log(wav.data.samples);
    /*
    for (i = 0; i < samples.length; i ++) {
        var deneme = samples[i].toString();
        var dec = converter.hexToDec(`${samples[i]}`);
        console.log(deneme);
    }
   */
    //wav.fromScratch(1, 22050, "16", samples);
    //fs.writeFileSync("deneme.wav", wav.toBuffer());
}

//deneme();