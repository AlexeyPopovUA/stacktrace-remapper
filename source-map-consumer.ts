import {SourceMapConsumer} from 'source-map';
import * as _ from 'lodash';
import * as fs from 'fs';
import * as util from 'util';
import {parse} from 'error-stack-parser';
import {StackFrame} from 'error-stack-parser';

const readFile = util.promisify(fs.readFile);

function transformStackTrace (sourceMapPath: string, stackTraceString: string): Promise<string> {
    return readFile(sourceMapPath, {encoding: 'utf8'})
        .then(file => JSON.parse(file))
        .then(rawSourceMap => {
            const smc = new SourceMapConsumer(rawSourceMap);

            // Generate a temporary error for parser
            const temporaryError = new Error('temporaryError');
            temporaryError.stack = stackTraceString;

            const result = _.chain(parse(temporaryError))
                .map(frame => getOriginalStackFrame(frame, smc))
                .map(frame => {
                    if (frame.line) {
                        return getFormattedLine(frame.name, frame.source, frame.line, frame.column);
                    } else {
                        // First line of stack
                        return `${frame.generatedSource}\n${getFormattedLine('Function name', 'Source file', 'Line', 'Column')})`;
                    }
                })
                .value();

            return result.join('\n');
        })
        .catch(error => console.error(error));
}

function getOriginalStackFrame(data: StackFrame, sourceConsumer: SourceMapConsumer): any {
    const test = sourceConsumer.originalPositionFor({
        line: data.lineNumber,
        column: data.columnNumber
    });
    return {
        column: test.column,
        source: test.source,
        line: test.line,
        name: test.name,
        generatedSource: data.source,
        generatedName: data.functionName
    };
}

function getFormattedLine(name: string, source: string, line: string, column: string) {
    return `${_.padEnd(name, 20, " ")} ${_.padEnd(source, 70)} : ${_.padEnd(line, 10)} : ${_.padEnd(column, 10)}`;
}

export {
    transformStackTrace
};