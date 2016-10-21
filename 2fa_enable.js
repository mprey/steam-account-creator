var SteamUser = require('steam-user');
var SteamStore = require('steamstore');
var SteamTotp = require('steam-totp');
var SteamCommunity = require('steamcommunity');
var readlineSync = require('readline-sync');
var fs = require('fs');

var username, password, shared_secret;

var user = new SteamUser();

console.log('2fa enabling process beginning...');
logOn();

function logOn() {
  username = readlineSync.question('Username: ');
  password = readlineSync.question('Password: ');
  user.logOn({
    'accountName': username,
    'password': password
  });
}

user.on('loggedOn', function(response) {
  console.log('Logged onto Steam...');
  console.log('Beginning 2fa authentication');
  enableTwoFactor();
});

function enableTwoFactor() {
  user.enableTwoFactor(function(response) {
    var status = response.status;
    if (!(status == SteamUser.Steam.EResult.OK)) {
      console.log('>> Erorr while enabling 2fa. Error code: ' + status);
      process.exit(1);
    } else {
      console.log('>> Successfully requested 2fa enabling.');
      console.log('>> Saving valuable data to ' + username + '.2fa');
      fs.writeFile(username + '.2fa', JSON.stringify(response));
      finalizeTwoFactor(response);
    }
  });
}

function finalizeTwoFactor(response) {
  console.log('>> Verifying 2fa activiation.');
  var code = readlineSync.question('Code sent by SMS: ');
  user.finalizeTwoFactor(response.shared_secret, code, function (err) {
    if (err) {
      console.log('>> Error while verifying 2fa. Error: ' + err.message);
      process.exit(1);
    } else {
      console.log('>> Successfully verified 2fa authentication.');
      console.log('>> Run test_login.js if you wish to test your login. (Do not remove .2fa file from this directory)');
      process.exit(1);
    }
  });
}
