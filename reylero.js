var reylero = document.getElementById('reylero-arm');
var mosquitoCanvas = document.getElementById('mosquito');
var $mosquitoCanvas = $(mosquitoCanvas);

var ctx = reylero.getContext('2d');
var mouse = { x: 0, y: 0 };
var rotation = -0.3
var smoke;
var mosquito;
var isDown = false;
var handImg = new Image();
var hand2Img = new Image();
var armImg = new Image();
var smokeImage = new Image();
var mosquitoImage = new Image();
var currentMousePos = { x: -1, y: -1 };
var renderMosquito = false;

$(document).mousemove(function(evt) {
  currentMousePos.x = evt.pageX;
  currentMousePos.y = evt.pageY;

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

//579 × 719
// -170, -280
var sizeRatio = 0.7;

var arm = {
  x: -900 * sizeRatio,
  y: -700 * sizeRatio,
  width: 579 * sizeRatio,
  height: 719 * sizeRatio,
  offsetX: -170 * sizeRatio,
  offsetY: -280 * sizeRatio,
  deltaX : 115 * sizeRatio,
  deltaY : 145 * sizeRatio
};

function showMosquitoCanvas() {
  if($mosquitoCanvas.css('display') == 'block') {
    $mosquitoCanvas.css('display', 'none');
  }
}

function animationLoop() {
  window.requestAnimationFrame(animationLoop);

  if(renderMosquito) {

    if($mosquitoCanvas.css('display') == 'none') {
      $mosquitoCanvas.css('display', 'block');
    }

    mosquito.update();
    mosquito.render();
  } else {
    showMosquitoCanvas();
  }

  follow();

  var targetX = mouse.x - (reylero.width);
  var targetY = mouse.y - (reylero.height);

  var newRotation = Math.atan2(targetY, targetX) + 2;

  if(Math.abs(newRotation) > 0.1 && Math.abs(newRotation) < 0.4)
    rotation = newRotation;

  ctx.clearRect(0, 0, reylero.width, reylero.height);

  ctx.save();

  ctx.translate(reylero.width - 70, reylero.height - 70);

  ctx.rotate(rotation);

  ctx.drawImage(armImg, arm.offsetX - arm.deltaX, arm.offsetY - arm.deltaY, arm.width, arm.height);

  if(isDown && renderMosquito) {
    ctx.drawImage(hand2Img, arm.offsetX - arm.deltaX, arm.offsetY - arm.deltaY, arm.width, arm.height );
  } else {
    ctx.drawImage(handImg, arm.offsetX - arm.deltaX, arm.offsetY - arm.deltaY, arm.width, arm.height);
  }

  ctx.restore();

  if(isDown && renderMosquito) {
    smoke.update();
    smoke.render();
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

function follow() {
  var left = getLeft();
  var top = getTop();
  var $reyleroContainer = $('.reylero-container');
  var reyleroLeft = $reyleroContainer.offset().left;
  var reyleroTop = $reyleroContainer.offset().top;

  if (left < reyleroLeft) {
    renderMosquito = false;
  } else {
    renderMosquito = true;
  }

  $(mosquitoCanvas).offset({
    top: getTop(),
    left: getLeft()
  });
}

function getTop() {
  return (currentMousePos.y - ($(mosquitoCanvas).height() / 2));
}

function getLeft() {
  return (currentMousePos.x - ($(mosquitoCanvas).width() / 2));
}

function sprite(o) {
  var that = {};

  that.context = o.ctx;
  that.width = o.w;
  that.height = o.h;
  that.image = o.img;
  that.scaleRatio = o.scaleRatio;
  that.sx = o.sx;
  that.sy = o.sy;
  that.dx = o.dx;
  that.dy = o.dy;
  that.frameDelta = o.frameDelta;
  that.clear = o.clear;

  var frameIndex = 0,
    tickCount = 0,
    ticksPerFrame = o.ticksPerFrame || 0,
    numberOfFrames = o.numberOfFrames || 1;

  that.render = function(){
    if(that.clear) {
      that.context.clearRect(0, 0, that.width, that.height);
    }
    //draw animation
    var img = that.image;
    var sx = frameIndex * that.width / numberOfFrames;
    var sy = that.sy;
    var swidth = that.width / numberOfFrames;
    var sheight = that.height;

    var dx = that.dx;

    if(that.frameDelta != undefined) {
      dx = (that.frameDelta[frameIndex] * that.scaleRatio) - that.dx;
    }

    var dy = that.dy;

    var imgWidth = that.width / numberOfFrames * that.scaleRatio;
    var imgHeight = that.height * that.scaleRatio;

    that.context.drawImage( img, sx, sy, swidth, sheight, dx, dy, imgWidth, imgHeight);
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

smoke = sprite({
  w : 8050,
  h : 865,
  ctx: ctx,
  img : smokeImage,
  numberOfFrames: 7,
  ticksPerFrame: 3,
  scaleRatio : 0.3,
  sy: 0,
  sx: 0,
  dy: 0,
  dx: 0,
  clear: false
});

mosquito = sprite({
  w              : 5380,
  h              : 1000,
  ctx            : mosquitoCanvas.getContext('2d'),
  img            : mosquitoImage,
  numberOfFrames : 8,
  ticksPerFrame  : 4,
  scaleRatio     : 0.5,
  sx             : 0,
  sy             : 450,
  dx             : 250,
  dy             : 0,
  frameDelta     : [0, 80, 160, 255, 320, 420, 500, 480],
  clear: true
});


smokeImage.src = "img/smoke.png";
handImg.src = 'img/hand-1.png';
hand2Img.src = 'img/hand-2.png';
mosquitoImage.src = 'img/mosquito.png';

armImg.addEventListener('load', function() {
  animationLoop();
});

armImg.src = 'img/arm.png';
