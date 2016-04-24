"use strict";
const GPIO = require('onoff').Gpio;
const Button = require('./button.js');

const ledGpio = new GPIO(21, 'out');
const buttonPushGpio = new GPIO(3, 'in', 'falling');
const buttonLedGpio = new Gpio(4, 'out');

const button = new Button(30,  10, buttonLedGpio, buttonPushGpio);

function exit() {
    ledGpio.writeSync(0);
    ledGpio.unexport();
    buttonLedGpio.writeSync(0);
    buttonLedGpio.unexport();
    buttonPushGpio.unexport();
    process.exit();
}

console.log("Big red button is on!")
ledGpio.writeSync(1);

process.on('SIGINT', exit);





