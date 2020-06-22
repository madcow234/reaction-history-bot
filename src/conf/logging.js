import { sep } from 'path'
import winston from 'winston'
import fs      from 'fs'

/**
 * Initializes the logging framework.
 */
exports.initLogger = async () => {
    const NODE_ENV = process.env.NODE_ENV
    const logDirName = 'logs'
    const filename = 'reaction-history'

    // Log to console in production because Heroku will add STDOUT to the log stream.
    if (NODE_ENV === 'production') {
        setConsoleLogger()
        return
    }

    // Attempt to create a /logs/ directory.
    try {
        fs.mkdirSync(`${process.cwd() + sep + logDirName}`)

    } catch (err) {
        // If there was an error and the /logs/ directory does not exist, return the console logger.
        if (err.code !== 'EEXIST') {
            setConsoleLogger()
            console.log(`An error has occurred that cannot be fixed (code: ${err.code})!`)
            console.log(`Switching to console logging.`)
        }
    }

    switch (NODE_ENV) {
        case 'development':
            setDevelopmentLogger(logDirName, filename)
            break

        case 'test':
            setTestLogger(logDirName, filename)
            break

        default:
            console.log(`Cannot determine current Node environment! You may need to set a "process.env.NODE_ENV" environment variable or create a .env file.`)
            console.log(`Switching to console logging.`)
            setConsoleLogger()
    }

    winston.info(`Successfully configured the logging framework.`)
}

const formatPattern = winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level.toUpperCase().padStart(5)}: ${message}`
})

const setConsoleLogger = () => {
    // noinspection JSCheckFunctionSignatures
    winston.configure({
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.splat(),
                    winston.format.simple(),
                    winston.format.timestamp(),
                    formatPattern
                )
            }),
        ]
    })
    console.log(`Configured logger for production environment.`)
    console.log(`Logs can be found in the console.`)
}

const setTestLogger = (directoryName, filename) => {
    let filepath = `${process.cwd() + sep + directoryName + sep + filename}.test.log`
    winston.configure({
        transports: [
            new winston.transports.File({
                name: 'file',
                filename: filepath,
                format: winston.format.combine(
                    winston.format.splat(),
                    winston.format.simple(),
                    winston.format.timestamp(),
                    formatPattern
                )
            })
        ]
    })
    console.log(`Configured logger for test environment.`)
    console.log(`Logs can be found in the following location [${filepath}].`)
}

const setDevelopmentLogger = (directoryName, filename) => {
    let filepathBase = process.cwd() + sep + directoryName + sep + filename
    let filepath = `${filepathBase}.log`
    let jsonFilepath = `${filepathBase}.json.log`
    let stackTraceFilepath = `${filepathBase}.stackTrace.log`

    winston.configure({
        transports: [
            new winston.transports.File({
                name: 'standard',
                level: 'debug',
                filename: filepath,
                format: winston.format.combine(
                    winston.format.splat(),
                    winston.format.simple(),
                    winston.format.timestamp(),
                    formatPattern
                )
            }),
            new winston.transports.File({
                name: 'json',
                level: 'debug',
                filename: jsonFilepath,
                format: winston.format.combine(
                    winston.format.json()
                )
            }),
            new winston.transports.File({
                name: 'stackTrace',
                level: 'error',
                filename: stackTraceFilepath,
                format: winston.format.combine(
                    winston.format.splat(),
                    winston.format.simple(),
                    winston.format.timestamp(),
                    formatPattern
                )
            })
        ]
    })
    console.log(`Configured logger for development environment.`)
    console.log(`Logs can be found in the following locations: [${[filepath, jsonFilepath, stackTraceFilepath].join(', ')}].`)
}
