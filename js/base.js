var $body;
var $ipad;
var $specular;
var $homeBtn;
var $next;
var $prev;
var $examples;
var $descriptions;
var $qrs;
var $mobileLenticular;
var $lenticularWrapper;
var $closeBtn;
var bodyWidth;
var bodyHeight;
var sexyLenticular;
var lamboLenticular;
var swansonLenticular;
var currentExample;
var windowWidth;
var zRotation;
var xPosition;
var mouseX;
var mouseY;
var currentLenticular;
var lenticular;
var transformProperty;
var transitionProperty;
var transitionEndProperty;
var NUM_EXAMPLES =  3;
var TRANSITION_END_EVENTS = {
	'WebkitTransition': 'webkitTransitionEnd',
	'MozTransition': 'transitionend',
	'OTransition': 'oTransitionEnd',
	'msTransition': 'MSTransitionEnd',
	'transition': 'transitionend'
};





/*------------------------------

	Initialize

------------------------------*/

$(document).ready(function() {

	if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
		$('.spacer').remove();
		$('.example').remove();
	} else {
		$('.spacer').css('height', '387px');
		$body = $('body');
		$ipad = $('.example .ipad');
		$specular = $('.example .specular');
		$next = $('.next');
		$prev = $('.previous');
		$examples = $('.example');
		// $descriptions = $('.description');
		$qrs = $('.qr');
		$mobileLenticular = $('.mobile-lenticular');
		$closeBtn = $('.mobile-close-btn');
		transformProperty = domToCss(Modernizr.prefixed('transform'));
		transitionProperty = domToCss(Modernizr.prefixed('transition'));
		transitionEndProperty = TRANSITION_END_EVENTS[Modernizr.prefixed('transition')];
		windowWidth =  $(window).width();
		bodyWidth = $body.width();
		bodyHeight = $body.height();
		currentExample = 0;

		if(bodyWidth < bodyHeight) {
			$body.addClass('is-portrait');
		} else {
			$body.addClass('is-landscape');
		}

		swansonLenticular = new Lenticular.Image($('.swanson')[0], {
			images: 'images/sequence1/png##.png',
			frames: 13,
			useTilt: false
		});
		swansonLenticular.showFrame(0);

		$body.bind('mousemove', setMouseCoords);
		setCurrent();
	}
});





/*------------------------------

	Examples

------------------------------*/

function showLenticular(e) {
	e.preventDefault();

	$lenticularWrapper = $('<div class="lenticular-wrapper">');
	$mobileLenticular.append($lenticularWrapper);

	switch($(e.target).attr('class')) {
		case 'swanson-link':
			lenticular = new Lenticular.Image($lenticularWrapper[0], {
				images: 'images/sequence1/png##.png',
				frames: 13
			});
			$mobileLenticular.css('background-color', '#000');
			$mobileLenticular.find('img').css('width', '100%');
			$lenticularWrapper.addClass('swanson-lenticular-wrapper');
			break;
	}
	$mobileLenticular.show();
	$closeBtn.css('display', 'block');
}

function hideLenticular(e) {
	e.preventDefault();
	lenticular.destroy();
	$mobileLenticular.hide();
	$closeBtn.css('display', 'none');
	$lenticularWrapper.remove();
}

function moveIpad(e) {
	var horizontal = mouseX / bodyWidth;
	var vertical = mouseY / bodyHeight;

	// determine the frame to show based on the mouse's x coordinate
	currentLenticular.showFrame(Math.round(horizontal * (currentLenticular.frames - 1)));

	// tilt the iPad
	$ipad.css(transformProperty, 'translateZ(' + zPosition + 'px) translateX(' + xPosition +'px) ' + 'rotateY(' + (-10 + (20 * horizontal)) + 'deg) rotateX(' + (3 - (6 * vertical)) + 'deg) rotateZ(' + zRotation + 'deg)');

	// tweak the specular
	$specular.css(transformProperty, 'translate3d(' + ((zRotation == 0 || zRotation == 90 ? 1 : -1) * -(-50 + (250 * horizontal))) + 'px, ' + (-100 * vertical) + 'px, 0) rotate(' + (30 - zRotation) + 'deg)');
	$specular.css('opacity', 1 - (vertical * .5));
}

function nextExample(e) {
	currentExample = currentExample + 1 < NUM_EXAMPLES ? currentExample + 1 : 0;
	setCurrent();
}

function prevExample(e) {
	currentExample = currentExample - 1 > -1 ? currentExample - 1 : NUM_EXAMPLES - 1;
	setCurrent();
}

function setCurrent() {
	var timer;

	$body.unbind('mousemove', moveIpad);
	$next.unbind('click', nextExample);
	$prev.unbind('click', prevExample);

	var horizontal = mouseX / bodyWidth || 0;
	var vertical = mouseY / bodyHeight || 0;
	var marginLeft;
	var marginTop;

	if(currentLenticular) {
		currentLenticular.element.style.opacity = 0;
	}

	zRotation = -100;
	xPosition = -100;
	zPosition = 0;
	marginLeft = -290;
	marginTop = -340;
	currentLenticular = swansonLenticular;

	currentLenticular.showFrame(Math.round(horizontal * (currentLenticular.frames - 1)));
	currentLenticular.element.style.opacity = 1;
	// $descriptions.css('opacity', 0);
	// $descriptions[currentExample].style.opacity = 1;
	// $qrs.css('opacity', 0);
	// $qrs[currentExample].style.opacity = 1;

	$ipad.bind(transitionEndProperty, function(e) {
		if(!timer) {
			timer = setTimeout(function() {
				$ipad.css(transitionProperty, 'none');
				$body.bind('mousemove', moveIpad);
				$next.bind('click', nextExample);
				$prev.bind('click', prevExample);
			}, 350);
		}
	});

	$ipad.css({
		'margin-left': marginLeft + 'px',
		'margin-top': marginTop + 'px'
	});
	$ipad.css(transitionProperty, 'all .75s ease-in-out');
	$ipad.css(transformProperty, 'translateZ(' + zPosition + 'px) translateX(' + xPosition +'px) ' + 'rotateY(' + (-10 + (20 * horizontal)) + 'deg) rotateX(' + (3 - (6 * vertical)) + 'deg) rotateZ(' + zRotation + 'deg)');

	$specular.bind(transitionEndProperty, function(e) {
		$specular.css(transitionProperty, 'none');
	});
	$specular.css(transitionProperty, 'all .75s ease-in-out');
	$specular.css(transformProperty, 'translate3d(' + ((zRotation == 0 || zRotation == 90 ? 1 : -1) * -(-50 + (250 * horizontal))) + 'px, ' + (-100 * vertical) + 'px, 0) rotate(' + (30 - zRotation) + 'deg)');
	$specular.css('opacity', 1 - (vertical * .5));
}





/*------------------------------

	Utilities

------------------------------*/

function domToCss(property) {
	var css = property.replace(/([A-Z])/g, function(str, m1) {
		return '-' + m1.toLowerCase();
	}).replace(/^ms-/, '-ms-');

	return css;
}

function preventScroll(e) {
	e.preventDefault();
}

function setMouseCoords(e) {
	mouseX = e.pageX;
	mouseY = e.pageY;
}

function updateOrientation(e) {
	if(window.orientation == 0) {
		$body.removeClass('is-landscape').addClass('is-portrait');
	} else {
		$body.removeClass('is-portrait').addClass('is-landscape');
	}
	$(window).scrollTop(0).scrollLeft(0);
}