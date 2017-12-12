# stacktrace-remapper

##Usage

Usage with cmd parameters:

// todo Currently is not working. Have no idea how to use cmd with multiline parameters **conviniently**

`node . -m "path to the source map" -s "inlined stack trace"`

Usage with config file:

`node . -c "path to the configuration js file"`

Configuration js file should export an object with next fields:

*sourceMapPath* - path to the source map.

*stackTraceString* - stack trace content. There is no need to inline it.