var request = require('request');
var fs = require('fs');
var args = process.argv.slice(2);
var token = require('./secrets.js')
if (args.length < 2){
  console.log('Please enter repository owner and repository name')
} else {
  console.log('Welcome to the GitHub Avatar Downloader!');

  function getRepoContributors(repoOwner, repoName, cb) {
    var options = {
      url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
      headers: {
        'User-Agent': 'request',
        'Authorization': token.GITHUB_TOKEN
      }
    };

    request(options, function(err, res, body) {
      cb(err, body);
    });
  }

  getRepoContributors(args[0], args[1], function(err, result) {
    console.log("Errors:", err);
    var repos = JSON.parse(result);
    var filepath;
    repos.forEach(function(repo) {
      if (!fs.existsSync('avatars')){
        fs.mkdirSync('avatars');
      }
      filepath = 'avatars' + '/' + repo.login + '.jpg';
      downloadImageByURL(repo.avatar_url, filepath);
    });
  });

  function downloadImageByURL(url, filePath) {
    request.get(url)
         .on('error', function (err) {
            throw err;
         })
         .on('response', function (response) {
            console.log('Downloading image...');
          })
         .pipe(fs.createWriteStream(filePath));
  }
}
//downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg")
