const canvas = document.getElementById('canvasTest');
const ctx = canvas.getContext('2d');

// canvas.width = document.documentElement.clientWidth || document.body.clientWidth;
// canvas.height = document.documentElement.clientHeight || document.body.clientHeight;

function rect_create(x, y, w, h, color, dx, dy) {
    let obj = {
        x: x,
        y: y,
        w: w,
        h: h,
        color: color,
        dx: dx,
        dy: dy,
        draw: rect_draw
    }
    return obj
}

let rect = rect_create(10, 20, 30, 50, 'red', 3, 5)
let rect2 = rect_create(100, 20, 30, 50, 'green', 3, 5)

let gameobjects = [
    rect,
    // rect2
]

let frame = 0

const colors = ['blue', 'red', 'yellow']

function gameLoop() {
    // ctx.fillStyle = 'white';
    // ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const obj of gameobjects)
        obj.draw()

    frame += 1
    if (frame % 30 == 0) {
        gameobjects.push(rect_create(30, 20, 100, 100, colors[Math.floor(Math.random() * colors.length)], 3, 8))
    }
}

function rect_draw() {
    // ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.beginPath()
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath()

    if (!this.offset) this.offset = frame
    this.x = canvas.width / 2 + Math.cos(frame / 15 + this.offset) * (canvas.width / 10) * this.space
    this.y = canvas.height / 2 + Math.sin(frame / 15 + this.offset) * (canvas.height / 10) * this.space
    this.space = this.space == undefined ? 1 : (this.space + 0.01)
    // this.x += this.dx
    // this.y += this.dy
}

let gyroscope = new Gyroscope({
    frequency: 60
});

let gyroValue = {
    x: 0,
    y: 0,
    z: 0
}
gyroscope.addEventListener('reading', e => {
    gyroValue.x += gyroscope.x
    gyroValue.y += gyroscope.y
    gyroValue.z += gyroscope.z
    document.getElementById("gyro").innerHTML = Math.floor(gyroValue.x) + "<br>" + Math.floor(gyroValue.y) + "<br>" + Math.floor(gyroValue.z)
});
gyroscope.start();

let accelerometer = new Accelerometer({
    frequency: 60
});

accelerometer.addEventListener('reading', e => {
    document.getElementById("accele").innerHTML = Math.floor(accelerometer.x) + "<br>" + Math.floor(accelerometer.y) + "<br>" + Math.floor(accelerometer.z)
});
accelerometer.start();

// setInterval(gameLoop, 1000 / 60)
/* const canvas = document.getElementById('canvasTest');
const ctx = canvas.getContext('2d');



let x = 0
let y = 0
let directionHorizontal = true
let directionVertical = true
canvas.width = document.documentElement.clientWidth || document.body.clientWidth;
canvas.height = document.documentElement.clientHeight || document.body.clientHeight;
var ongoingTouches = [];

var img = new Image()
img.src = "img/DVD_video_logo.png"

function gameLoop(){

    ctx.fillStyle = "white"
    ctx.fillRect(0,0,canvas.width,canvas.height)

    ctx.drawImage(img,x,y,100,100)
    
    if(directionHorizontal){
        x+=3
    }
    else{
        x-=3
    }
    if(directionVertical){
        y+=3
    }
    else{
        y-=3
    }
    
    if(x>canvas.width-100 || x<0){
        directionHorizontal = !directionHorizontal
    }
    else if(y>canvas.height-100|| y<0){
        directionVertical = !directionVertical
    }
}

setInterval(gameLoop,1000 / 60)



function startup() {
    var el = document.getElementById("canvasTest");
    el.addEventListener("touchstart", handleStart, false);
    el.addEventListener("touchend", handleEnd, false);
    el.addEventListener("touchcancel", handleCancel, false);
    el.addEventListener("touchmove", handleMove, false);
}
  
  document.addEventListener("DOMContentLoaded", startup);

  function handleStart(evt) {
    evt.preventDefault();
    console.log("touchstart.");
    var el = document.getElementById("canvasTest");
    var ctx = el.getContext("2d");
    var touches = evt.changedTouches;
  
    for (var i = 0; i < touches.length; i++) {
      console.log("touchstart:" + i + "...");
      ongoingTouches.push(copyTouch(touches[i]));
      var color = colorForTouch(touches[i]);
      ctx.beginPath();
      ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false);  // a circle at the start
      ctx.fillStyle = color;
      ctx.fill();
      console.log("touchstart:" + i + ".");
    }
}

function handleMove(evt) {
    evt.preventDefault();
    var el = document.getElementById("canvasTest");
    var ctx = el.getContext("2d");
    var touches = evt.changedTouches;
  
    for (var i = 0; i < touches.length; i++) {
      var color = colorForTouch(touches[i]);
      var idx = ongoingTouchIndexById(touches[i].identifier);
  
      if (idx >= 0) {
        console.log("continuing touch "+idx);
        ctx.beginPath();
        console.log("ctx.moveTo(" + ongoingTouches[idx].pageX + ", " + ongoingTouches[idx].pageY + ");");
        ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
        console.log("ctx.lineTo(" + touches[i].pageX + ", " + touches[i].pageY + ");");
        ctx.lineTo(touches[i].pageX, touches[i].pageY);
        ctx.lineWidth = 4;
        ctx.strokeStyle = color;
        ctx.stroke();
  
        ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
        console.log(".");
      } else {
        console.log("can't figure out which touch to continue");
      }
    }
}

  function handleEnd(evt) {
    evt.preventDefault();
    console.log("touchend");
    var el = document.getElementById("canvasTest");
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
        ctx.fillRect(touches[i].pageX - 4, touches[i].pageY - 4, 8, 8);  // and a square at the end
        ongoingTouches.splice(idx, 1);  // remove it; we're done
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
      ongoingTouches.splice(idx, 1);  // remove it; we're done
    }
  }

  function colorForTouch(touch) {
    var r = touch.identifier % 16;
    var g = Math.floor(touch.identifier / 3) % 16;
    var b = Math.floor(touch.identifier / 7) % 16;
    r = r.toString(16); // make it a hex digit
    g = g.toString(16); // make it a hex digit
    b = b.toString(16); // make it a hex digit
    var color = "#" + r + g + b;
    console.log("color for touch with identifier " + touch.identifier + " = " + color);
    return color;
  }

  function ongoingTouchIndexById(idToFind) {
    for (var i = 0; i < ongoingTouches.length; i++) {
      var id = ongoingTouches[i].identifier;
  
      if (id == idToFind) {
        return i;
      }
    }
    return -1;    // not found
  }

  function copyTouch({ identifier, pageX, pageY }) {
    return { identifier, pageX, pageY };
  }*/