const fs = require('fs');
const crypto = require('crypto');
 
fs.writeFile(
    '.env',
    'COOKIE_SECRET=' + crypto.randomBytes(40).toString('hex') + '\n'
);
