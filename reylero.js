var reylero = document.getElementById('reylero-arm');
var ctx = reylero.getContext('2d');
var mouse = { x: 0, y: 0 };
var rotation = -0.3

$(document).mousemove(function(evt) {

  var m = getMousePos(reylero, evt);

  mouse.x = m.x;
  mouse.y = m.y;
});

var handImg = new Image();
var armImg = new Image();

handImg.src = 'img/hand-1.png'
armImg.src = 'img/arm.png';

//579 × 719
// -170, -280
var arm = {
  x: -900,
  y: -700,
  width: 579,
  height: 719,
  offsetX: -170,
  offsetY: -280
};


function armLoop() {
  window.requestAnimationFrame(armLoop);

  var targetX = mouse.x - (reylero.width/2);
  var targetY = mouse.y - (reylero.height/2);

  var newRotation = Math.atan2(targetY, targetX) + 2;


  if(Math.abs(newRotation) > 0.1 && Math.abs(newRotation) < 0.4)
    rotation = newRotation;

  ctx.clearRect(0, 0, reylero.width, reylero.height);

  ctx.save();

  ctx.translate(reylero.width/2, reylero.height/2);

  ctx.rotate(rotation);

  ctx.fillStyle = '#008BCC';
  ctx.fillRect(19/2 * -1, 7/2 * -1, 19, 7);

  ctx.drawImage(armImg,arm.offsetX - 115, arm.offsetY - 145 );

  ctx.drawImage(handImg, arm.offsetX - 115, arm.offsetY - 145 );

  ctx.restore();
}

function getMousePos(canvas, evt)
{
  var rect = canvas.getBoundingClientRect();
  var mouseX = evt.clientX - rect.top;
  var mouseY = evt.clientY - rect.left;
  return {
      x: mouseX,
      y: mouseY
  };
}

armLoop();
