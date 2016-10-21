var SteamUser = require('steam-user');
var SteamStore = require('steamstore');
var SteamTotp = require('steam-totp');
var SteamCommunity = require('steamcommunity');
var readlineSync = require('readline-sync');
var fs = require('fs');

var username, password, shared_secret;

var user = new SteamUser();
user.options.promptSteamGuardCode = false;

console.log('>> Testing login...');
logOn();

function logOn() {
  username = readlineSync.question('>> Username: ');
  password = readlineSync.question('>> Password: ');
  getSharedSecret(username, function(secret) {
    shared_secret = secret;
    user.logOn({
      'accountName': username,
      'password': password,
      'twoFactorCode': SteamTotp.generateAuthCode(secret)
    });
  });
}

function getSharedSecret(username, callback) {
  var json = JSON.parse(fs.readFileSync(username + '.2fa', 'utf8'));
  callback(json.shared_secret);
}

user.on('steamGuard', function(domain, callback, lastCodeWrong) {
    var code = SteamTotp.generateAuthCode(shared_secret);
    callback(code);
});

user.on('loggedOn', function(details) {
  console.log('>> Logged into the account with two-factor authentication enabled.');
  console.log('>> Thanks for using steam-account-creator');
  console.log('>> Remeber to save the .2fa file provided in this directory.');
  process.exit(1);
});
