const api = require("./tracing").setupTracing("svc-producer");

var AWS = require("aws-sdk");

var sqs = new AWS.SQS({apiVersion: '2012-11-05', region: "us-west-2"});

var params = {
  QueueUrl: 'http://localhost:4566/000000000000/test-queue',
  MessageBody: 'this is body value', 
  MessageAttributes: {
    'my-attr': {
      DataType: 'String',
      StringValue: 'my-attr-value'
    },
  }
};
sqs.sendMessage(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});


setInterval(function() {
  console.log("timer that keeps nodejs processing running");
}, 1000 * 60 * 60);