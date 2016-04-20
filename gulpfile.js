"use strict";

const gulp = require('gulp');
const Deployment = require("./deployment.js");

const Deploy = new Deployment({
    hostName: 'raspberrypi2.local',
    projectName: 'BigRedButton',
    user: 'root',
    password: 'raspberr',
    files: 'app.js button.js twitter.js youtube.js package.json',
    startFile: 'app.js '
});

gulp.task('deploy', function () {
    return Deploy.deployProject();
});

gulp.task('npminstall', function () {
    return Deploy.restoreModules();
});

gulp.task('run', function () {
    return Deploy.runApp();
});

gulp.task('exit', function() {
    return Deploy.killApp();
});