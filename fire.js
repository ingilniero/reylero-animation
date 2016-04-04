/*
  Kevin Faulhaber Fire Animation
*/

var fire;
var mosquito;

function launch() {
  //2000 × 571
  fire = sprite({
    w       : 2000,
    h       : 550,
    ctx     : fireCanvas.getContext('2d'),
    img     : fireImage,
    numberOfFrames: 7,
    ticksPerFrame: 3,
    scaleRatio : .5,
    yOffset    : 0
  });

  //5381 × 1012
  mosquito = sprite({
    w              : 5380,
    h              : 1000,
    ctx            : mosquitoCanvas.getContext('2d'),
    img            : mosquitoImage,
    numberOfFrames : 8,
    ticksPerFrame  : 5,
    scaleRatio     : 1,
    yOffset        : 450
  });

  animationLoop();
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

  that.render = function(){
    console.log('render');
    //that.context.clearRect(0, 0, that.width, that.height);
    //draw animation
    var img = that.image;
    var sx = frameIndex * that.width / numberOfFrames;
    var sy = that.offset;
    var swidth = that.width / numberOfFrames;
    var sheight = that.height;
    var cx = 0;
    var cy = 0;
    var imgWidth = that.width / numberOfFrames * that.scaleRatio;
    var imgHeight = that.height * that.scaleRatio;
    that.context.drawImage(
      img,
      sx,
      sy,
      swidth,
      sheight,
      cx,
      cy,
      imgWidth,
      imgHeight);
  };

  that.update = function(){
    console.log('update');
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

function animationLoop() {
  window.requestAnimationFrame(animationLoop);

  fire.update();
  fire.render();

  mosquito.update();
  mosquito.render();

  //follow();
}

var mosquitoImage = new Image();
mosquitoImage.src = 'mosquito.png';

var fireImage = new Image();
// Load sprite sheet
fireImage.addEventListener("load", launch);
fireImage.src = "fire4.png";

var fireCanvas = document.getElementById('fireCanvas');
fireCanvas.width = 2000;
fireCanvas.height = 300;

var mosquitoCanvas = document.getElementById('mosquitoCanvas');
mosquitoCanvas.width = 5380;
mosquitoCanvas.height = 200;

$(mosquitoCanvas).offset({top: -1, left: -1});

function follow() {
  $(mosquitoCanvas).offset({
    top: getTop(),
    left: getLeft()
  });
}

function getTop() {
  return (currentMousePos.y - ($(fireCanvas).height() / 2));
}

function getLeft() {
  return (currentMousePos.x - ($(fireCanvas).width() / 2));
}

var currentMousePos = { x: -1, y: -1 };

$(document).mousemove(function(event) {
  currentMousePos.x = event.pageX;
  currentMousePos.y = event.pageY;
});

