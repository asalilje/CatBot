"use strict";

const ssh2Client = require('ssh2').Client;
const exec = require('child_process').exec;

class Deployment {
    constructor(config) {
        this.projectName = config.projectName;
        this.root = '/home/' + config.user + "/" + config.projectName;
        this.user = config.user;
        this.password = config.password;
        this.hostName = config.hostName;
        this.files = config.files;
        this.startFile = config.startFile;
    }

    executeRemote(command) {
        return new Promise(function (resolve, reject) {
            const ssh2client = new ssh2Client();
            const connectOptions = {host: this.hostName, port: 22, username: this.user, password: this.password};
            ssh2client.on('ready', function () {
                ssh2client.exec(command, function (err, stream) {
                    if (err)
                        throw err;
                    stream
                        .on('close', function () {
                            ssh2client.end();
                            resolve();
                        })
                        .on('data', function (data) {
                            console.log(data.toString('utf-8'));
                        })
                        .stderr.on('data', function (err) {
                        console.log("Error: ", err.toString('utf-8'));
                        reject('Error executing command [' + command + '] with error: ', err);
                    });
                })
            });
            ssh2client.connect(connectOptions);

        }.bind(this));

    };

    executeLocal(command) {
        return new Promise(function (resolve, reject) {
            exec(command, function (err, stdout, stderr) {
                if (stdout)
                    console.log(stdout);
                if (stderr)
                    console.log(stderr);
                if (!err)
                    resolve();
                else
                    reject(err);
            });
        });
    }

    deployProject() {
        const task = 'deploy';
        console.log('\nStarting ' + task);

        return this.executeRemote('mkdir -p ' + this.root)
            .then(function () {
                return this.executeLocal('scp ' + this.files.join(' ') + ' ' + this.user + '@' + this.hostName + ':' + this.root)
            }.bind(this))
            .then(function () {
                console.log("Done!");
            })
            .catch(function (err) {
                console.log('Error in ' + task + ': ' + err);
            });
    }

    restoreModules() {
        const task = 'restore modules';
        console.log('\nStarting ' + task);

        return this.executeRemote('cd ' + this.root + ';sudo npm install')
            .then(function () {
                console.log("Done!");
            })
            .catch(function (err) {
                console.log('Error in ' + task + ': ' + err);
            });
    }

    run() {
        const task = 'starting app';
        console.log('\nStarting ' + task);

        return this.executeRemote('/usr/local/bin/node ' + this.root + '/' + this.startFile)
            .then(function () {
                console.log("Done!");
            })
            .catch(function (err) {
                console.log('Error in ' + task + ': ' + err);
            });
    }

    stop() {
        const task = 'stopping app';
        console.log('\nStarting ' + task);

        return this.executeRemote('killall node')
            .then(function () {
                console.log("Done!");
            })
            .catch(function (err) {
                console.log('Error in ' + task + ': ' + err);
            });
    }
}

module.exports = Deployment;
