/*! tiltscroll Version: 1.0.0 | (C) Sayanee Basu 2014, released under an MIT license */
(function(root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory;
  } else {
    root.tiltscroll = factory();
  }
})(this, function() {
  'use strict';

  var tiltscroll = {
    status: false,
    zeroPositionAngle: 0,
    zeroPositionScrollHeight: 0,
    velocity: 0,
    displacement: 0,
    tiltTB: 0,
    scrollHeight: 0
  };
  var w = window;
  var d = document;

  tiltscroll.init = function(options) {

    options = options || {};

    // smoothing factor 0 to 1 (http://en.wikipedia.org/wiki/Exponential_smoothing)
    var smoothingFactor = options.smoothing || 0.1;

    // device tilting to scroll will be disabled after this time (in milliseconds)
    var scrollTimeout = options.timeout || 10000;

    // minimum tilt change (deg) for the period of timeout will disable scrolling by device tilt
    var minVelocityThreshold = options.minVelocity || 0.03;

    // how fast should the page scroll
    var scrollSpeed = options.speed || 10;

    tiltscroll.status = false;

    var tiltTBprev = 0; // device tilt (top-bottom) angle previous value
    var tiltTBcurr = 0; // device tilt (top-bottom) angle current value

    var first = false;
    var scrollHeightNorm = 0;
    var noMotionTimeout;
    var tiltTBsmooth = 0;

    w.addEventListener('load', function() {

      // when users start scrolling by finger touch
      w.addEventListener('touchstart', function() {
        tiltscroll.status = false;
        emitStatusChangeEvent();
      });

      // when users start scrolling by device tilt
      w.addEventListener('touchend', function() {
        tiltscroll.status = true;
        emitStatusChangeEvent();
        first = false;
      });
    });

    w.addEventListener('deviceorientation', function(event) {
      if (!first) {
        tiltscroll.zeroPositionAngle = Math.abs(90 - event.beta);
        tiltscroll.zeroPositionScrollHeight = d.body.scrollTop;
        scrollHeightNorm = tiltscroll.zeroPositionScrollHeight;
        first = true;
      }
      if (tiltscroll.status) {
        tiltTBcurr = Math.abs(90 - event.beta);
        tiltTBprev = tiltTBprev || tiltTBcurr; // top-bottom

        tiltTBsmooth = smooth(tiltTBcurr, tiltTBprev, smoothingFactor);

        if (tiltscroll.displacement > 0 && tiltscroll.velocity < 0) {
          // scroll page forward
          scrollHeightNorm += scrollSpeed / 150 * Math.abs(tiltscroll.displacement);
        } else if (tiltscroll.displacement < 0 && tiltscroll.velocity > 0) {
          // scroll page back
          scrollHeightNorm -= scrollSpeed / 150 * Math.abs(tiltscroll.displacement);
        }

        tiltscroll.velocity = tiltTBsmooth - tiltTBprev;
        tiltscroll.displacement = tiltscroll.zeroPositionAngle - tiltTBsmooth;
        tiltscroll.tiltTB = tiltTBsmooth;
        tiltscroll.scrollHeight = scrollHeightNorm;
        emitScrollTiltInProgress();

        // scroll page
        w.scrollTo(0, scrollHeightNorm);
        tiltTBprev = tiltTBsmooth;

        if (Math.abs(tiltscroll.velocity) < minVelocityThreshold) {
          if (!noMotionTimeout) {
            noMotionTimeout = w.setTimeout(function() {
              tiltscroll.status = false;
              emitStatusChangeEvent();
            }, scrollTimeout);
          }
        } else {
          w.clearTimeout(noMotionTimeout);
          noMotionTimeout = null;
        }
      }
    });
  };

  function smooth(dataCurr, dataPrev, smoothingFactor) {
    return dataCurr * smoothingFactor + dataPrev * (1 - smoothingFactor);
  }

  function emitStatusChangeEvent() {
    var statusChangeEvent = new Event('scrolltiltStatusChange');

    statusChangeEvent.status = tiltscroll.status;
    statusChangeEvent.zeroPositionAngle = tiltscroll.zeroPositionAngle;
    statusChangeEvent.zeroPositionScrollHeight = tiltscroll.zeroPositionScrollHeight;

    w.dispatchEvent(statusChangeEvent);
  }

  function emitScrollTiltInProgress() {
    var statusChangeEvent = new Event('scrollTiltInProgress');

    statusChangeEvent.velocity = tiltscroll.velocity;
    statusChangeEvent.displacement = tiltscroll.displacement;
    statusChangeEvent.tiltTB = tiltscroll.tiltTB;
    statusChangeEvent.scrollHeight = tiltscroll.scrollHeight;

    w.dispatchEvent(statusChangeEvent);
  }

  return tiltscroll;

});
