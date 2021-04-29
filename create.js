
var AWS = require("aws-sdk");

var sqs = new AWS.SQS({apiVersion: '2012-11-05', region: "us-west-2", endpoint: "http://localhost:4566" })


var params = {
  QueueName: 'test-queue',
};
sqs.createQueue(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});