const fs = require('fs');
let appJs = fs.readFileSync('mockup/app.js', 'utf8');

const regex = /let currentSortColumn = null;\nlet currentSortOrder = 'asc';\nlet currentPage = 1;\nconst itemsPerPage = 20;/g;

let count = 0;
appJs = appJs.replace(regex, (match) => {
    count++;
    if (count === 1) return match; // Keep the first occurrence
    return ''; // Remove duplicates
});

fs.writeFileSync('mockup/app.js', appJs);
