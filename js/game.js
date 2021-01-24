const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = document.documentElement.clientWidth || document.body.clientWidth;
canvas.height = document.documentElement.clientHeight || document.body.clientHeight;

let x = 0
let y = 0

let moveX = 3;
let moveY = 3;

var ongoingTouches = [];

const objs = [];
const index = getRandomIntInclusive(1, 20);

let frame = 60;

const colors = ['#a6f0c6', '#a98b98', '#4e3d53', '#0f1123']

function initialisation() {
    for (let i = 0; i < index; i++) {
        const xCircle = Math.random() * canvas.width
        const yCircle = Math.random() * canvas.height
        const rCircle = Math.random() * 30 + 20;
        const color = colors[Math.floor(Math.random() * colors.length)]
        const startAngle = Math.random() * 10 + 20;
        const endAngle = Math.random() * 10 + 30;
        const lineWidth = getRandomIntInclusive(10, 50);
        objs.push(circleCreate(xCircle, yCircle, rCircle, color, startAngle, endAngle, lineWidth))

    }
}

function circleCreate(x, y, r, color, startAngle, endAngle, lineWidth) {

    let obj = {
        xCircle: x,
        yCircle: y,
        rCircle: r,
        color: color,
        startAngle: startAngle,
        endAngle: endAngle,
        lineWidth: lineWidth,
    }
    return obj;
}

function gameLoop() {

    if (x + moveX >= canvas.width - 100 || x + moveX <= 0) {

        moveX *= -1;
    }

    if (y + moveY >= canvas.height - 100 || y + moveY <= 0) {
        moveY *= -1;
    }

    x += moveX;
    y += moveY;

    objs.forEach(drawCircle);
}

setInterval(gameLoop, 1000 / frame)
initialisation();

function drawCircle(obj) {

    ctx.beginPath();
    ctx.fillStyle = obj.color;
    ctx.arc(obj.xCircle, obj.yCircle, obj.rCircle, obj.startAngle * frame, obj.endAngle * Math.PI * frame, false);
    ctx.lineWidth = obj.lineWidth;
    //ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];

    ctx.stroke();
    ctx.fill();
    //Fait bouger les cercles
    obj.xCircle += Math.cos(frame / getRandomIntInclusive(10, 20)) * getRandomIntInclusive(1, 2);
    obj.yCircle += Math.sin(frame / getRandomIntInclusive(10, 20)) * getRandomIntInclusive(1, 2);
    ctx.closePath();
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startup() {

    canvas.addEventListener("touchstart", handleStart, false);

}

document.addEventListener("DOMContentLoaded", startup);

function handleStart(evt) {
    evt.preventDefault();
    console.log("touchstart.");

    var touches = evt.changedTouches;

    for (var i = 0; i < touches.length; i++) {
        ongoingTouches.push(copyTouch(touches[i]));

        ctx.beginPath();
        initialisation();
        objs.forEach(drawCircle);
    }
}

function handleEnd(evt) {
    evt.preventDefault();

    var el = document.getElementById("canvas");
    var ctx = el.getContext("2d");
    var touches = evt.changedTouches;

    for (var i = 0; i < touches.length; i++) {
        var color = colorForTouch(touches[i]);
        var idx = ongoingTouchIndexById(touches[i].identifier);

        if (idx >= 0) {
            ctx.lineWidth = 4;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
            ctx.lineTo(touches[i].pageX, touches[i].pageY);
            ctx.fillRect(touches[i].pageX - 4, touches[i].pageY - 4, 8, 8); // and a square at the end
            ongoingTouches.splice(idx, 1); // remove it; we're done
        } else {
            console.log("can't figure out which touch to end");
        }
    }
}

function handleCancel(evt) {
    evt.preventDefault();
    console.log("touchcancel.");
    var touches = evt.changedTouches;

    for (var i = 0; i < touches.length; i++) {
        var idx = ongoingTouchIndexById(touches[i].identifier);
        ongoingTouches.splice(idx, 1); // remove it; we're done
    }
}

function handleMove(evt) {
    evt.preventDefault();
    var el = document.getElementById("canvas");
    var ctx = el.getContext("2d");
    var touches = evt.changedTouches;


    for (var i = 0; i < touches.length; i++) {
        var color = colorForTouch(touches[i]);
        var idx = ongoingTouchIndexById(touches[i].identifier);

        if (idx >= 0) {
            console.log("continuing touch " + idx);
            ctx.beginPath();
            console.log("ctx.moveTo(" + ongoingTouches[idx].pageX + ", " + ongoingTouches[idx].pageY + ");");
            ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
            console.log("ctx.lineTo(" + touches[i].pageX + ", " + touches[i].pageY + ");");
            ctx.lineTo(touches[i].pageX, touches[i].pageY);
            ctx.lineWidth = 4;
            ctx.strokeStyle = color;
            ctx.stroke();

            ongoingTouches.splice(idx, 1, copyTouch(touches[i])); // swap in the new touch record
            console.log(".");
        } else {
            console.log("can't figure out which touch to continue");
        }
    }
}

function copyTouch({
    identifier,
    pageX,
    pageY
}) {
    return {
        identifier,
        pageX,
        pageY
    };
}

function ongoingTouchIndexById(idToFind) {
    for (var i = 0; i < ongoingTouches.length; i++) {
        var id = ongoingTouches[i].identifier;

        if (id == idToFind) {
            return i;
        }
    }
    return -1; // not found
}