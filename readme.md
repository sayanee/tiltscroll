#tiltscroll 

###[demo](http://sayan.ee/tiltscroll/) - *open in mobile*

> Tilt device to scroll a webpage page with configurable options and events.

##install

1. in browser `<script src="dist/tiltscroll.js"></script>`
- bower `bower install tiltscroll`

##getting started

1. call `tiltscroll` in your script

	```
	tiltscroll.init();
	```
- (optional) pass in various options
	1.  smoothing
	- timeout
	- minVelocity
	- speed

	```
	tiltscroll.init({
		'smoothing': 0.1, // smoothen device tilt data from accelerometer
		'timeout': 10000, // disable scroll by tilting by this time (in millisenconds)
		'minVelocity': 0.03, // minimum tilt change (in deg) below which the timeout will trigger
		'speed': 10 // speed of scrolling
	});
	```

	The above values are set by default and are overridden if the user specifies them.
- (optional) listen for events
	1. scrolltiltStatusChange
	- scrollTiltInProgress

	```
	window.addEventListener('scrolltiltStatusChange', function(event) {
		console.log(event.status); // scroll by device tilting is enabled or disabled
		console.log(event.zeroPositionAngle); // zero position tilt angle for scrolling reference
		console.log(event.zeroPositionScrollHeight); // zero position scroll height for scrolling reference
	});

	window.addEventListener('scrollTiltInProgress', function(event) {
		console.log(event.velocity); // change in tilt degree
		console.log(event.displacement); // change from zero position tilt degree
		console.log(event.tiltTB); // current tilt degrees
		console.log(event.scrollHeight); // current scroll position
	});
	```


##inspiration

1. [How To Make Tilt Scrolling That Doesn’t Suck](http://www.marco.org/2014/07/24/tilt-scrolling-that-doesnt-suck) by Marco Arment
- [Tilt - acceleremeter scroll plugin](http://www.murraypicton.com/plugins/tilt/)
- [Detecting device orientation](https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation) by MDN
- [This End Up: Using Device Orientation](http://www.html5rocks.com/en/tutorials/device/orientation/) by HTML5Rocks
