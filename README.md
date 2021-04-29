# otel-sqs-instrumentation-example


## Steps

1. Run `make install` to install all node packages.
2. Run `make run-sqs` to start SQS service locally.
3. Run `make provision-queue` to create an SQS queue.
4. Send a message by running `make send`.
5. Receive message from the queue by running `make receive`.

All spans are exported to `http://localhost:14268/api/traces` in Jaeger thrift format. 



## Otel config to receive and log spans:

```
extensions:
  health_check: {}

receivers:
  jaeger:
    protocols:
      thrift_http:

exporters:
  logging:
      loglevel: debug

service:
  pipelines:
    traces:
      receivers: [jaeger]
      exporters: [logging]
```

Run with `otelcontribcol --config config.yaml`
