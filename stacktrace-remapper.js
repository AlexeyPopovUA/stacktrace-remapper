const program = require('commander');
const getStdin = require('get-stdin');

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

getStdin()
    .then(stdInput => {
        if (program.sourceMap && stdInput) {
            return transformStackTrace(program.sourceMap, stdInput)
        } else if (program.config) {
            const demoConfiguration = require(program.config);
            return transformStackTrace(demoConfiguration.sourceMapPath, demoConfiguration.stackTraceString);
        } else {
            throw `Please, check your parameters
sourceMapPath = ${program.sourceMap}
stackTrace = ${program.stackTrace}`;
        }
    })
    .then(result => console.log(result))
    .catch(error => console.error(error));