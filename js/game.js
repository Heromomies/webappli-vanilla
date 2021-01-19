var jardin = document.querySelector('.jardin'),
    balle = document.querySelector('.balle'),
    resultat = document.querySelector('.resultat'),
    maxX = jardin.clientWidth  - balle.clientWidth,
    maxY = jardin.clientHeight - balle.clientHeight;

function handleOrientation(event) {
  var x = event.beta,  // En degré sur l'interval [-180,180].
      y = event.gamma; // En degré sur l'interval [-90,90].

  resultat.innerHTML  = "beta : " + x + "<br />";
  resultat.innerHTML += "gamma: " + y + "<br />";

  // Parce-que l'on ne veut pas avoir l'appareil à l'envers.
  // On restreint les valeurs de x à l'intervalle [-90,90].
  if (x >  90) { x =  90};
  if (x < -90) { x = -90};
  // Pour rendre le calcul plus simple.
  // On délimite l'intervalle de x et y sur [0, 180].
  x += 90;
  y += 90;

  // 10 est la moitié de la taille de la balle.
  // Cela centre le point de positionnement au centre de la balle.

  balle.style.top  = (maxX * x / 180 - 10) + "px";
  balle.style.left = (maxY * y / 180 - 10) + "px";
}

window.addEventListener('deviceorientation', handleOrientation);


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