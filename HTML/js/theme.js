/*
================================================================
* Template:  	 Simone - Personal Portfolio Template
* Written by: 	 Harnish Design - (http://www.harnishdesign.net)
* Description:   Main Custom Script File
================================================================
*/

(function ($) {
	"use strict";

// Preloader
$(window).on('load', function () {
	$('.lds-ellipsis').fadeOut(); // will first fade out the loading animation
	$('.preloader').delay(333).fadeOut('slow'); // will fade out the white DIV that covers the website.
	$('body').delay(333);
});


// Header Sticky
$(window).on('scroll',function() {
	var stickytop = $('#header.sticky-top .bg-transparent');
	var stickytopslide = $('#header.sticky-top-slide');
	
	if ($(this).scrollTop() > 1){  
		stickytop.addClass("sticky-on-top");
		stickytop.find(".logo img").attr('src',stickytop.find('.logo img').data('sticky-logo'));
	}
	else {
		stickytop.removeClass("sticky-on-top");
		stickytop.find(".logo img").attr('src',stickytop.find('.logo img').data('default-logo'));
	}
	
	if ($(this).scrollTop() > 180){  
		stickytopslide.find(".primary-menu").addClass("sticky-on");
		stickytopslide.find(".logo img").attr('src',stickytopslide.find('.logo img').data('sticky-logo'));
	}
	else{
		stickytopslide.find(".primary-menu").removeClass("sticky-on");
		stickytopslide.find(".logo img").attr('src',stickytopslide.find('.logo img').data('default-logo'));
	}
});

// Sections Scroll
if($("body").hasClass("side-header")){
$('.smooth-scroll').on('click', function() {
	event.preventDefault();
    var sectionTo = $(this).attr('href');
	$('html, body').stop().animate({
      scrollTop: $(sectionTo).offset().top}, 1500, 'easeInOutExpo');
});
   }else {
$('.smooth-scroll').on('click', function() {
	event.preventDefault();
    var sectionTo = $(this).attr('href');
	$('html, body').stop().animate({
      scrollTop: $(sectionTo).offset().top - 50}, 1500, 'easeInOutExpo');
});
}

// Mobile Menu
$('.navbar-toggler').on('click', function() {
	$(this).toggleClass('show');
});
$(".navbar-nav a").on('click', function() {
    $(".navbar-collapse, .navbar-toggler").removeClass("show");
});

// Overlay Menu & Side Open Menu
$('.navbar-side-open .collapse, .navbar-overlay .collapse').on('show.bs.collapse hide.bs.collapse', function(e) {
    e.preventDefault();
}),
$('.navbar-side-open [data-bs-toggle="collapse"], .navbar-overlay [data-bs-toggle="collapse"]').on('click', function(e) {
   e.preventDefault();
   $($(this).data('bs-target')).toggleClass('show');
})

/*---------------------------------
   Carousel (Owl Carousel)
----------------------------------- */
$(".owl-carousel").each(function (index) {
    var a = $(this);
	if ($("html").attr("dir") == 'rtl') {
		var rtlVal = true
	}else{
		var rtlVal = false
    }
	$(this).owlCarousel({
		rtl: rtlVal,
		autoplay: a.data('autoplay'),
		center: a.data('center'),
		autoplayTimeout: a.data('autoplaytimeout'),
		autoplayHoverPause: a.data('autoplayhoverpause'),
		loop: a.data('loop'),
		speed: a.data('speed'),
		nav: a.data('nav'),
		dots: a.data('dots'),
		autoHeight: a.data('autoheight'),
		autoWidth: a.data('autowidth'),
		margin: a.data('margin'),
		stagePadding: a.data('stagepadding'),
		slideBy: a.data('slideby'),
		lazyLoad: a.data('lazyload'),
		navText:['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
		animateOut: a.data('animateout'),
		animateIn: a.data('animatein'),
		video: a.data('video'),
		items: a.data('items'),
		responsive:{
        0:{items: a.data('items-xs'),},
        576:{items: a.data('items-sm'),},
		768:{items: a.data('items-md'),},
        992:{items: a.data('items-lg'),}
        }
    });
});

/*------------------------------------
    Magnific Popup
-------------------------------------- */
// Image on Modal
$('.popup-img-gallery').each(function() {
$(this).magnificPopup({
    delegate: '.popup-img:visible',
	type: "image",
	tLoading: '<div class="preloader"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>',
    closeOnContentClick: !0,
    mainClass: "mfp-fade",
    gallery: {
        enabled: true,
        navigateByImgClick: true,
        preload: [0, 1]
    },
});
});

// Ajax On Modal 
$('.popup-ajax-gallery').each(function() {
$(this).magnificPopup({
	delegate: '.popup-ajax:visible',
    type: "ajax",
	tLoading: '<div class="preloader"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>',
	mainClass: "mfp-fade",
	closeBtnInside: true,
	midClick: true,
	gallery: {
      enabled: true,
    },
	callbacks: {
		ajaxContentAdded: function() {
			$(".owl-carousel").each(function (index) {
			  var a = $(this);
			  if ($("html").attr("dir") == 'rtl') {
		var rtlVal = true
	}else{
		var rtlVal = false
    }
	$(this).owlCarousel({
		rtl: rtlVal,
				autoplay: a.data('autoplay'),
				center: a.data('center'),
				autoplayTimeout: a.data('autoplaytimeout'),
				autoplayHoverPause: a.data('autoplayhoverpause'),
				loop: a.data('loop'),
				speed: a.data('speed'),
				nav: a.data('nav'),
				dots: a.data('dots'),
				autoHeight: a.data('autoheight'),
				autoWidth: a.data('autowidth'),
				margin: a.data('margin'),
				stagePadding: a.data('stagepadding'),
				slideBy: a.data('slideby'),
				lazyLoad: a.data('lazyload'),
				navText:['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
				animateOut: a.data('animateOut'),
				animateIn: a.data('animateIn'),
				video: a.data('video'),
				items: a.data('items'),
				responsive:{
					0:{items: a.data('items-xs'),},
					576:{items: a.data('items-sm'),},
					768:{items: a.data('items-md'),},
					992:{items: a.data('items-lg'),}
				}	
                });
            });
         }
    }
});
});

// YouTube/Viemo Video & Gmaps
$('.popup-youtube, .popup-vimeo, .popup-gmaps').each(function() {
$(this).magnificPopup({
        type: 'iframe',
		mainClass: 'mfp-fade',
});
});

/*------------------------------------
    Isotope Portfolio Filter
-------------------------------------- */
$(window).on('load', function () {
$(".portfolio-filter").each(function() {
    var e = $(this);
	e.imagesLoaded(function () {
	if ($("html").attr("dir") == 'rtl') {
		var rtlVal = false
	}else{
		var rtlVal = true;
    }
	var $grid = e.isotope({
			layoutMode: "masonry",
			originLeft: rtlVal
		});
	$(".portfolio-menu").find("a").on("click", function() {
        var filterValue = $(this).attr("data-filter");
        return $(".portfolio-menu").find("a").removeClass("active"), $(this).addClass("active"), 
		$grid.isotope({
          filter: filterValue
        }), !1
    });
	});
	});
});

/*------------------------------------
    Parallax Background
-------------------------------------- */
$(".parallax").each(function () {
$(this).parallaxie({
	speed: 0.5,
});
});

/*------------------------------------
    Counter
-------------------------------------- */
$(".counter").each(function () {
    $(this).appear(function () {
        $(this).countTo({
			speed: 1800,
		});
    });
});

/*------------------------------------
    Typed
-------------------------------------- */
$(".typed").each(function() {
var typed = new Typed('.typed', {
    stringsElement: '.typed-strings',
	loop: true,
	typeSpeed: 100,
    backSpeed: 50,
	backDelay: 1500,
});
});

/*------------------------------------
    YTPlayer YouTube Background
-------------------------------------- */

$(".player").each(function () {
    $(this).mb_YTPlayer();
});

/*------------------------
   tooltips
-------------------------- */
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

/*------------------------
   Memory Map
-------------------------- */
$(function () {
	var $mapContainer = $('#memory-map');
	if (!$mapContainer.length) {
		return;
	}

	if (typeof window.L === 'undefined') {
		$mapContainer.addClass('bg-light d-flex align-items-center justify-content-center text-muted text-center');
		$mapContainer.html('<span>地图组件未能加载，请检查网络连接。</span>');
		return;
	}

	var defaultCenter = [31.2304, 121.4737];
	var defaultZoom = 4;
	var map = L.map($mapContainer[0], {
		center: defaultCenter,
		zoom: defaultZoom,
		scrollWheelZoom: true
	});

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '© OpenStreetMap contributors'
	}).addTo(map);

	var marker = null;
	var $form = $('#memory-form');
	var $locationInput = $('#memory-location');
	var $latInput = $('#memory-lat');
	var $lngInput = $('#memory-lng');

	var parseCoordinateInput = function (value) {
		var cleaned = value.replace(/\s+/g, '');
		var parts = cleaned.split(',');
		if (parts.length !== 2) {
			return null;
		}
		var lat = parseFloat(parts[0]);
		var lng = parseFloat(parts[1]);
		if (!isFinite(lat) || !isFinite(lng)) {
			return null;
		}
		if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
			return null;
		}
		return {lat: lat, lng: lng};
	};

	var formatCoordLabel = function (lat, lng) {
		return lat.toFixed(5) + ', ' + lng.toFixed(5);
	};

	var setMarker = function (lat, lng) {
		var latLng = [lat, lng];
		if (!marker) {
			marker = L.marker(latLng, {draggable: false}).addTo(map);
		} else {
			marker.setLatLng(latLng);
		}
		$latInput.val(lat.toFixed(6));
		$lngInput.val(lng.toFixed(6));

		var currentValue = $.trim($locationInput.val());
		if (!currentValue || parseCoordinateInput(currentValue)) {
			$locationInput.val(formatCoordLabel(lat, lng));
		}
	};

	var clearMarker = function () {
		if (marker) {
			map.removeLayer(marker);
			marker = null;
		}
		$latInput.val('');
		$lngInput.val('');
	};

	var focusOnLocation = function (lat, lng, zoom) {
		var targetZoom = zoom || Math.max(map.getZoom(), 12);
		map.setView([lat, lng], targetZoom);
		setMarker(lat, lng);
	};

	map.on('click', function (event) {
		var lat = event.latlng.lat;
		var lng = event.latlng.lng;
		setMarker(lat, lng);
	});

	$locationInput.on('change', function () {
		var value = $.trim($locationInput.val());
		if (!value) {
			clearMarker();
			return;
		}
		var coords = parseCoordinateInput(value);
		if (coords) {
			focusOnLocation(coords.lat, coords.lng);
		}
	});

	if ($latInput.val() && $lngInput.val()) {
		var initialLat = parseFloat($latInput.val());
		var initialLng = parseFloat($lngInput.val());
		if (isFinite(initialLat) && isFinite(initialLng)) {
			focusOnLocation(initialLat, initialLng, defaultZoom);
		}
	}

	if ($form.length) {
		$form.on('reset', function () {
			setTimeout(function () {
				clearMarker();
				$locationInput.val('');
				map.setView(defaultCenter, defaultZoom);
			}, 0);
		});
	}
});

/*------------------------
   Memory Form Storage
-------------------------- */
$(function () {
	var $form = $('#memory-form');
	if (!$form.length) {
		return;
	}

	var STORAGE_KEY = 'memoryEntries';
	var $list = $('#memory-list');
	var $empty = $('#memory-empty');
	var $clearButton = $('#clear-memories');
	var $titleInput = $form.find('[name="memory-title"]');
	var $dateInput = $form.find('[name="memory-date"]');
	var $locationInput = $('#memory-location');
	var $latInput = $('#memory-lat');
	var $lngInput = $('#memory-lng');
	var $textInput = $form.find('[name="memory-text"]');

	var storageAvailable = (function () {
		try {
			var testKey = '__memory_test__';
			window.localStorage.setItem(testKey, '1');
			window.localStorage.removeItem(testKey);
			return true;
		} catch (error) {
			return false;
		}
	})();

	var readMemories = function () {
		if (!storageAvailable) {
			return [];
		}
		var raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) {
			return [];
		}
		try {
			var parsed = JSON.parse(raw);
			return Array.isArray(parsed) ? parsed : [];
		} catch (error) {
			return [];
		}
	};

	var saveMemories = function (entries) {
		if (!storageAvailable) {
			return;
		}
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
	};

	var renderMemories = function (entries) {
		$list.empty();
		if (!entries.length) {
			$empty.removeClass('d-none');
			return;
		}
		$empty.addClass('d-none');

		entries.forEach(function (entry) {
			var $col = $('<div/>', {'class': 'col-12 col-lg-6'});
			var $card = $('<div/>', {'class': 'card h-100 shadow-sm border-0'});
			var $body = $('<div/>', {'class': 'card-body d-flex flex-column'});

			if (entry.title) {
				$body.append($('<h4/>', {'class': 'card-title text-primary mb-3'}).text(entry.title));
			}

			var $metaList = $('<ul/>', {'class': 'list-unstyled small text-muted mb-3'});
			var dateText = entry.date ? entry.date : '日期未填写';
			$metaList.append($('<li/>').text('日期：' + dateText));

			var coordsAvailable = entry.lat && entry.lng;
			var locationContent = entry.location ? entry.location : (coordsAvailable ? entry.lat + ', ' + entry.lng : '未标记地点');
			var $locationItem = $('<li/>');
			if (coordsAvailable) {
				var mapsLink = 'https://www.openstreetmap.org/?mlat=' + encodeURIComponent(entry.lat) + '&mlon=' + encodeURIComponent(entry.lng) + '&zoom=14';
				var $mapAnchor = $('<a/>', {
					'href': mapsLink,
					'target': '_blank',
					'rel': 'noopener noreferrer',
					'text': locationContent
				});
				$locationItem.append('地点：').append($mapAnchor);
			} else {
				$locationItem.text('地点：' + locationContent);
			}
			$metaList.append($locationItem);
			$body.append($metaList);

			if (entry.text) {
				$body.append($('<p/>', {'class': 'card-text flex-grow-1'}).text(entry.text));
			}

			if (entry.createdAt) {
				var createdAtText = new Date(entry.createdAt).toLocaleString();
				$body.append($('<p/>', {'class': 'text-end text-muted small mb-0'}).text('记录于 ' + createdAtText));
			}

			$card.append($body);
			$col.append($card);
			$list.append($col);
		});
	};

	var entries = readMemories();
	renderMemories(entries);

	if (!storageAvailable) {
		$empty.removeClass('alert-light').addClass('alert-warning').text('当前浏览器禁止使用本地存储，无法保存新的回忆。');
		$clearButton.prop('disabled', true).addClass('disabled');
		return;
	}

	$form.on('submit', function (event) {
		event.preventDefault();

		var title = $.trim($titleInput.val());
		var date = $dateInput.val();
		var location = $.trim($locationInput.val());
		var lat = $.trim($latInput.val());
		var lng = $.trim($lngInput.val());
		var text = $.trim($textInput.val());

		if (!title || !date || !text) {
			return;
		}

		var entry = {
			id: Date.now(),
			title: title,
			date: date,
			location: location,
			lat: lat || '',
			lng: lng || '',
			text: text,
			createdAt: new Date().toISOString()
		};

		entries = readMemories();
		entries.unshift(entry);
		saveMemories(entries);
		renderMemories(entries);

		$form[0].reset();
	});

	$clearButton.on('click', function () {
		if (!entries.length) {
			return;
		}
		var confirmClear = window.confirm('确定要清空本地保存的所有回忆吗？此操作无法撤销。');
		if (!confirmClear) {
			return;
		}
		window.localStorage.removeItem(STORAGE_KEY);
		entries = [];
		renderMemories(entries);
	});
});

/*------------------------
   Wish List Modal
-------------------------- */
$(function () {
	var $wishForm = $('#wishForm');
	if (!$wishForm.length) {
		return;
	}

	var $wishModal = $('#wishModal');
	var $wishColumns = [$('#wishColumnLeft'), $('#wishColumnRight')];
	var $wishDescription = $('#wishDescription');
	var $wishProgress = $('#wishProgress');
	var $wishError = $('#wishError');

	var showError = function (message) {
		$wishError.text(message).removeClass('d-none');
	};

	var clearError = function () {
		$wishError.addClass('d-none').text('');
	};

	$wishForm.on('submit', function (event) {
		event.preventDefault();

		var description = $.trim($wishDescription.val());
		var progressInput = $.trim($wishProgress.val());
		var progress = parseInt(progressInput, 10);

		if (!description) {
			showError('请填写愿望内容。');
			$wishDescription.trigger('focus');
			return;
		}

		if (progressInput === '' || !isFinite(progress) || progress < 0 || progress > 100) {
			showError('完成度需要是 0 到 100 之间的数字。');
			$wishProgress.trigger('focus');
			return;
		}

		var $label = $('<p/>', {
			'class': 'text-dark fw-500 text-start mb-2'
		});
		$label.text(description);
		$label.append($('<span/>', {
			'class': 'float-end',
			'text': progress + '%'
		}));

		var $progressContainer = $('<div/>', {
			'class': 'progress progress-sm mb-4'
		});
		var $progressBar = $('<div/>', {
			'class': 'progress-bar',
			'role': 'progressbar',
			'aria-valuemin': 0,
			'aria-valuemax': 100
		}).css('width', progress + '%').attr('aria-valuenow', progress);

		$progressContainer.append($progressBar);

		var leftCount = $wishColumns[0].find('.progress').length;
		var rightCount = $wishColumns[1].find('.progress').length;
		var $targetColumn = leftCount <= rightCount ? $wishColumns[0] : $wishColumns[1];

		$targetColumn.append($label, $progressContainer);

		clearError();
		$wishForm[0].reset();

		var modalElement = $wishModal[0];
		var modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
		modalInstance.hide();
	});

	$wishModal.on('hidden.bs.modal', function () {
		clearError();
		$wishForm[0].reset();
	});
});

/*------------------------
   Scroll to top
-------------------------- */
$(function () {
	$(window).on('scroll', function(){
		if ($(this).scrollTop() > 400) {
			$('#back-to-top').fadeIn();
		} else {
			$('#back-to-top').fadeOut();
		}
	});
	$('#back-to-top').on("click", function() {
		$('html, body').animate({scrollTop:0}, 'slow');
		return false;
	});
});

/*------------------------
   Contact Form
-------------------------- */
var form = $('#contact-form'); // contact form
var submit = $('#submit-btn'); // submit button

// form submit event
form.on('submit', function (e) {
	e.preventDefault(); // prevent default form submit

	if (typeof $('#google-recaptcha-v3').val() != "undefined") {
		grecaptcha.ready(function () {
			var site_key = $('#google-recaptcha-v3').attr('src').split("render=")[1];
			grecaptcha.execute(site_key, {action: 'contact'}).then(function (token) {
				var gdata = form.serialize() + '&g-recaptcha-response=' + token;
				$.ajax({
					url: 'php/mail.php',  // form action url
					type: 'POST', 		  // form submit method get/post
					dataType: 'json', 	  // request type html/json/xml
					data: gdata, 		  // serialize form data
					beforeSend: function () {
						submit.attr("disabled", "disabled");
						var loadingText = '<span role="status" aria-hidden="true" class="spinner-border spinner-border-sm align-self-center me-2"></span>Sending.....'; // change submit button text
						if (submit.html() !== loadingText) {
							submit.data('original-text', submit.html());
							submit.html(loadingText);
						}
					},
					success: function (data) {
						submit.before(data.Message).fadeIn("slow"); // fade in response data 
						submit.html(submit.data('original-text'));// reset submit button text
						submit.removeAttr("disabled", "disabled");
						if (data.response == 'success') {
							form.trigger('reset'); // reset form
						}
						setTimeout(function () {
							$('.alert-dismissible').fadeOut('slow', function(){
								$(this).remove();
							});
						}, 3000);
					},
					error: function (e) {
						console.log(e)
					}
				});
			});
		});
	} else {
		$.ajax({
			url: 'php/mail.php', // form action url
			type: 'POST', // form submit method get/post
			dataType: 'json', // request type html/json/xml
			data: form.serialize(), // serialize form data
			beforeSend: function () {
				submit.attr("disabled", "disabled");
				var loadingText = '<span role="status" aria-hidden="true" class="spinner-border spinner-border-sm align-self-center me-2"></span>Sending.....'; // change submit button text
				if (submit.html() !== loadingText) {
					submit.data('original-text', submit.html());
					submit.html(loadingText);
				}
			},
			success: function (data) {
				submit.before(data.Message).fadeIn("slow"); // fade in response data 
				submit.html(submit.data('original-text'));// reset submit button text
				submit.removeAttr("disabled", "disabled");
				if (data.response == 'success') {
					form.trigger('reset'); // reset form
				}
				setTimeout(function () {
					$('.alert-dismissible').fadeOut('slow', function(){
						$(this).remove();
					});
				}, 3500);
				if (typeof $('#recaptcha-v2').val() != "undefined") {
					grecaptcha.reset(); // reset reCaptcha
				}
			},
			error: function (e) {
				console.log(e)
			}
		});
	}
});

})(jQuery)
