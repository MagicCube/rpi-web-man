const fs = require('fs');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const prompt = require('prompt');

prompt.start();


prompt.get({
    properties: {
      username: {
        pattern: /^[a-zA-Z\s\-]+$/,
        message: 'Username must be only letters, spaces, or dashes',
        required: true
      },
      password: {
        hidden: true
      }
    }
  }, function (err, result) {
    if (err) console.error('Failed to create a .env file');

    const password = bcrypt.hashSync(result.password, 10)
    
    fs.writeFile(
        '.env',
        'COOKIE_SECRET=' + crypto.randomBytes(40).toString('hex') + '\n' +
        'USERNAME=' + result.username + '\n' +
        'PASSWORD=' + password + '\n'
    );
});