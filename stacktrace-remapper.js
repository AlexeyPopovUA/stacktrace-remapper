const program = require('commander');
require('ts-node/register');
const {transformStackTrace} = require('./source-map-consumer');

program
    .version('1.0.0')
    .usage('test')
    .option('-m, --source-map [sourceMap]', 'Specify path to the source map')
    .option('-s, --stack-trace [stackTrace]', 'Specify the stack trace string')
    .option('-d, --demo', 'Demo mode')
    .parse(process.argv);

if (program.demo) {
    const demoConfiguration = require('./demo-configuration');
    console.log();
    transformStackTrace(demoConfiguration.sourceMapPath, demoConfiguration.stackTraceString)
        .then(result => console.log(result));
} else if (program.sourceMap && program.stackTrace) {
    transformStackTrace(program.sourceMap, program.stackTrace)
        .then(result => console.log(result));
} else {
    console.error(`Please, check your parameters
sourceMapPath = ${program.sourceMap}
stackTrace = ${program.stackTrace}`);
}
