//const { propagation } = require("@opentelemetry/api");
const opentelemetry = require("@opentelemetry/api");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { NodeTracerProvider } = require("@opentelemetry/node");
const { AwsInstrumentation } = require("opentelemetry-instrumentation-aws-sdk");
const { HttpTraceContext } = require("@opentelemetry/core");
const { SimpleSpanProcessor } = require("@opentelemetry/tracing");
const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");

function setupTracing(serviceName) {
  //propagation.setGlobalPropagator(new HttpTraceContext());
  opentelemetry.propagation.setGlobalPropagator(new HttpTraceContext());

  const provider = new NodeTracerProvider();
  provider.addSpanProcessor(
    new SimpleSpanProcessor(
      new JaegerExporter({
        serviceName,
        endpoint: "http://localhost:14268/api/traces",
      })
    )
  );

  provider.register();
  
  registerInstrumentations({
    instrumentations: [new AwsInstrumentation({})],
  });

  //const tracer = opentelemetry.trace.getTracer(serviceName);
  //return tracer;
  return opentelemetry;
}

module.exports = {
  setupTracing,
};
