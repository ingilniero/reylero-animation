/*
  Kevin Faulhaber Fire Animation
*/

/*
  Paul Irish: http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
*/

(function() {
  var lastTime = 0;
  var vendors = ['webkit', 'moz'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                                 timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

    if (!window.cancelAnimationFrame)
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
}());

var fire;

function launch()
{
  fire = sprite({
    w       : 1999,
    h       : 550,
    ctx     : fireCanvas.getContext('2d'),
    img     : fireImage,
    numberOfFrames: 7,
    ticksPerFrame: 3
  });
  fireLoop();
}

function sprite(o)
{
  var that = {};

  that.context = o.ctx;
  that.width = o.w;
  that.height = o.h;
  that.image = o.img;
  that.scaleRatio = .5;
  var frameIndex = 0,
    tickCount = 0,
    ticksPerFrame = o.ticksPerFrame || 0,
    numberOfFrames = o.numberOfFrames || 1;

  that.render = function(){
    that.context.clearRect(0, 0, that.width, that.height);
    //draw animation
    that.context.drawImage(
      that.image,
      frameIndex * that.width / numberOfFrames,
      0,
      that.width / numberOfFrames,
      that.height,
      0,
      0,
      that.width / numberOfFrames * that.scaleRatio,
      that.height * that.scaleRatio);
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

function fireLoop()
{
  window.requestAnimationFrame(fireLoop);
  fire.update();
  fire.render();
  console.log('you spin me right round baby right round');
  follow();
}

var fireImage = new Image();
// Load sprite sheet
fireImage.addEventListener("load", launch);
fireImage.src = "fire4.png";

var fireCanvas = document.getElementById('fireCanvas');
fireCanvas.width = 150;
fireCanvas.height = 265;
$(fireCanvas).offset({top: -1, left: -1});

function follow()
{
  $(fireCanvas).offset({
    top: getTop(),
    left: getLeft()
  });

}

function getTop()
{
  return (currentMousePos.y - ($(fireCanvas).height() / 2));
}

function getLeft()
{
  return (currentMousePos.x - ($(fireCanvas).width() / 2));
}

var currentMousePos = { x: -1, y: -1 };
$(document).mousemove(function(event) {
  currentMousePos.x = event.pageX;
  currentMousePos.y = event.pageY;
});

