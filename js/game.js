const canvas = document.getElementById('canvasTest');
const ctx = canvas.getContext('2d');

let x = 0
let y = 0
const CUBE_SIZE_X = 100;
const CUBE_SIZE_Y = 100;

let directionHorizontal = true
let directionVertical = true

var img = new Image();
img.src = "img/DVD_video_logo.png";

let acl = new Accelerometer({frequency: 60});

acl.addEventListener('reading', () => {
    x += acl.x;
  console.log("Acceleration along the X-axis " + acl.x);
  console.log("Acceleration along the Y-axis " + acl.y);
  console.log("Acceleration along the Z-axis " + acl.z);
});

acl.start();

function gameLoop()
{
    ctx.fillStyle = "white"
    ctx.fillRect(0,0,canvas.width = screen.width,canvas.height = screen.height)

    ctx.fillStyle = 'red';
    ctx.drawImage(img, x, y, CUBE_SIZE_X, CUBE_SIZE_Y)

    if(directionHorizontal)
    {
        x+=3
    }
    else
    {
        x-=3
    }
    if(directionVertical)
    {
        y+=3
    }
    else
    {
        y-=3
    }

    if(x>screen.width-100  || x<0)
    {
        directionHorizontal = !directionHorizontal
    }
    else if(y>screen.height-100 || y<0)
    {
        directionVertical = !directionVertical
    }

}
setInterval(gameLoop,1000 / 60)

