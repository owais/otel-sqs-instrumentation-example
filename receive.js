const api = require("./tracing").setupTracing("svc-consumer");

var AWS = require("aws-sdk");

var sqs = new AWS.SQS({apiVersion: '2012-11-05', region: "us-west-2"});
var queueUrl ='http://localhost:4566/000000000000/test-queue';

function receive() {
var params = {
  QueueUrl: queueUrl,
  MaxNumberOfMessages: 1,
};
sqs.receiveMessage(params, function(err, data) {
  if (err) {
    console.log(err, err.stack); // an error occurred
  } else  {
    //const api = require("./tracing").setupTracing("svc-consumer");
    if (data.Messages && data.Messages.length >0) {
      data.Messages.forEach(msg => {
        sqs.deleteMessage({
          QueueUrl: queueUrl,
          ReceiptHandle: msg.ReceiptHandle
        }, function(err, data) {
          if (err) {
            console.log("Delete Error", err);
          }
        })
      });
    }
  } 
})
}

receive();
setInterval(function() {
  // receive();
}, 5000);