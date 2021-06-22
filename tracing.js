//const { propagation } = require("@opentelemetry/api");
const opentelemetry = require("@opentelemetry/api");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { NodeTracerProvider } = require("@opentelemetry/node");
const { AwsInstrumentation } = require("opentelemetry-instrumentation-aws-sdk");
const { HttpTraceContextPropagator } = require("@opentelemetry/core");
const { SimpleSpanProcessor } = require("@opentelemetry/tracing");
const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");
const {
  detectResources,
  envDetector,
  processDetector,
  Resource,
  ResourceDetectionConfig,
} = require('@opentelemetry/resources');

function setupTracing(serviceName, instrumentSQS = true) {
  //propagation.setGlobalPropagator(new HttpTraceContext());
  opentelemetry.propagation.setGlobalPropagator(new HttpTraceContextPropagator());

  const provider = new NodeTracerProvider({
    resource: Resource.default().merge(new Resource({"service.name": serviceName})) 
  });

  provider.addSpanProcessor(
    new SimpleSpanProcessor(
      new JaegerExporter({
        endpoint: "http://localhost:14268/api/traces",
      })
    )
  );

  provider.register();

  const instrumentations = [];
  if (instrumentSQS) {
    instrumentations.push(new AwsInstrumentation({}))
  }
  
  registerInstrumentations({instrumentations});

  //const tracer = opentelemetry.trace.getTracer(serviceName);
  //return tracer;
  return opentelemetry;
}

module.exports = {
  setupTracing,
};
