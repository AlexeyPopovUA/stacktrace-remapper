# stacktrace-remapper

[![Quality Gate](https://sonarcloud.io/api/badges/gate?key=universal-logger)](https://sonarcloud.io/dashboard/index/universal-logger)

##Usage

Help

`node . -h`

###Usage with cmd parameters

Stack trace should be passed as a `stdin` to the application together with the path to the related source map. Example for macOS:

`pbpaste | node . -m ./../editor_mobile/src/www/js/edit.js.map`

###Usage with config file

`node . -c "path to the configuration js file"`

Configuration js file should export an object with next fields:

*sourceMapPath* - path to the source map.

*stackTraceString* - stack trace content. There is no need to inline it.