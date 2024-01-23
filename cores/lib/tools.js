const crypto = require ("crypto");
const bcrypt = require ("bcrypt");
const gzip = require ('zlib');
const XOR = require ('../XOR');
const xor = new XOR();
const fs = require ('fs');
const path = require('path');

module.exports.datetime = () => {
    var time = new Date();

    var day = time.getDate().toString().padStart(2, '0');
    var month = (time.getMonth()+1).toString().padStart(2, '0');
    var year = time.getFullYear();
    var hours = time.getHours().toString().padStart(2, '0');
    var minutes = time.getMinutes().toString().padStart(2, '0');

    return `${year}.${month}.${day}.${hours}.${minutes}`;
}

module.exports.sha1 = (string, key="") => {
    const coded = crypto.createHash("sha1");
    coded.update(string+key);
    return coded.digest('hex');
}

module.exports.levelhash = (levelmulstr) => {
    var hased = "";

    for (let x = 0; x < levelmulstr.length; x++) {
        var id = levelmulstr[x]['ID'].toString();
        hased+=id[0] + id[id.length-1] + levelmulstr[x]['stars'] + levelmulstr[x]['Gcoins'];
    }
    return this.sha1(hased, "xI25fpAapCQg");
}

module.exports.levelhash1 = (string) => {
    string = string.toString();
    var key = "xI25fpAapCQg";

    if (string.length < 41) return this.sha1(string, key);
    var hash = "";
    for (let i = 0; i < 40; i++) {
        let x = i*Math.floor(string.length/40);
        hash +=string[x];
    }
    return this.sha1(hash, key);
}

module.exports.levelhash2 = (string) => {
    string = string.toString();
    var key = "xI25fpAapCQg";

    return this.sha1(string, key);
}

module.exports.compressGzip = (data) => {
    const press = gzip.gzipSync(data);
    return press;
}

module.exports.decompressGzip = (data) => {
    const depress = gzip.gunzipSync(data); // :)
    return depress;
}

module.exports.xorPass = (pass) => {
    var xor = new XOR();
    return xor.encrypt(pass.toString(), 26364);
}

module.exports.sparedatetime = () => {
    var time = this.datetime().split(".");
    return time;
}

module.exports.verifypassword = (encrypt, password) => {
    password=btoa(password)
    var chk = bcrypt.compareSync(password, encrypt);
    return chk;
}

module.exports.hashpassword = (password) => {
    password=btoa(password);
    var hashed = bcrypt.hashSync(password, 10);
    return hashed;
}

module.exports.createCache = (name, move='') => {
    var cachepath = path.join(global.system.mainpath, `/data/cache`);
    var datapath = path.join(global.system.mainpath, `/data`);
    if (!fs.existsSync(cachepath)) fs.mkdirSync(cachepath);

    if (move!=='') {
        fs.renameSync(datapath + `/${move}`,cachepath + `/${name}-${Date.now()}`);
        return true;
    }
    return false;
}

// stuff

module.exports.icons = (data) => {
    var id = data['iconPrimary'] || 0
    var icons = [
        data['iconCube'] || 0,data['iconShip'] || 0,data['iconBall'] || 0,
        data['iconUFO'] || 0,data['iconWave'] || 0,data['iconRobot'] || 0,
        data['iconSpider'] || 0,data['iconSwing'] || 0,data['iconJet'] || 0
    ]

    return icons[id];
}

module.exports.demonDiffID = (id=0) => {
    id = Number(id);
    if (id==3 || id < 1 || id > 5) return 0; // hard
    if (id < 3) return id + 2; // easy - med
    if (id > 3) return id + 1; // insane - extreme
}

module.exports.diffID = (id=0) => {
    id = Number(id);
    if (id==0 || id > 5) return 0; // na
    return id * 10; // easy - insane
}

module.exports.fixpoints = (number=0) => {
    number = number.toString();
    if (number.includes(".")) {
        var n = number.split(".");
        
        var f = n[0];
        var s = n[1].slice(0,1);

        return Number(`${f}.${s}`);
    } else return Number(number)
}

module.exports.size = (size=0) => {
    var type = ['B','KB','MB','GB', 'TB'];
    var count = 0;
    while (size > 1023) {
        if (count < type.length) count+=1;
        size /=1024;
    }

    return `${this.fixpoints(size)} ${type[count]}`
}

module.exports.time = (time) => {
    var now = Date.now();
    var cycle = [1000,60,60,24,7,4,12];
    var msmhdwm = ['milisecond','second','minute','hour','day','week','month'];

    time = now - time;
    
    var count = 0;
    while (time > cycle[count]) {
        time /=cycle[count];
        count+=1;
    }

    var cyclename = msmhdwm[count];
    if (Math.floor(time) > 1) cyclename+="s"; 

    return `${Math.floor(time)} ${cyclename}`;
}