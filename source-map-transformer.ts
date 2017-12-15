// Reads a source map and creates mapping. Provides with ability to get original pointer position from the generated one
import {MappedPosition, SourceMapConsumer} from 'source-map';
import * as _ from 'lodash';
import * as fs from 'fs';
import * as util from 'util';
// reads an error stack trace and generates a parsed interpretation as an Array of records
import {parse, StackFrame} from 'error-stack-parser';

const readFile = util.promisify(fs.readFile);

export function transformStackTrace (sourceMapPath: string, stackTraceString: string): Promise<string> {
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
                        return getFormattedLine(frame.generatedName, frame.name, frame.source, frame.line, frame.column);
                    } else {
                        return frame.generatedSource;
                    }
                })
                .tap(list => list.unshift(getFormattedLine('Generated name','Original name', 'Source file', 'Line', 'Column')))
                .value();

            return result.join('\n');
        })
        .catch(error => console.error(error));
}

function getOriginalStackFrame(data: StackFrame, sourceConsumer: SourceMapConsumer): any {
    const test: MappedPosition = sourceConsumer.originalPositionFor({
        line: data.lineNumber,
        column: data.columnNumber
    });

    return {
        column: test.column,
        source: test.source,
        line: test.line,
        name: test.name,
        // Redundant info for the future tuning
        generatedSource: data.source,
        generatedName: data.functionName
    };
}

function getFormattedLine(generatedName: string, name: string, source: string, line: string, column: string) {
    return `${_.padEnd(generatedName, 20)} ${_.padEnd(name, 20)} ${_.padEnd(source, 70)} : ${_.padEnd(line, 10)} : ${_.padEnd(column, 10)}`;
}
