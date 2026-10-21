const fs = require('fs');

let appJs = fs.readFileSync('mockup/app.js', 'utf8');

const regex = /\n            \/\/ Active associations[\s\S]*?id: 'P3-V1',/m;
const fix = `
        {
            id: 'P3-V1',`;

appJs = appJs.replace(regex, fix);

fs.writeFileSync('mockup/app.js', appJs);
