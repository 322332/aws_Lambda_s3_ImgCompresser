var AWS = require("aws-sdk");
var s3 = new AWS.S3();

const tinify = require("tinify");
tinify.key = "mwz5x24N2Y9ScK5tScrdnHYdvz8s76lk";

exports.handler = (event, context, callback) => {
  let records = event.Records;
  for (let i = 0; i < records.length; i++) {
    processFile(records[i]);
  }
  callback(null, "");
};

function processFile(file) {
  let filePath = file.s3.object.key;
  let fileBucket = file.s3.bucket.name;

  let fileName = filePath.split("/");
  fileName = fileName[fileName.length - 1];

  var params = {
    Bucket: "stajucket",
    Key: "images/" + fileName
  };

  s3.getObject(params, function(err, data) {
    if (err) console.log(err, err.stack);
    // an error occurred
    else {
      tinify.fromBuffer(data.Body).toBuffer(function(err, resultData) {
        if (err) throw err;
        else {
          var params = {
            Body: resultData,
            Bucket: "stajucket",
            Key: "compressed/" + fileName
          };
          s3.putObject(params, function(err, data) {
            if (err) console.log(err, err.stack);
            // an error occurred
            else console.log(data); // successful response
          });
        }
      });
    }
  });
}
