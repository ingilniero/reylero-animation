var reylero = document.getElementById('reylero');
var ctx = reylero.getContext('2d');
var mouse = { x: -1, y: -1 };

$(document).mousemove(function(evt) {

  var m = getMousePos(reylero, evt);

  mouse.x = m.x;
  mouse.y = m.y;
});

var arm = {
  x: 200,
  y: 600,
  width: 500,
  height: 100
};

function armLoop() {
  window.requestAnimationFrame(armLoop);

  var targetX = mouse.x - arm.x;
  var targetY = mouse.y - arm.y;

  var rotation = Math.atan2(targetY, targetX);

  ctx.clearRect(0, 0, reylero.width, reylero.height);

  ctx.save();

  ctx.translate(arm.x + arm.width/2, arm.y + arm.height/2);

  ctx.rotate(rotation);

  ctx.fillStyle = '#008BCC';

  ctx.fillRect(arm.width/2 * -1,
               arm.height/2 * -1,
               arm.width,
               arm.height);
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
