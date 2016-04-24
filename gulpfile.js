"use strict";

const gulp = require('gulp');
const Deployment = require("./deployment.js");

const Deploy = new Deployment({
    hostName: 'pi-ipnumber',
    projectName: 'BigRedButton',
    user: 'pi-user',
    password: 'pi-password',
    files: ['app.js', 'button.js', 'twitter.js', 'youtube.js', 'package.json'],
    startFile: 'app.js '
});

gulp.task('deploy', function () {
    return Deploy.deployProject();
});

gulp.task('run', function () {
    return Deploy.run();
});

gulp.task('modules', function () {
    return Deploy.restoreModules();
});

gulp.task('stop', function () {
    return Deploy.stop();
});