module.exports = {
    apps : [{
        name: 'Rates Receiver System',
        script: './dist/main.js',
        restart_delay: 10000,
        out_file: process.env.PWD + 'output.log',
        error_file: process.env.PWD + 'error.log',
    }]
}
