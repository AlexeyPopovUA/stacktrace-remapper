const program = require('commander');
require('ts-node/register');
const {transformStackTrace} = require('./source-map-transformer');

program
    .version('1.0.0')
    .option('-m, --source-map [sourceMap]', 'Specify path to the source map')
    .option('-s, --stack-trace [stackTrace]', 'Specify the stack trace string')
    .option('-c, --config [config]', 'Using configuration file (configuration.js)', './configuration.js')
    .parse(process.argv);

console.log();
console.log();

/*if (program.sourceMap && program.stackTrace) {
    transformStackTrace(program.sourceMap, program.stackTrace)
        .then(result => console.log(result));
} else*/ if (program.config) {
    const demoConfiguration = require(program.config);
    transformStackTrace(demoConfiguration.sourceMapPath, demoConfiguration.stackTraceString)
        .then(result => console.log(result));
} else {
    console.error(`Please, check your parameters
sourceMapPath = ${program.sourceMap}
stackTrace = ${program.stackTrace}`);
}