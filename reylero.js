var reylero = document.getElementById('reylero-arm');
var ctx = reylero.getContext('2d');
var mouse = { x: 0, y: 0 };
var rotation = -0.3
var smoke;
var isDown = false;

$(document).mousemove(function(evt) {
  var m = getMousePos(reylero, evt);

  mouse.x = m.x;
  mouse.y = m.y;
});

$(document).mousedown(function(evt) {
  evt.preventDefault();
  isDown = true;
});

$(document).mouseup(function(evt) {
  evt.preventDefault();
  isDown = false;
});

var handImg = new Image();
var hand2Img = new Image();
var armImg = new Image();

handImg.src = 'img/hand-1.png';
hand2Img.src = 'img/hand-2.png';
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


function animationLoop() {
  window.requestAnimationFrame(animationLoop);

  var targetX = mouse.x - (reylero.width/2);
  var targetY = mouse.y - (reylero.height/2);

  var newRotation = Math.atan2(targetY, targetX) + 2;


  if(Math.abs(newRotation) > 0.1 && Math.abs(newRotation) < 0.4)
    rotation = newRotation;

  ctx.clearRect(0, 0, reylero.width, reylero.height);

  ctx.save();

  ctx.translate(reylero.width/2, reylero.height/2);

  ctx.rotate(rotation);

  //ctx.fillStyle = '#008BCC';
  //ctx.fillRect(19/2 * -1, 7/2 * -1, 19, 7);

  ctx.drawImage(armImg,arm.offsetX - 115, arm.offsetY - 145 );

  if(isDown) {
    ctx.drawImage(hand2Img, arm.offsetX - 115, arm.offsetY - 145 );
  } else {
    ctx.drawImage(handImg, arm.offsetX - 115, arm.offsetY - 145 );
  }

  ctx.restore();

  if(isDown) {
    smoke.update();
    smoke.render(0, 50);
  }
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

function sprite(o) {
  var that = {};

  that.context = o.ctx;
  that.width = o.w;
  that.height = o.h;
  that.image = o.img;
  that.scaleRatio = o.scaleRatio;
  that.offset = o.yOffset;

  var frameIndex = 0,
    tickCount = 0,
    ticksPerFrame = o.ticksPerFrame || 0,
    numberOfFrames = o.numberOfFrames || 1;

  that.render = function(canvasX, canvasY){
    //draw animation
    var img = that.image;
    var sx = frameIndex * that.width / numberOfFrames;
    var sy = that.offset;
    var swidth = that.width / numberOfFrames;
    var sheight = that.height;
    var cx = canvasX || 0;
    var cy = canvasY || 0;
    var imgWidth = that.width / numberOfFrames * that.scaleRatio;
    var imgHeight = that.height * that.scaleRatio;

    that.context.drawImage( img, sx, sy, swidth, sheight, cx, cy, imgWidth, imgHeight);
  };

  that.update = function(){
    tickCount += 1;

    if (tickCount > ticksPerFrame) {

      tickCount = 0;

      // If the current frame index is in range
      if (frameIndex < numberOfFrames - 1) {
        // Go to the next frame
        frameIndex += 1;
      } else {
        frameIndex = 0;
      }
    }
  };
  return that;
}

var smokeImage = new Image();
smokeImage.src = "img/smoke.png";
smoke = sprite({
  w : 8050,
  h : 865,
  ctx: ctx,
  img : smokeImage,
  numberOfFrames: 7,
  ticksPerFrame: 3,
  scaleRatio : 0.5,
  yOffset: 0
});

animationLoop();
