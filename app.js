"use strict";
const GPIO = require('onoff').Gpio;
const Button = require('./button.js');

const ledGpio = new GPIO(21, 'out');
const pushGpio = new GPIO(3, 'in', 'falling');
const button = new Button(30,  10, ledGpio, pushGpio);

function exit() {
    ledGpio.writeSync(0);
    ledGpio.unexport();
    pushGpio.unexport();
    process.exit();
}

console.log("Big red button has started!")

process.on('SIGINT', exit);





