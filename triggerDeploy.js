const https = require("https");
require("dotenv").config();
// body:
// prod-industry
// prod-justfilm
// prod-kinoff
// prod-poff
// prod-shorts
// staging-industry
// staging-justfilm
// staging-kinoff
// staging-poff
// staging-shorts


function TriggerDeploy(target) {
  var options = {
    method: "POST",
    hostname: "api.poff.ee",
    path: `/deploy`,
    headers: {
      authorization: `Bearer ${process.env.AWS_TOKEN}`
    },
  };
  console.log(options)
  var req = https.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function (chunk) {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
    });

    res.on("error", function (error) {
      console.error(error);
    });
  });
  var body = target;

  req.write(body);

  req.end();

  console.log(target)
}

//TriggerDeploy(deployTarget)


module.exports.Start = TriggerDeploy;
