const Eureka = require("eureka-js-client").Eureka;
const config = require("config");
const eurekaHost = config.get("EUREKA_CLIENT") || "127.0.0.1";
const eurekaPort = 48658;
const hostName = process.env.HOSTNAME || "localhost";
const ipAddr = "172.0.0.1";

exports.registerWithEureka = function (appName, PORT) {
  const client = new Eureka({
    instance: {
      app: appName,
      hostName: "192.168.99.100",
      preferIpAddress: "true",
      ipAddr: "192.168.99.100",
      port: {
        $: PORT,
        "@enabled": "fasle",
      },
      vipAddress: appName,
      dataCenterInfo: {
        "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
        name: "MyOwn",
      },
    },
    //retry 10 time for 3 minute 20 seconds.
    eureka: {
      host: "fgsc-eureka-server.herokuapp.com",
      port: eurekaPort,
      servicePath: "/eureka/apps",
      maxRetries: 10,
      requestRetryDelay: 2000,
    },
  });

  client.logger.level("debug");

  client.start((error) => {
    console.log(error || "todo service registered");
  });

  function exitHandler(options, exitCode) {
    if (options.cleanup) {
    }
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) {
      client.stop();
    }
  }

  client.on("deregistered", () => {
    process.exit();
  });

  client.on("started", () => {
    console.log("eureka host  " + eurekaHost);
  });

  process.on("SIGINT", exitHandler.bind(null, { exit: true }));
};
