const api = require("./tracing").setupTracing("svc-consumer", false);
var AWS = require("aws-sdk");

var sqs = new AWS.SQS({apiVersion: '2012-11-05', region: "us-west-2"});
var queueUrl ='http://localhost:4566/000000000000/test-queue';

class SqsContextGetter {
  keys(carrier) {
      return Object.keys(carrier);
  }

  get(carrier, key) {
      return carrier?.[key]?.StringValue;
  }
}
const sqsContextGetter = new SqsContextGetter();

const tracer = api.trace.getTracer("consumer");

function receive() {
  var params = {
    QueueUrl: queueUrl,
    MessageAttributeNames: ["All"],
  };
  sqs.receiveMessage(params, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
    } else  {
      if (data.Messages && data.Messages.length >0) {
        data.Messages.forEach((msg, a, b, c) => {
          api.context.with(
            api.propagation.extract(api.context.active(), msg.MessageAttributes, sqsContextGetter),
            () => {
              const span = tracer.startSpan("sqs.process", {
                kind: api.SpanKind.CONSUMER,
              })
              sqs.deleteMessage({
                QueueUrl: queueUrl,
                ReceiptHandle: msg.ReceiptHandle
              }, function(err, data) {
                if (err) {
                  console.log("Delete Error", err);
                }
                span.end();
              })
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