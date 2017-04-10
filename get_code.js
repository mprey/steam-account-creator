var SteamTotp = require('steam-totp');
var readlineSync = require('readline-sync');

init();

function init() {
  var secret = readlineSync.question('>> Shared secret: ');
  var code = SteamTotp.generateAuthCode(secret);
  console.log('Code: ' + code);
}
