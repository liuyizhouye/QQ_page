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
function rebindPopupGalleries() {
	if (!$.fn.magnificPopup) {
		return;
	}

	$('.popup-img-gallery').each(function() {
		var $gallery = $(this);
		if ($gallery.data('magnificPopup')) {
			$gallery.magnificPopup('destroy');
		}
		$gallery.magnificPopup({
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

	$('.popup-ajax-gallery').each(function() {
		var $gallery = $(this);
		if ($gallery.data('magnificPopup')) {
			$gallery.magnificPopup('destroy');
		}
		$gallery.magnificPopup({
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
}

rebindPopupGalleries();

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
   Story Manager
-------------------------- */
$(function () {
	var STORY_STORAGE_KEY = 'storyManagerData';
	var DEFAULT_STORY_DATA = {
		milestones: [
			{ id: 'ms-20190618', title: '首次遇见', occurredAt: '2019-06-18T19:30:00+08:00', location: '校园旧图书馆', detail: '图书馆的夜灯下，我们因为一本借错的书开始了长长的聊天。' },
			{ id: 'ms-20190705', title: '第一杯热可可', occurredAt: '2019-07-05T21:00:00+08:00', location: '星河咖啡', detail: '窗外雷雨，我们在咖啡馆谈论梦想，从此每场暴雨都变得浪漫。' },
			{ id: 'ms-20200214', title: '确定关系', occurredAt: '2020-02-14T22:30:00+08:00', location: '深夜电话', detail: '情人节的晚安电话里，我们终于说出口：要好好地在一起。' },
			{ id: 'ms-20201225', title: '第一趟旅行', occurredAt: '2020-12-25T06:00:00+08:00', location: '大理', detail: '在大理的清晨醒来，我们一起看见天空最柔软的粉色。' },
			{ id: 'ms-20220403', title: '家里迎来 Nabi', occurredAt: '2022-04-03T10:15:00+08:00', location: '我们的家', detail: '第一只小猫入住，家里多了肉垫踩踏，也学会一起守护新的生命。' },
			{ id: 'ms-20230901', title: '新家入住', occurredAt: '2023-09-01T09:00:00+08:00', location: '新居', detail: '我们亲手布置每个角落，把生活的碎片变成名为“家”的答案。' }
		],
		moments: [
			{
				id: 'mo-1',
				title: '大理清晨的粉色天空',
				occurredAt: '2020-12-25T06:30:00+08:00',
				tags: ['旅行', '照片'],
				media: [
					{ id: 'mm-1', type: 'image', src: 'images/projects/project-1.jpg' }
				]
			},
			{
				id: 'mo-2',
				title: '第一次跨年烟花',
				occurredAt: '2020-12-31T23:58:00+08:00',
				tags: ['纪念日', '照片'],
				media: [
					{ id: 'mm-2', type: 'image', src: 'images/projects/project-2.jpg' }
				]
			},
			{
				id: 'mo-3',
				title: '雨天同款雨衣',
				occurredAt: '2021-03-20T15:20:00+08:00',
				tags: ['日常', '照片'],
				media: [
					{ id: 'mm-3', type: 'image', src: 'images/projects/project-3.jpg' }
				]
			},
			{
				id: 'mo-4',
				title: '周年纪念的海边',
				occurredAt: '2022-07-14T18:45:00+08:00',
				tags: ['旅行', '纪念日'],
				media: [
					{ id: 'mm-4', type: 'video', src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', poster: 'images/projects/project-4.jpg' }
				]
			},
			{
				id: 'mo-5',
				title: '家里的周日下午',
				occurredAt: '2022-09-18T14:10:00+08:00',
				tags: ['日常', '照片'],
				media: [
					{ id: 'mm-5', type: 'image', src: 'images/projects/project-5.jpg' }
				]
			},
			{
				id: 'mo-6',
				title: '生日餐桌',
				occurredAt: '2023-05-12T19:00:00+08:00',
				tags: ['纪念日', '照片'],
				media: [
					{ id: 'mm-6', type: 'image', src: 'images/projects/project-6.jpg' }
				]
			},
			{
				id: 'mo-7',
				title: '无人岛上的日落',
				occurredAt: '2023-09-01T17:30:00+08:00',
				tags: ['旅行', '照片'],
				media: [
					{ id: 'mm-7', type: 'image', src: 'images/projects/project-7.jpg' }
				]
			}
		],
		favorites: [
			{ id: 'fa-1', badge: '每周仪式', title: '周五百花计划', highlight: '一束花 + 一张手写小卡', description: '把日常写进花香里，提醒自己永远对彼此表达爱意。' },
			{ id: 'fa-2', badge: '治愈食物', title: '深夜芝士焗饭', highlight: '限量一份，边追剧边分享', description: '无论多忙，闻到焗饭香味就知道对方在等自己回家。' },
			{ id: 'fa-3', badge: '影单收藏', title: 'Before Sunrise', highlight: '雨天必看', description: '我们喜欢在人生十字路口重温这部电影，提醒彼此珍惜选择。' },
			{ id: 'fa-4', badge: '城市漫步', title: '成都、青岛、厦门', highlight: '记录感动的街角', description: '每到一个城市都会寻找最喜欢的咖啡店，再次造访时拍下同一张照片。' },
			{ id: 'fa-5', badge: '习惯养成', title: '每日一句谢谢你', highlight: '睡前互道', description: '再小的善意都值得被记住，把感激当成爱情的底色。' },
			{ id: 'fa-6', badge: '年度清单', title: '手帐 + 拍立得', highlight: '每年12月整理', description: '挑选最喜欢的照片贴进手帐，为这一年画上温柔的句号。' }
		],
		loveNotes: [
			{ id: 'ln-20200214-d', writer: 'doudou', recipient: '汉堡', date: '2020-02-14T09:00:00+08:00', title: '写给你的第一封信', excerpt: '那天的风很柔软，我把第一次为你写下的句子都折进了信封里。', pdfUrl: 'files/letters/20200214-doudou.pdf', pdfName: '20200214-doudou.pdf', createdAt: '2020-02-14T09:00:00+08:00' },
			{ id: 'ln-20210520-h', writer: 'hamburger', recipient: '兜兜', date: '2021-05-20T21:10:00+08:00', title: '给兜兜的长信', excerpt: '谢谢你出现在我最需要的时刻，我会用一生回应你温柔的邀请。', pdfUrl: 'files/letters/20210520-hamburger.pdf', pdfName: '20210520-hamburger.pdf', createdAt: '2021-05-20T21:10:00+08:00' },
			{ id: 'ln-20221231-d', writer: 'doudou', recipient: '汉堡', date: '2022-12-31T23:40:00+08:00', title: '写在跨年的夜里', excerpt: '新年的钟声敲响之前，我想先亲手为未来写下一些祝福。', pdfUrl: 'files/letters/20221231-doudou.pdf', pdfName: '20221231-doudou.pdf', createdAt: '2022-12-31T23:40:00+08:00' },
			{ id: 'ln-20230808-h', writer: 'hamburger', recipient: '兜兜', date: '2023-08-08T08:08:00+08:00', title: '我们的日常也是情书', excerpt: '我喜欢和你一起过每一个普通的清晨，把最平凡的日子写成情书。', pdfUrl: 'files/letters/20230808-hamburger.pdf', pdfName: '20230808-hamburger.pdf', createdAt: '2023-08-08T08:08:00+08:00' }
		],
		memories: []
	};

	var storyData = loadData();
	var LETTERS_PER_PAGE = 4;
	var LETTER_WRITER_CONFIG = {
		doudou: { writerName: '兜兜', recipientName: '汉堡', listSelector: '#letters-doudou-list', pageSelector: '#letters-doudou-page', emptyText: '兜兜还没有写新的信件。' },
		hamburger: { writerName: '汉堡', recipientName: '兜兜', listSelector: '#letters-hamburger-list', pageSelector: '#letters-hamburger-page', emptyText: '汉堡还没有写新的信件。' }
	};
	var letterPaginationState = { doudou: 0, hamburger: 0 };
	var letterUploadState = { initialized: false, data: null, $input: null, $status: null };
	var DEFAULT_MOMENT_COVER = 'images/projects/project-1.jpg';
	var MAX_MOMENT_FILE_SIZE = 20 * 1024 * 1024;
	var momentsIsotope = null;
	var $momentsGrid = null;
	var currentMomentsFilter = '*';
	var currentMomentIndex = -1;
	var currentMomentId = null;
	var hideMomentTimer = null;
	var currentVisibleMomentIds = [];
	var $momentViewer = $('#moment-viewer');
	var $momentImage = $('#moment-viewer-image');
	var $momentVideo = $('#moment-viewer-video');
	var $momentTitle = $('#moment-viewer-title');
	var $momentDate = $('#moment-viewer-date');
	var $momentDescription = $('#moment-viewer-description');
	var $momentTags = $('#moment-viewer-tags');
	var $momentLink = $('#moment-viewer-link');
	var $momentPrev = $('#moment-viewer-prev');
	var $momentNext = $('#moment-viewer-next');
	var $momentClose = $('#moment-viewer-close');

	mergeMemoriesIntoMilestones();
	normalizeMilestonesData();
	normalizeMomentsData();
	normalizeLoveNotesData();
	renderAllSections();
	bindForms();
	bindDeletion();
	setupTabListeners();
	bindLetterPaginationControls();
	initLetterUpload();

	if ($momentViewer.length) {
		$momentClose.on('click', function () {
			hideMomentViewer();
		});
		$momentViewer.on('click', function (event) {
			if (event.target === event.currentTarget) {
				hideMomentViewer();
			}
		});
		$momentPrev.on('click', function () {
			showMomentByIndex(currentMomentIndex - 1);
		});
		$momentNext.on('click', function () {
			showMomentByIndex(currentMomentIndex + 1);
		});
	}

	$(document).on('keydown.storyMomentViewer', function (event) {
		if (!isMomentViewerOpen()) {
			return;
		}
		if (event.key === 'Escape') {
			event.preventDefault();
			hideMomentViewer();
		} else if (event.key === 'ArrowLeft') {
			event.preventDefault();
			showMomentByIndex(currentMomentIndex - 1);
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			showMomentByIndex(currentMomentIndex + 1);
		}
	});

	function loadData() {
		if (typeof window.localStorage === 'undefined') {
			return ensureStructure(cloneData(DEFAULT_STORY_DATA));
		}
		try {
			var saved = window.localStorage.getItem(STORY_STORAGE_KEY);
			if (!saved) {
				var initial = ensureStructure(cloneData(DEFAULT_STORY_DATA));
				var legacyMemories = window.localStorage.getItem('memoryEntries');
				if (legacyMemories) {
					try {
						var parsedLegacy = JSON.parse(legacyMemories);
						if (Array.isArray(parsedLegacy)) {
							initial.memories = parsedLegacy.map(function (entry) {
								if (!entry.id) {
									entry.id = generateId('me');
								}
								if (!entry.createdAt) {
									entry.createdAt = new Date().toISOString();
								}
								return entry;
							});
						}
					} catch (err) {
						console.warn('无法迁移旧版记忆数据', err);
					}
					window.localStorage.removeItem('memoryEntries');
				}
				window.localStorage.setItem(STORY_STORAGE_KEY, JSON.stringify(initial));
				return initial;
			}
			var parsed = JSON.parse(saved);
			return ensureStructure(parsed);
		} catch (error) {
			console.error('Failed to load story data', error);
			return ensureStructure(cloneData(DEFAULT_STORY_DATA));
		}
	}


	function cloneData(obj) {
		return JSON.parse(JSON.stringify(obj));
	}

function ensureStructure(data) {
	['milestones','moments','favorites','loveNotes','memories'].forEach(function (key) {
		if (!Array.isArray(data[key])) {
			data[key] = [];
		}
	});
	return data;
}

function mergeMemoriesIntoMilestones() {
	if (!Array.isArray(storyData.memories) || !storyData.memories.length) {
		return false;
	}
	var mutated = false;
	storyData.memories.forEach(function (memory) {
		var candidate = {
			id: memory && memory.id ? memory.id.replace(/^me/, 'ms') : generateId('ms'),
			title: memory && memory.title ? memory.title : '未命名的记忆',
			occurredAt: memory && (memory.occurredAt || memory.date || memory.createdAt || ''),
			location: memory && memory.location ? memory.location : '',
			detail: memory && (memory.text || memory.detail || ''),
			createdAt: memory && memory.createdAt ? memory.createdAt : new Date().toISOString()
		};
		var upgraded = upgradeMilestoneEntry(candidate);
		if (!upgraded) { return; }
		if (storyData.milestones.some(function (item) { return item.id === upgraded.id; })) {
			upgraded.id = generateId('ms');
		}
		if (upgraded.__forceSave) {
			delete upgraded.__forceSave;
		}
		storyData.milestones.push(upgraded);
		mutated = true;
	});
	storyData.memories = [];
	if (mutated) {
		saveData();
	}
	return mutated;
}

function normalizeMilestonesData() {
	var mutated = false;
	var normalized = [];
	storyData.milestones.forEach(function (entry) {
		var upgraded = upgradeMilestoneEntry(entry);
		if (!upgraded) { return; }
		if (upgraded.__forceSave) {
			mutated = true;
			delete upgraded.__forceSave;
		}
		normalized.push(upgraded);
	});
	if (mutated) {
		storyData.milestones = normalized;
		saveData();
	} else {
		storyData.milestones = normalized;
	}
}

function upgradeMilestoneEntry(entry) {
	if (!entry || typeof entry !== 'object') {
		return null;
	}
	var changed = false;
	var id = entry.id || generateId('ms');
	if (!entry.id) {
		changed = true;
	}
	var normalizedDate = normalizeMilestoneDateInput(entry.occurredAt || entry.date || '');
	if (!normalizedDate) {
		normalizedDate = new Date().toISOString();
		changed = true;
	} else if (entry.occurredAt !== normalizedDate) {
		changed = true;
	}
	var title = entry.title ? String(entry.title).trim() : '';
	if (!title) {
		title = '未命名的里程碑';
		changed = true;
	}
	var location = entry.location ? String(entry.location).trim() : '';
	var detail = entry.detail || entry.description || entry.text || '';
	detail = detail ? String(detail).trim() : '';
	var createdAt = entry.createdAt;
	if (!createdAt) {
		createdAt = new Date().toISOString();
		changed = true;
	}
	var upgraded = {
		id: id,
		title: title,
		occurredAt: normalizedDate,
		location: location,
		detail: detail,
		createdAt: createdAt
	};
	if (changed) {
		upgraded.__forceSave = true;
	}
	return upgraded;
}

function normalizeMilestoneDateInput(value) {
	if (!value) { return ''; }
	var normalized = normalizeDateTimeInput(value);
	if (normalized) { return normalized; }
	return value.toString().trim();
}

function parseMilestoneDateValue(value) {
	return parseMomentDateValue(value);
}

function sortMilestonesAscending(a, b) {
	var timeA = parseMilestoneDateValue(a && a.occurredAt);
	var timeB = parseMilestoneDateValue(b && b.occurredAt);
	if (!isNaN(timeA) && !isNaN(timeB) && timeA !== timeB) {
		return timeA - timeB;
	}
	if (!isNaN(timeA) && isNaN(timeB)) {
		return -1;
	}
	if (isNaN(timeA) && !isNaN(timeB)) {
		return 1;
	}
	return (a.title || '').localeCompare(b.title || '');
}

function formatMilestoneYear(value) {
	var timestamp = parseMilestoneDateValue(value);
	if (isNaN(timestamp)) {
		return '';
	}
	return new Date(timestamp).getFullYear().toString();
}

function normalizeMomentsData() {
		var mutated = false;
		var normalized = [];
		storyData.moments.forEach(function (entry) {
			var upgraded = upgradeMomentEntry(entry);
			if (!upgraded) {
				return;
			}
			if (upgraded.__forceSave) {
				mutated = true;
				delete upgraded.__forceSave;
			}
			normalized.push(upgraded);
		});
		if (mutated) {
			storyData.moments = normalized;
			saveData();
		} else {
			storyData.moments = normalized;
		}
	}

	function upgradeMomentEntry(entry) {
		if (!entry || typeof entry !== 'object') {
			return null;
		}
		var changed = false;
		var id = entry.id || generateId('mo');
		if (!entry.id) {
			changed = true;
		}
		var normalizedDate = normalizeMomentDateInput(entry.occurredAt || entry.date || entry.momentDate || '');
		if (!normalizedDate) {
			normalizedDate = new Date().toISOString();
			changed = true;
		} else if (entry.occurredAt !== normalizedDate) {
			changed = true;
		}
		var description = entry.description;
		if (!description && entry.subtitle) {
			description = entry.subtitle;
			changed = true;
		}
		var tags = [];
		if (Array.isArray(entry.tags)) {
			tags = entry.tags.map(function (tag) {
				return String(tag || '').trim();
			}).filter(Boolean);
		} else if (entry.tag) {
			tags = entry.tag.toString().split(/[,+/|]+/).map(function (tag) {
				return tag.trim();
			}).filter(Boolean);
			changed = true;
		}
		var mediaArray = Array.isArray(entry.media) ? entry.media.slice() : [];
		if (!mediaArray.length) {
			var typeGuess = entry.mediaType || (entry.video ? 'video' : 'image');
			var srcGuess = entry.mediaSrc || entry.video || entry.image || '';
			if (srcGuess) {
				mediaArray.push({
					id: entry.mediaId || generateId('mm'),
					type: typeGuess && typeGuess.toLowerCase().indexOf('video') !== -1 ? 'video' : 'image',
					src: srcGuess,
					poster: entry.posterSrc || entry.poster || (typeGuess === 'image' ? srcGuess : (entry.image || '')),
					name: entry.mediaName || '',
					size: entry.mediaSize || 0,
					mimeType: entry.mediaMimeType || ''
				});
				changed = true;
			}
		}
		var normalizedMedia = [];
		mediaArray.forEach(function (item) {
			var normalizedItem = normalizeMomentMediaItem(item);
			if (normalizedItem) {
				if (normalizedItem.__forceSave) {
					changed = true;
					delete normalizedItem.__forceSave;
				}
				normalizedMedia.push(normalizedItem);
			}
		});
		var primaryMedia = normalizedMedia[0] || null;
		var mediaType = primaryMedia ? primaryMedia.type : 'image';
		var mediaSrc = primaryMedia ? primaryMedia.src : '';
		var posterSrc = primaryMedia ? (primaryMedia.poster || (primaryMedia.type === 'image' ? primaryMedia.src : '')) : '';
		if (!posterSrc && entry.posterSrc) {
			posterSrc = entry.posterSrc;
		}
		var createdAt = entry.createdAt;
		if (!createdAt) {
			createdAt = new Date().toISOString();
			changed = true;
		}
		var upgraded = Object.assign({}, entry, {
			id: id,
			title: entry.title || '',
			occurredAt: normalizedDate,
			description: description || '',
			tags: dedupeArray(tags),
			media: normalizedMedia,
			mediaType: mediaType,
			mediaSrc: mediaSrc,
			posterSrc: posterSrc,
			link: entry.link || '',
			createdAt: createdAt
		});
		if (changed) {
			upgraded.__forceSave = true;
		}
		return upgraded;
	}

	function normalizeMomentMediaItem(item) {
		if (!item || typeof item !== 'object') {
			return null;
		}
		var changed = false;
		var id = item.id || generateId('mm');
		if (!item.id) {
			changed = true;
		}
		var src = item.src || item.url || item.data || '';
		if (!src || typeof src !== 'string') {
			return null;
		}
		src = src.trim();
		var mime = item.mimeType || item.type || '';
		var type = item.type || '';
		if (!type) {
			if (mime && mime.toLowerCase().indexOf('video/') === 0) {
				type = 'video';
			} else {
				type = 'image';
			}
			changed = true;
		}
		type = type.toLowerCase().indexOf('video') === 0 ? 'video' : 'image';
		var poster = item.poster || item.posterSrc || item.cover || '';
		if (!poster && type === 'image') {
			poster = src;
		} else if (!poster && type === 'video') {
			poster = DEFAULT_MOMENT_COVER;
			changed = true;
		}
		var size = item.size;
		if (typeof size === 'string') {
			var parsedSize = parseInt(size, 10);
			if (!isNaN(parsedSize)) {
				size = parsedSize;
				changed = true;
			} else {
				size = 0;
				changed = true;
			}
		}
		if (typeof size !== 'number' || isNaN(size)) {
			size = 0;
			changed = true;
		}
		var normalized = {
			id: id,
			type: type,
			src: src,
			name: item.name || '',
			size: size,
			mimeType: mime || '',
			poster: poster
		};
		if (changed) {
			normalized.__forceSave = true;
		}
		return normalized;
	}

	function dedupeArray(list) {
		if (!Array.isArray(list)) {
			return [];
		}
		var map = Object.create(null);
		var result = [];
		list.forEach(function (item) {
			var key = item ? item.toString() : '';
			if (!key) { return; }
			if (!map[key]) {
				result.push(item);
				map[key] = true;
			}
		});
		return result;
	}

	function readMomentFiles(files) {
		if (!files || !files.length) {
			return Promise.resolve([]);
		}
		var tasks = files.map(function (file) {
			return new Promise(function (resolve, reject) {
				if (file.size > MAX_MOMENT_FILE_SIZE) {
					reject(new Error('文件 "' + file.name + '" 超过 20MB， 请压缩后重新上传'));
					return;
				}
				var reader = new FileReader();
				reader.onload = function (event) {
					resolve({
						id: generateId('mm'),
						type: (file.type && file.type.toLowerCase().indexOf('video/') === 0) ? 'video' : 'image',
						src: event.target.result,
						name: file.name,
						size: file.size,
						mimeType: file.type || '',
						poster: (file.type && file.type.toLowerCase().indexOf('image/') === 0) ? event.target.result : ''
					});
				};
				reader.onerror = function () {
					reject(new Error('读取文件 "' + file.name + '" 时出错，请重试'));
				};
				reader.readAsDataURL(file);
			});
		});
		return Promise.all(tasks).then(function (items) {
			return items.map(function (item) {
				var normalized = normalizeMomentMediaItem(item);
				if (normalized && normalized.__forceSave) {
					delete normalized.__forceSave;
				}
				return normalized;
			}).filter(Boolean);
		});
	}

	function buildMomentEntryFromForm(payload) {
		var title = (payload && payload.title) || '';
		var dateValue = (payload && payload.dateValue) || '';
		var mediaItems = Array.isArray(payload && payload.mediaItems) ? payload.mediaItems : [];
		var tags = Array.isArray(payload && payload.tags) ? payload.tags : [];
		var cleanedTags = tags.map(function (tag) {
			return String(tag || '').trim();
		}).filter(Boolean);
		var normalizedDate = normalizeMomentDateInput(dateValue);
		if (!normalizedDate) {
			normalizedDate = new Date().toISOString();
		}
		var normalizedMedia = mediaItems.map(function (item) {
			var normalized = normalizeMomentMediaItem(item);
			if (normalized && normalized.__forceSave) {
				delete normalized.__forceSave;
			}
			return normalized;
		}).filter(Boolean);
		var primaryMedia = normalizedMedia[0] || null;
		var entry = {
			id: generateId('mo'),
			title: title,
			occurredAt: normalizedDate,
			description: '',
			tags: dedupeArray(cleanedTags),
			media: normalizedMedia,
			mediaType: primaryMedia ? primaryMedia.type : 'image',
			mediaSrc: primaryMedia ? primaryMedia.src : '',
			posterSrc: primaryMedia ? (primaryMedia.poster || (primaryMedia.type === 'image' ? primaryMedia.src : '')) : '',
			link: '',
			createdAt: new Date().toISOString()
		};
		return entry;
	}

	function getMomentPrimaryMedia(entry) {
		if (!entry) { return null; }
		if (entry.media && entry.media.length) {
			return entry.media[0];
		}
		if (entry.mediaSrc) {
			return {
				id: entry.mediaId || generateId('mm'),
				type: entry.mediaType || 'image',
				src: entry.mediaSrc,
				poster: entry.posterSrc || ''
			};
		}
		if (entry.image) {
			return {
				id: entry.mediaId || generateId('mm'),
				type: 'image',
				src: entry.image,
				poster: entry.image
			};
		}
		return null;
	}

	function getMomentCoverSrc(entry) {
		var primary = getMomentPrimaryMedia(entry);
		if (primary) {
			if (primary.type === 'image' && primary.src) {
				return primary.src;
			}
			if (primary.type === 'video' && primary.poster) {
				return primary.poster;
			}
		}
		if (entry && entry.posterSrc) {
			return entry.posterSrc;
		}
		return DEFAULT_MOMENT_COVER;
	}

	function getMomentMediaLabel(media) {
		if (!media) { return ''; }
		if (media.name && String(media.name).trim()) {
			return String(media.name).trim();
		}
		var inferred = extractFileNameFromPath(media.src);
		if (inferred) {
			return inferred;
		}
		return media.type === 'video' ? '上传的视频' : '上传的照片';
	}

	function getMomentYear(entry) {
		var timestamp = parseMomentDateValue(entry && entry.occurredAt);
		if (isNaN(timestamp)) {
			return '';
		}
		return new Date(timestamp).getFullYear().toString();
	}

	function getMomentFilterDescriptors(entry) {
		var descriptors = [];
		var primary = getMomentPrimaryMedia(entry);
		if (primary) {
			descriptors.push({
				label: primary.type === 'video' ? '视频' : '照片',
				slug: primary.type === 'video' ? 'type-video' : 'type-image'
			});
		}
		var year = getMomentYear(entry);
		if (year) {
			descriptors.push({
				label: year + ' 年',
				slug: 'year-' + year
			});
		}
		if (entry && entry.tags && entry.tags.length) {
			entry.tags.forEach(function (tag) {
				var clean = (tag || '').trim();
				if (!clean) { return; }
				var slug = 'tag-' + slugifyCategory(clean);
				descriptors.push({ label: clean, slug: slug });
			});
		}
		var unique = [];
		var seen = {};
		descriptors.forEach(function (descriptor) {
			if (!descriptor.slug || seen[descriptor.slug]) {
				return;
			}
			seen[descriptor.slug] = true;
			unique.push(descriptor);
		});
		return unique;
	}

	function orderMomentMenuOptions(options) {
		if (!Array.isArray(options)) {
			return [];
		}
		var priority = { 'type-image': 1, 'type-video': 2 };
		return options.slice().sort(function (a, b) {
			var aPriority = priority[a.slug || ''] || (a.slug && a.slug.indexOf('type-') === 0 ? 5 : (a.slug && a.slug.indexOf('year-') === 0 ? 10 : 20));
			var bPriority = priority[b.slug || ''] || (b.slug && b.slug.indexOf('type-') === 0 ? 5 : (b.slug && b.slug.indexOf('year-') === 0 ? 10 : 20));
			if (aPriority !== bPriority) {
				return aPriority - bPriority;
			}
			return a.label.localeCompare(b.label, 'zh-CN');
		});
	}

	function formatMomentDateForDisplay(value) {
		var timestamp = parseMomentDateValue(value);
		if (isNaN(timestamp)) {
			return '';
		}
		try {
			var formatter = new Intl.DateTimeFormat('zh-CN', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit'
			});
			return formatter.format(new Date(timestamp));
		} catch (error) {
			return new Date(timestamp).toLocaleString();
		}
	}

	function hasTimeComponent(value) {
		if (!value) { return false; }
		return /[T\s]\d{1,2}:\d{2}/.test(value) || /[+-]\d{2}:?\d{2}$/.test(value);
	}

	function formatDisplayDate(value) {
		if (!value) { return ''; }
		var date = value instanceof Date ? value : new Date(value);
		if (isNaN(date.getTime())) { return ''; }
		var y = date.getFullYear();
		var m = String(date.getMonth() + 1).padStart(2, '0');
		var d = String(date.getDate()).padStart(2, '0');
		return y + '.' + m + '.' + d;
	}

	function formatDisplayDateTime(value) {
		if (!value) { return ''; }
		var date = value instanceof Date ? value : new Date(value);
		if (isNaN(date.getTime())) { return ''; }
		var y = date.getFullYear();
		var m = String(date.getMonth() + 1).padStart(2, '0');
		var d = String(date.getDate()).padStart(2, '0');
		var h = String(date.getHours()).padStart(2, '0');
		var min = String(date.getMinutes()).padStart(2, '0');
		return y + '.' + m + '.' + d + ' ' + h + ':' + min;
	}

	function formatDateTimeOrDateForDisplay(value) {
		if (!value) { return ''; }
		if (value instanceof Date) {
			return formatDisplayDateTime(value);
		}
		var trimmed = value.toString().trim();
		if (!trimmed) { return ''; }
		if (hasTimeComponent(trimmed)) {
			return formatDisplayDateTime(trimmed);
		}
		var match = trimmed.match(/^(\d{4})[\/\.-](\d{1,2})[\/\.-](\d{1,2})$/);
		if (match) {
			var year = match[1];
			var month = match[2].padStart(2, '0');
			var day = match[3].padStart(2, '0');
			return year + '.' + month + '.' + day;
		}
		var parsed = Date.parse(trimmed);
		if (!isNaN(parsed)) {
			var parsedDate = new Date(parsed);
			if (!hasTimeComponent(trimmed) && parsedDate.getHours() === 0 && parsedDate.getMinutes() === 0 && parsedDate.getSeconds() === 0) {
				return formatDisplayDate(parsedDate);
			}
			return formatDisplayDateTime(parsedDate);
		}
		return trimmed;
	}

	function normalizeDateTimeInput(value) {
		var timestamp = parseMomentDateValue(value);
		if (isNaN(timestamp)) {
			return '';
		}
		return new Date(timestamp).toISOString();
	}

	function normalizeMomentDateInput(value) {
		return normalizeDateTimeInput(value);
	}

	function parseMomentDateValue(value) {
		if (!value) { return NaN; }
		var trimmed = value.toString().trim();
		if (!trimmed) { return NaN; }
		var normalized = trimmed.replace(/[\/\.]/g, '-').replace(/[年]/g, '-').replace(/月/g, '-').replace(/日/g, '');
		var match = normalized.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?(?:([+-])(\d{2}):?(\d{2}))?$/);
		if (match) {
			var year = parseInt(match[1], 10);
			var month = parseInt(match[2], 10) - 1;
			var day = parseInt(match[3], 10);
			var hour = match[4] !== undefined ? parseInt(match[4], 10) : 0;
			var minute = match[5] !== undefined ? parseInt(match[5], 10) : 0;
			var second = match[6] !== undefined ? parseInt(match[6], 10) : 0;
			var sign = match[7];
			var offsetHour = match[8] ? parseInt(match[8], 10) : 0;
			var offsetMinute = match[9] ? parseInt(match[9], 10) : 0;
			if (sign) {
				var offsetTotal = offsetHour * 60 + offsetMinute;
				if (sign === '-') {
					offsetTotal = -offsetTotal;
				}
				var base = Date.UTC(year, month, day, hour, minute, second);
				return base - offsetTotal * 60000;
			}
			var localDate = new Date(year, month, day, hour, minute, second, 0);
			if (!isNaN(localDate.getTime())) {
				return localDate.getTime();
			}
		}
		var appended = normalized;
		if (/^\d{4}-\d{2}-\d{2}$/.test(appended)) {
			appended += 'T00:00:00';
		}
		if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(appended)) {
			appended += ':00';
		}
		var parsed = Date.parse(appended);
		if (!isNaN(parsed)) {
			return parsed;
		}
		return NaN;
	}

	function normalizeLoveNotesData() {
		var mutated = false;
		var normalized = [];
		storyData.loveNotes.forEach(function (entry) {
			var upgraded = upgradeLoveNoteEntry(entry);
			if (!upgraded) {
				return;
			}
			if (upgraded.__forceSave) {
				mutated = true;
				delete upgraded.__forceSave;
			}
			normalized.push(upgraded);
		});
		if (mutated) {
			storyData.loveNotes = normalized;
			saveData();
		} else {
			storyData.loveNotes = normalized;
		}
	}

	function upgradeLoveNoteEntry(entry) {
		if (!entry || typeof entry !== 'object') {
			return null;
		}
		var changed = false;
		var writer = entry.writer;
		if (!writer) {
			var author = entry.author || '';
			if (author.indexOf('汉堡') !== -1) {
				writer = 'hamburger';
			} else {
				writer = 'doudou';
			}
			changed = true;
		}
		if (!LETTER_WRITER_CONFIG[writer]) {
			writer = 'doudou';
			changed = true;
		}
		var config = LETTER_WRITER_CONFIG[writer] || LETTER_WRITER_CONFIG.doudou;
		var recipient = entry.recipient;
		if (!recipient) {
			recipient = config.recipientName;
			changed = true;
		}
		var normalizedDate = normalizeLetterDateInput(entry.date || entry.meta || '');
		var storedDate = normalizedDate || entry.date || '';
		if (normalizedDate && entry.date && normalizedDate !== entry.date) {
			changed = true;
		}
		var pdfUrl = (entry.pdfUrl || entry.pdf || '').trim();
		if (!entry.pdfUrl && entry.pdf) {
			changed = true;
		}
		var pdfName = entry.pdfName || extractFileNameFromPath(pdfUrl);
		if (!entry.pdfName && pdfName) {
			changed = true;
		}
		var pdfSize = entry.pdfSize;
		if (typeof pdfSize === 'string') {
			var parsedSize = parseInt(pdfSize, 10);
			if (!isNaN(parsedSize)) {
				pdfSize = parsedSize;
			} else {
				pdfSize = undefined;
			}
			changed = true;
		}
		if (typeof pdfSize !== 'number' || isNaN(pdfSize)) {
			pdfSize = undefined;
		}
		var pdfData = entry.pdfData || '';
		var title = entry.title;
		if (!title || !String(title).trim()) {
			title = generateAutoLetterTitle(config, storedDate, pdfName);
			changed = true;
		}
		var excerpt = entry.excerpt || entry.message || '';
		var createdAt = entry.createdAt;
		if (!createdAt) {
			createdAt = new Date().toISOString();
			changed = true;
		}
		var id = entry.id || generateId('ln');
		if (!entry.id) {
			changed = true;
		}

		var upgraded = Object.assign({}, entry, {
			id: id,
			writer: writer,
			recipient: recipient,
			date: storedDate,
			title: title,
			excerpt: excerpt,
			pdfUrl: pdfUrl,
			pdfName: pdfName,
			pdfSize: pdfSize,
			pdfData: pdfData,
			createdAt: createdAt
		});

		if (changed) {
			upgraded.__forceSave = true;
		}

		return upgraded;
	}

	function saveData() {
		if (typeof window.localStorage === 'undefined') {
			return;
		}
		window.localStorage.setItem(STORY_STORAGE_KEY, JSON.stringify(storyData));
	}

	function generateId(prefix) {
		return prefix + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
	}

	function updateCounts() {
		$('#story-count-milestones').text(storyData.milestones.length);
		$('#story-count-moments').text(storyData.moments.length);
		$('#story-count-favorites').text(storyData.favorites.length);
		$('#story-count-loveNotes').text(storyData.loveNotes.length);
	}

	function renderAllSections() {
		renderMilestones();
		renderMoments();
		renderFavorites();
		renderLoveNotes();
		updateCounts();
		rebindPopupGalleries();
		initLetterUpload();
	}

	function renderMilestones() {
		var $mainList = $('#milestones-list');
		var $mainEmpty = $('#milestones-empty');
		var $managerList = $('#manager-milestones-list');
		var $managerEmpty = $('#manager-milestones-empty');

		$mainList.empty();
		$managerList.empty();

		if (!storyData.milestones.length) {
			$mainEmpty.removeClass('d-none');
			$managerEmpty.removeClass('d-none');
			return;
		}

		$mainEmpty.addClass('d-none');
		$managerEmpty.addClass('d-none');

		var sorted = storyData.milestones.slice().sort(sortMilestonesAscending);
		var lastYearLabel = null;
		var $track = $('<div/>', { 'class': 'timeline-track' });
		$mainList.append($track);

		sorted.forEach(function (entry) {
			var dateLabel = formatDateTimeOrDateForDisplay(entry.occurredAt);
			var yearLabel = formatMilestoneYear(entry.occurredAt);

			if (yearLabel && yearLabel !== lastYearLabel) {
				$track.append($('<div/>', { 'class': 'timeline-year-badge' }).text(yearLabel));
				lastYearLabel = yearLabel;
			}

			var $entry = $('<div/>', { 'class': 'timeline-item' });
			$entry.append($('<span/>', { 'class': 'timeline-dot' }));

			var $card = $('<div/>', { 'class': 'timeline-card' });
			$card.append($('<span/>', { 'class': 'timeline-date' }).text(dateLabel || '日期待补充'));
			$card.append($('<h3/>', { 'class': 'timeline-title text-5 fw-600 mb-2' }).text(entry.title || '未命名的里程碑'));
			if (entry.location) {
				$card.append($('<span/>', { 'class': 'timeline-location' }).text(entry.location));
			}
			if (entry.detail) {
				$card.append($('<p/>', { 'class': 'timeline-detail mb-0' }).text(entry.detail));
			}

			$entry.append($card);
			$track.append($entry);

			var $managerItem = $('<div/>', { 'class': 'list-group-item d-flex align-items-start justify-content-between gap-3' });
			var $body = $('<div/>', { 'class': 'flex-grow-1' });
			var heading = (dateLabel ? dateLabel + ' · ' : '') + (entry.title || '未命名的里程碑');
			$body.append($('<h5/>', { 'class': 'mb-1' }).text(heading));
			var managerMeta = [];
			if (entry.location) {
				managerMeta.push('地点：' + entry.location);
			}
			if (entry.detail) {
				managerMeta.push(entry.detail);
			}
			if (managerMeta.length) {
				$body.append($('<p/>', { 'class': 'mb-0 small text-muted' }).text(managerMeta.join(' · ')));
			}
			var $actions = $('<div/>', { 'class': 'd-flex flex-column align-items-end gap-2 text-nowrap' });
			$actions.append($('<button/>', { 'type': 'button', 'class': 'btn btn-sm btn-outline-danger story-delete', 'data-category': 'milestones', 'data-id': entry.id }).text('删除'));
			$managerItem.append($body, $actions);
			$managerList.append($managerItem);
		});

		enableTimelineWheelScroll($mainList);
	}

	function enableTimelineWheelScroll($container) {
		if (!$container || !$container.length) {
			return;
		}
		$container.off('wheel.timelineScroll').on('wheel.timelineScroll', function (event) {
			var original = event.originalEvent;
			if (!original) { return; }
			var deltaY = original.deltaY;
			var deltaX = original.deltaX || 0;
			if (Math.abs(deltaY) <= Math.abs(deltaX)) {
				return;
			}
			event.preventDefault();
			this.scrollLeft += deltaY;
		});
	}

	function renderMoments() {
		destroyMomentsIsotope();
		var $mainList = $('#moments-list');
		var $mainEmpty = $('#moments-empty');
		var $menu = $('#moments-menu');
		var $menuWrapper = $('#moments-menu-wrapper');
		var $managerList = $('#manager-moments-list');
		var $managerEmpty = $('#manager-moments-empty');
		$mainList.empty();
		$menu.empty();
		$managerList.empty();
		if (!storyData.moments.length) {
			$mainEmpty.removeClass('d-none');
			$managerEmpty.removeClass('d-none');
			$menuWrapper.addClass('d-none');
			currentMomentsFilter = '*';
			return;
		}
		$mainEmpty.addClass('d-none');
		$managerEmpty.addClass('d-none');
		$menuWrapper.removeClass('d-none');
		var filterMap = new Map();
		storyData.moments.forEach(function (entry) {
			var filters = getMomentFilterDescriptors(entry);
			filters.forEach(function (descriptor) {
				if (descriptor.slug) {
					filterMap.set(descriptor.slug, descriptor.label);
				}
			});
			var filterClasses = filters.map(function (descriptor) {
				return descriptor.slug ? 'cat-' + descriptor.slug : '';
			}).filter(Boolean);
			var colClasses = ['col-sm-6', 'col-lg-4', 'moment-item'].concat(filterClasses).join(' ').trim();
			var $col = $('<div/>', { 'class': colClasses });
			var $box = $('<article/>', { 'class': 'portfolio-box moment-card rounded position-relative overflow-hidden h-100' });
			var $mediaWrap = $('<div/>', { 'class': 'portfolio-img moment-card-media rounded' });
			var primaryMedia = getMomentPrimaryMedia(entry);
			var coverSrc = getMomentCoverSrc(entry);
			var mediaAlt = entry.title || 'moment media';
			$mediaWrap.append($('<img/>', { 'class': 'img-fluid d-block', 'src': coverSrc, 'alt': mediaAlt }));
			if (primaryMedia && primaryMedia.type === 'video') {
				$mediaWrap.append($('<span/>', { 'class': 'moment-media-indicator', 'aria-hidden': 'true' }).append($('<i/>', { 'class': 'fas fa-play' })));
			}
			var $overlay = $('<div/>', { 'class': 'portfolio-overlay' });
			var $anchor = $('<a/>', {
				'href': '#',
				'class': 'moment-trigger stretched-link',
				'data-moment-id': entry.id,
				'aria-label': (entry.title ? '查看 ' + entry.title : '查看瞬间')
			});
			$overlay.append($anchor);
			var $details = $('<div/>', { 'class': 'portfolio-overlay-details' });
			$details.append($('<h5/>', { 'class': 'text-white fw-400' }).text(entry.title || '未命名瞬间'));
			var infoParts = [];
			var dateLabel = formatMomentDateForDisplay(entry.occurredAt);
			if (dateLabel) {
				infoParts.push(dateLabel);
			}
			if (entry.description) {
				infoParts.push(entry.description);
			}
			if (!infoParts.length && entry.tags && entry.tags.length) {
				infoParts.push(entry.tags.join(' · '));
			}
			if (infoParts.length) {
				$details.append($('<span/>', { 'class': 'text-light small' }).text(infoParts.join(' · ')));
			}
			$overlay.append($details);
			$mediaWrap.append($overlay);
			$box.append($mediaWrap);
			$col.append($box);
			$mainList.append($col);

			var $item = $('<div/>', { 'class': 'list-group-item d-flex align-items-start justify-content-between gap-3' });
			var $body = $('<div/>', { 'class': 'flex-grow-1' });
			$body.append($('<h5/>', { 'class': 'mb-1' }).text(entry.title || '未命名瞬间'));
			var $meta = $('<p/>', { 'class': 'mb-0 small text-muted' });
			var metaParts = [];
			if (dateLabel) {
				metaParts.push(dateLabel);
			}
			if (primaryMedia) {
				metaParts.push(primaryMedia.type === 'video' ? '视频' : '照片');
			}
			if (entry.description) {
				metaParts.push(entry.description);
			}
			if (primaryMedia) {
				var mediaLabel = getMomentMediaLabel(primaryMedia);
				if (mediaLabel) {
					metaParts.push(mediaLabel);
				}
			}
			if (!metaParts.length && entry.tags && entry.tags.length) {
				metaParts.push(entry.tags.join(' / '));
			}
			if (metaParts.length) {
				$meta.text(metaParts.join(' · '));
				$body.append($meta);
			}
			var $actions = $('<div/>', { 'class': 'd-flex flex-column align-items-end gap-2 text-nowrap' });
			if (primaryMedia) {
				var typeBadge = primaryMedia.type === 'video' ? '视频' : '照片';
				$actions.append($('<span/>', { 'class': 'badge bg-light text-muted' }).text(typeBadge));
			}
			$actions.append($('<button/>', { 'type': 'button', 'class': 'btn btn-sm btn-outline-danger story-delete', 'data-category': 'moments', 'data-id': entry.id }).text('删除'));
			$item.append($body, $actions);
			$managerList.append($item);
		});
		var categoriesArray = Array.from(filterMap.entries()).map(function (entry) {
			return { slug: entry[0], label: entry[1] };
		});
		buildMomentsMenu(categoriesArray);
		initMomentsIsotope();
		bindMomentTriggers();
		refreshVisibleMomentIds();
		if (isMomentViewerOpen()) {
			if (currentMomentId) {
				var activeIndex = currentVisibleMomentIds.indexOf(currentMomentId);
				if (activeIndex === -1) {
					hideMomentViewer(true);
				} else {
					showMomentByIndex(activeIndex, { id: currentMomentId });
				}
			} else {
				hideMomentViewer(true);
			}
		}
	}

	function renderFavorites() {
		var $mainList = $('#favorites-list');
		var $mainEmpty = $('#favorites-empty');
		var $managerList = $('#manager-favorites-list');
		var $managerEmpty = $('#manager-favorites-empty');
		$mainList.empty();
		$managerList.empty();
		if (!storyData.favorites.length) {
			$mainEmpty.removeClass('d-none');
			$managerEmpty.removeClass('d-none');
			return;
		}
		$mainEmpty.addClass('d-none');
		$managerEmpty.addClass('d-none');
		storyData.favorites.forEach(function (entry) {
			var $col = $('<div/>', { 'class': 'col-md-6' });
			var $card = $('<div/>', { 'class': 'bg-white border rounded p-4 h-100 shadow-sm' });
			$card.append($('<p/>', { 'class': 'badge bg-primary text-2 fw-400' }).text(entry.badge));
			$card.append($('<h3/>', { 'class': 'text-5' }).text(entry.title));
			$card.append($('<p/>', { 'class': 'text-danger' }).text(entry.highlight));
			$card.append($('<p/>', { 'class': 'mb-0' }).text(entry.description));
			$col.append($card);
			$mainList.append($col);

			var $item = $('<div/>', { 'class': 'list-group-item d-flex align-items-start justify-content-between gap-3' });
			var $body = $('<div/>', { 'class': 'flex-grow-1' });
			$body.append($('<h5/>', { 'class': 'mb-1' }).text(entry.title));
			$body.append($('<p/>', { 'class': 'mb-0 small text-muted' }).text(entry.badge + ' · ' + entry.highlight));
			var $actions = $('<div/>', { 'class': 'd-flex flex-column align-items-end gap-2' });
			$actions.append($('<button/>', { 'type': 'button', 'class': 'btn btn-sm btn-outline-danger story-delete', 'data-category': 'favorites', 'data-id': entry.id }).text('删除'));
			$item.append($body, $actions);
			$managerList.append($item);
		});
	}

	function renderLoveNotes() {
		var $board = $('#letters-board');
		var $empty = $('#letters-empty');
		var $managerList = $('#manager-loveNotes-list');
		var $managerEmpty = $('#manager-loveNotes-empty');

		Object.keys(LETTER_WRITER_CONFIG).forEach(function (side) {
			var selector = LETTER_WRITER_CONFIG[side].listSelector;
			$(selector).empty();
			updateLetterPaginationControls(side, 0, 0);
		});

		$managerList.empty();

		if (!storyData.loveNotes.length) {
			$empty.removeClass('d-none');
			$board.addClass('d-none');
			$managerEmpty.removeClass('d-none');
			Object.keys(LETTER_WRITER_CONFIG).forEach(function (side) {
				var config = LETTER_WRITER_CONFIG[side];
				var $list = $(config.listSelector);
				if ($list.length) {
					$list.append($('<div/>', { 'class': 'alert alert-light border text-muted small mb-0' }).text(config.emptyText));
				}
			});
			return;
		}

		$empty.addClass('d-none');
		$board.removeClass('d-none');
		$managerEmpty.addClass('d-none');

		var grouped = { doudou: [], hamburger: [] };
		storyData.loveNotes.forEach(function (entry) {
			var side = LETTER_WRITER_CONFIG[entry.writer] ? entry.writer : 'doudou';
			grouped[side].push(entry);
		});

		Object.keys(LETTER_WRITER_CONFIG).forEach(function (side) {
			var config = LETTER_WRITER_CONFIG[side];
			var $list = $(config.listSelector);
			if (!$list.length) { return; }

			var letters = grouped[side].slice().sort(sortLettersAscending);
			if (!letters.length) {
				$list.append($('<div/>', { 'class': 'alert alert-light border text-muted small mb-0' }).text(config.emptyText));
				updateLetterPaginationControls(side, 0, 0);
				return;
			}

			var totalPages = Math.max(1, Math.ceil(letters.length / LETTERS_PER_PAGE));
			if (!letterPaginationState[side]) {
				letterPaginationState[side] = totalPages;
			}
			letterPaginationState[side] = Math.min(Math.max(letterPaginationState[side], 1), totalPages);

			var currentPage = letterPaginationState[side];
			var start = (currentPage - 1) * LETTERS_PER_PAGE;
			var pageEntries = letters.slice(start, start + LETTERS_PER_PAGE);

			$list.empty();
			pageEntries.forEach(function (entry) {
				$list.append(buildLetterCard(entry));
			});
			updateLetterPaginationControls(side, currentPage, totalPages);
		});

		var managerLetters = storyData.loveNotes.slice().sort(sortLettersDescending);
		managerLetters.forEach(function (entry) {
			$managerList.append(buildLetterManagerItem(entry));
		});
	}

	function buildLetterCard(entry) {
		var dateLabel = formatLetterDateForDisplay(entry.date);
		var pdfHref = getLetterPdfHref(entry);
		var displayName = getLetterDisplayName(entry);
		var $card = $('<article/>', { 'class': 'letter-card border rounded-4 bg-light p-4 shadow-sm d-flex flex-column gap-3' });
		$card.append($('<span/>', { 'class': 'badge letter-date-badge align-self-start' }).text(dateLabel || '日期待补充'));
		var $content = $('<div/>', { 'class': 'd-flex flex-column gap-1' });
		if (isSafePdfHref(pdfHref)) {
			var $link = $('<a/>', {
				'href': pdfHref,
				'class': 'text-decoration-none fw-600 letter-file-link'
			}).text(displayName);
			enrichPdfLinkAttributes($link, pdfHref, entry.pdfName);
			$content.append($link);
		} else {
			$content.append($('<span/>', { 'class': 'fw-600 text-muted' }).text(displayName));
			$content.append($('<span/>', { 'class': 'small text-muted' }).text('PDF 链接待补充'));
		}
		$card.append($content);
		return $card;
	}

	function buildLetterManagerItem(entry) {
		var dateLabel = formatLetterDateForDisplay(entry.date);
		var pdfHref = getLetterPdfHref(entry);
		var displayName = getLetterDisplayName(entry);
		var $item = $('<div/>', { 'class': 'list-group-item d-flex align-items-start justify-content-between gap-3' });
		var $body = $('<div/>', { 'class': 'flex-grow-1' });
		var $title = $('<h5/>', { 'class': 'mb-1 fw-600' }).text(displayName);
		$body.append($title);
		var metaText = dateLabel ? '写于 ' + dateLabel : '日期待补充';
		$body.append($('<p/>', { 'class': 'mb-0 small text-muted' }).text(metaText));
		var $actions = $('<div/>', { 'class': 'd-flex flex-column align-items-end gap-2' });
		var pdfStatus = isSafePdfHref(pdfHref) ? 'PDF 已保存' : 'PDF 待上传';
		$actions.append($('<span/>', { 'class': 'badge bg-light text-muted text-nowrap' }).text(pdfStatus));
		$actions.append($('<button/>', { 'type': 'button', 'class': 'btn btn-sm btn-outline-danger story-delete', 'data-category': 'loveNotes', 'data-id': entry.id }).text('删除'));
		$item.append($body, $actions);
		return $item;
	}

	function deriveLetterTitle(entry, config) {
		if (!entry) { return '未命名的信件'; }
		var title = entry.title;
		if (title && String(title).trim()) {
			return String(title).trim();
		}
		var resolvedConfig = config || LETTER_WRITER_CONFIG[entry.writer] || LETTER_WRITER_CONFIG.doudou;
		return generateAutoLetterTitle(resolvedConfig, entry.date, entry.pdfName);
	}

	function getLetterPdfHref(entry) {
		if (!entry) { return ''; }
		var href = entry.pdfData || entry.pdfUrl || '';
		if (typeof href !== 'string') {
			return '';
		}
		return href.trim();
	}

	function isSafePdfHref(href) {
		if (!href) { return false; }
		return href.toLowerCase().indexOf('javascript:') === -1;
	}

	function enrichPdfLinkAttributes($anchor, href, filename) {
		if (!$anchor || !href) { return; }
		if (/^https?:\/\//i.test(href)) {
			$anchor.attr({ target: '_blank', rel: 'noopener noreferrer' });
		} else if (/^data:/i.test(href)) {
			$anchor.attr('target', '_blank');
		} else {
			$anchor.attr('target', '_blank');
		}
		if (filename) {
			$anchor.attr('download', filename);
		}
	}

	function getLetterDisplayName(entry) {
		if (!entry) { return '信件.pdf'; }
		if (entry.pdfName && String(entry.pdfName).trim()) {
			return String(entry.pdfName).trim();
		}
		var href = getLetterPdfHref(entry);
		var extracted = extractFileNameFromPath(href);
		if (extracted) {
			return extracted;
		}
		return deriveLetterTitle(entry);
	}

function generateAutoLetterTitle(config, dateValue, pdfName) {
	var trimmedName = trimPdfExtension(pdfName || '');
	if (trimmedName) {
		return trimmedName;
	}
	var writerName = (config && config.writerName) || '我们';
	var recipientName = (config && config.recipientName) || '彼此';
	var dateLabel = formatLetterDateForDisplay(dateValue);
	if (dateLabel) {
		return dateLabel + ' · ' + writerName + '写给' + recipientName;
	}
	return writerName + '写给' + recipientName + '的信';
}

function trimPdfExtension(name) {
	if (!name) { return ''; }
	var trimmed = String(name).trim();
	if (!trimmed) { return ''; }
	return trimmed.replace(/\.pdf$/i, '');
}

function extractFileNameFromPath(path) {
	if (!path) { return ''; }
	try {
		var clean = String(path).split('?')[0].split('#')[0];
		var segments = clean.split('/');
		var last = segments.pop() || '';
		return last;
	} catch (error) {
		return '';
	}
}

function formatFileSize(bytes) {
	var size = Number(bytes);
	if (!size || isNaN(size) || size <= 0) {
		return '';
	}
	var units = ['B', 'KB', 'MB', 'GB', 'TB'];
	var index = 0;
	while (size >= 1024 && index < units.length - 1) {
		size /= 1024;
		index += 1;
	}
	var value = (index === 0 || size >= 10) ? Math.round(size) : parseFloat(size.toFixed(1));
	return value + ' ' + units[index];
}

function updateLetterPaginationControls(side, page, totalPages) {
	var indicatorSelector = LETTER_WRITER_CONFIG[side] && LETTER_WRITER_CONFIG[side].pageSelector;
	if (indicatorSelector) {
		var $indicator = $(indicatorSelector);
		if ($indicator.length) {
			if (!totalPages) {
				$indicator.text('暂无信件');
			} else {
				$indicator.text('第 ' + page + ' / ' + totalPages + ' 页');
			}
		}
	}
	var $prev = $('.letters-page-prev[data-side="' + side + '"]');
	var $next = $('.letters-page-next[data-side="' + side + '"]');
	if (!totalPages) {
		$prev.prop('disabled', true);
		$next.prop('disabled', true);
		return;
	}
	$prev.prop('disabled', page <= 1);
	$next.prop('disabled', page >= totalPages);
}

	function sortLettersAscending(a, b) {
		var timeA = parseLetterDateValue(a.date);
		var timeB = parseLetterDateValue(b.date);
		if (!isNaN(timeA) && !isNaN(timeB) && timeA !== timeB) {
			return timeA - timeB;
		}
		if (!isNaN(timeA) && isNaN(timeB)) {
			return -1;
		}
		if (isNaN(timeA) && !isNaN(timeB)) {
			return 1;
		}
		var writerCompare = (a.writer || '').localeCompare(b.writer || '');
		if (writerCompare !== 0) {
			return writerCompare;
		}
		return (a.title || '').localeCompare(b.title || '');
	}

	function sortLettersDescending(a, b) {
		var timeA = parseLetterDateValue(a.date);
		var timeB = parseLetterDateValue(b.date);
		if (!isNaN(timeA) && !isNaN(timeB) && timeA !== timeB) {
			return timeB - timeA;
		}
		if (!isNaN(timeA) && isNaN(timeB)) {
			return -1;
		}
		if (isNaN(timeA) && !isNaN(timeB)) {
			return 1;
		}
		return (b.createdAt || '').localeCompare(a.createdAt || '');
	}

	function parseLetterDateValue(value) {
		var parsed = parseMomentDateValue(value);
		if (!isNaN(parsed)) {
			return parsed;
		}
		if (!value) { return NaN; }
		var trimmed = value.toString().trim();
		if (!trimmed) { return NaN; }
		var normalized = trimmed.replace(/[年\/\.]/g, '-').replace(/月/g, '-').replace(/日/g, '');
		var timestamp = Date.parse(normalized);
		if (isNaN(timestamp)) {
			return NaN;
		}
		return timestamp;
	}

	function formatLetterDateForDisplay(value) {
		return formatDateTimeOrDateForDisplay(value);
	}

	function formatLetterDateTimeForDisplay(value) {
		return formatDisplayDateTime(value);
	}

	function normalizeLetterDateInput(value) {
		if (!value) { return ''; }
		var trimmed = value.toString().trim();
		if (!trimmed) { return ''; }
		var hasTime = /[T\s]\d{1,2}:\d{2}/.test(trimmed);
		if (hasTime || /[+-]\d{2}:?\d{2}$/.test(trimmed)) {
			var isoResult = normalizeDateTimeInput(trimmed);
			if (isoResult) {
				return isoResult;
			}
		}
		if (/T/.test(trimmed)) {
			var isoFallback = normalizeDateTimeInput(trimmed);
			if (isoFallback) {
				return isoFallback;
			}
		}
		var match = trimmed.match(/(\d{4})[年\-\/\.](\d{1,2})[月\-\/\.](\d{1,2})/);
		if (match) {
			var year = match[1];
			var month = match[2].padStart(2, '0');
			var day = match[3].padStart(2, '0');
			return year + '-' + month + '-' + day;
		}
		if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
			return trimmed;
		}
		return trimmed;
	}

	function getLettersByWriter(side) {
		return storyData.loveNotes.filter(function (entry) {
			return entry.writer === side;
		});
	}

	function changeLetterPage(side, delta) {
		if (!LETTER_WRITER_CONFIG[side]) { return; }
		var letters = getLettersByWriter(side);
		if (!letters.length) { return; }
		var totalPages = Math.max(1, Math.ceil(letters.length / LETTERS_PER_PAGE));
		var nextPage = (letterPaginationState[side] || totalPages) + delta;
		nextPage = Math.max(1, Math.min(nextPage, totalPages));
		if (nextPage === letterPaginationState[side]) { return; }
		letterPaginationState[side] = nextPage;
		renderLoveNotes();
	}

	function setLetterUploadStatus(text, type) {
		var $status = letterUploadState.$status;
		if (!$status || !$status.length) { return; }
		var message = text || '尚未选择文件';
		$status.text(message);
		$status.removeClass('text-danger text-success text-muted');
		if (type === 'error') {
			$status.addClass('text-danger');
		} else if (type === 'success') {
			$status.addClass('text-success');
		} else {
			$status.addClass('text-muted');
		}
	}

	function resetLetterUploadState(message, type) {
		letterUploadState.data = null;
		if (letterUploadState.$input && letterUploadState.$input.length) {
			letterUploadState.$input.val('');
		}
		setLetterUploadStatus(message, type);
	}

	function initLetterUpload() {
		var $input = $('#letter-file');
		var $status = $('#letter-file-status');
		if (!$input.length || !$status.length) {
			return;
		}
		letterUploadState.$input = $input;
		letterUploadState.$status = $status;

		if (!letterUploadState.initialized) {
			letterUploadState.initialized = true;

			var handleFiles = function (fileList) {
				if (!fileList || !fileList.length) {
					return;
				}
				var file = fileList[0];
				var isPdf = (file.type && file.type.toLowerCase() === 'application/pdf') || /\.pdf$/i.test(file.name || '');
				if (!isPdf) {
					setLetterUploadStatus('仅支持上传 PDF 文件', 'error');
					if (letterUploadState.$input && letterUploadState.$input.length) {
						letterUploadState.$input.val('');
					}
					letterUploadState.data = null;
					return;
				}
				setLetterUploadStatus('正在读取 ' + file.name + ' …');
				var reader = new FileReader();
				reader.onload = function (event) {
					var dataUrl = event.target && event.target.result ? event.target.result : '';
					letterUploadState.data = {
						name: file.name,
						size: file.size,
						dataUrl: dataUrl,
						lastModified: file.lastModified
					};
					if (letterUploadState.$input && letterUploadState.$input.length) {
						letterUploadState.$input.val('');
					}
					var message = '已选择：' + file.name;
					if (file.size) {
						message += ' · ' + formatFileSize(file.size);
						if (file.size > 8 * 1024 * 1024) {
							message += ' · 文件较大，可能会占用较多存储空间';
						}
					}
					setLetterUploadStatus(message, 'success');
				};
				reader.onerror = function () {
					letterUploadState.data = null;
					if (letterUploadState.$input && letterUploadState.$input.length) {
						letterUploadState.$input.val('');
					}
					setLetterUploadStatus('文件读取失败，请重试', 'error');
				};
				reader.readAsDataURL(file);
			};

			$input.on('change', function (event) {
				handleFiles(event.target.files);
			});
		}

		if (!letterUploadState.data) {
			setLetterUploadStatus('尚未选择文件');
		}
	}

	function bindForms() {
		$('#form-milestones').on('submit', function (event) {
			event.preventDefault();
			var $form = $(this);
			var dateValue = $.trim($form.find('[name="milestone-date"]').val());
			var title = $.trim($form.find('[name="milestone-title"]').val());
			var location = $.trim($form.find('[name="milestone-location"]').val());
			var detail = $.trim($form.find('[name="milestone-detail"]').val());
			if (!dateValue || !title) { return; }
			var occurredAt = normalizeMilestoneDateInput(dateValue) || dateValue;
			var entry = upgradeMilestoneEntry({
				id: generateId('ms'),
				title: title,
				occurredAt: occurredAt,
				location: location,
				detail: detail,
				createdAt: new Date().toISOString()
			});
			if (!entry) { return; }
			if (entry && entry.__forceSave) {
				delete entry.__forceSave;
			}
			storyData.milestones.unshift(entry);
			saveData();
			renderAllSections();
			if ($form.length && $form[0]) {
				$form[0].reset();
			} else {
				$form.trigger('reset');
			}
		});

		$('#form-moments').on('submit', function (event) {
			event.preventDefault();
			var $form = $(this);
			var title = $.trim($form.find('[name="moment-title"]').val());
			var dateValue = $.trim($form.find('[name="moment-date"]').val());
			if (!title || !dateValue) {
				return;
			}
			var tags = $form.find('[name="moment-tags"]:checked').map(function () {
				return $.trim($(this).val());
			}).get();
			var fileInput = $form.find('[name="moment-media"]')[0];
			var files = fileInput && fileInput.files ? Array.from(fileInput.files) : [];
			readMomentFiles(files).then(function (mediaItems) {
				var newEntry = buildMomentEntryFromForm({
					title: title,
					dateValue: dateValue,
					mediaItems: mediaItems,
					tags: tags
				});
				storyData.moments.unshift(newEntry);
				saveData();
				renderAllSections();
				if ($form.length && $form[0]) {
					$form[0].reset();
				} else {
					$form.trigger('reset');
				}
			}).catch(function (error) {
				console.error(error);
				alert(error && error.message ? error.message : '保存瞬间失败，请稍后再试');
			});
		});

		$('#form-favorites').on('submit', function (event) {
			event.preventDefault();
			var badge = $.trim($(this).find('[name="favorite-badge"]').val());
			var title = $.trim($(this).find('[name="favorite-title"]').val());
			var highlight = $.trim($(this).find('[name="favorite-highlight"]').val());
			var description = $.trim($(this).find('[name="favorite-description"]').val());
			if (!badge || !title || !highlight || !description) { return; }
			storyData.favorites.unshift({ id: generateId('fa'), badge: badge, title: title, highlight: highlight, description: description });
			saveData();
			renderAllSections();
			this.reset();
		});

		$('#form-loveNotes').on('submit', function (event) {
			event.preventDefault();
			var $form = $(this);
			var writer = $form.find('[name="letter-writer"]').val();
			var date = $form.find('[name="letter-date"]').val();
			if (!writer || !date) { return; }
			initLetterUpload();
			if (!letterUploadState.data) {
				setLetterUploadStatus('请先上传一份 PDF 信件', 'error');
				return;
			}
			var normalizedDate = normalizeLetterDateInput(date);
			var config = LETTER_WRITER_CONFIG[writer] || LETTER_WRITER_CONFIG.doudou;
			var pdfBundle = letterUploadState.data;
			var entryDate = normalizedDate || date;
			var newEntry = {
				id: generateId('ln'),
				writer: writer,
				recipient: config.recipientName,
				date: entryDate,
				title: generateAutoLetterTitle(config, entryDate, pdfBundle.name),
				excerpt: '',
				pdfUrl: '',
				pdfName: pdfBundle.name,
				pdfSize: pdfBundle.size,
				pdfData: pdfBundle.dataUrl,
				createdAt: new Date().toISOString()
			};
			storyData.loveNotes.push(newEntry);
			letterPaginationState[writer] = 0;
			saveData();
			renderAllSections();
			initLetterUpload();
			resetLetterUploadState('信件已保存，可以继续上传新的 PDF', 'success');
			if ($form.length && $form[0] && typeof $form[0].reset === 'function') {
				$form[0].reset();
			} else {
				$form.trigger('reset');
			}
		});

	}

	function bindDeletion() {
		$(document).on('click', '.story-delete', function () {
			var category = $(this).data('category');
			var id = $(this).data('id');
			if (!category || !id) { return; }
			storyData[category] = storyData[category].filter(function (item) { return item.id !== id; });
			saveData();
			renderAllSections();
		});

	}

	function bindLetterPaginationControls() {
		$(document).on('click', '.letters-page-prev', function () {
			var side = $(this).data('side');
			changeLetterPage(side, -1);
		});
		$(document).on('click', '.letters-page-next', function () {
			var side = $(this).data('side');
			changeLetterPage(side, 1);
		});
	}

	function setupTabListeners() {
		$('button[data-bs-toggle="pill"]').on('shown.bs.tab', function (event) {
			var target = $(event.target).attr('data-bs-target');
			if (target === '#story-pane-loveNotes') {
				setTimeout(initLetterUpload, 50);
			}
		});
	}

	function buildMomentsMenu(categories) {
		var $menu = $('#moments-menu');
		var $wrapper = $('#moments-menu-wrapper');
		$menu.empty();
		if (!categories.length) {
			$wrapper.addClass('d-none');
			currentMomentsFilter = '*';
			return;
		}
		$wrapper.removeClass('d-none');
		var seen = {};
		var options = categories.reduce(function (acc, item) {
			if (!item) { return acc; }
			var label;
			var slug;
			if (typeof item === 'string') {
				label = item;
				slug = slugifyCategory(item);
			} else {
				label = item.label || item.slug || '';
				slug = item.slug || slugifyCategory(label);
			}
			label = (label || '').trim();
			if (!label) { return acc; }
			if (slug && seen[slug]) { return acc; }
			if (!slug && seen[label]) { return acc; }
			acc.push({
				label: label,
				slug: slug,
				filter: slug ? '.cat-' + slug : '*'
			});
			if (slug) {
				seen[slug] = true;
			} else {
				seen[label] = true;
			}
			return acc;
		}, []).filter(function (option) { return option.filter !== '*'; });

		options = orderMomentMenuOptions(options);
		options.unshift({ label: '全部', filter: '*', slug: '' });
		if (!options.some(function (option) { return option.filter === currentMomentsFilter; })) {
			currentMomentsFilter = '*';
		}
		options.forEach(function (option) {
			var $li = $('<li/>', { 'class': 'nav-item' });
			var $link = $('<a/>', {
				'class': 'nav-link' + (option.filter === currentMomentsFilter ? ' active' : ''),
				'href': '#',
				'data-filter': option.filter,
				'text': option.label
			});
			$li.append($link);
			$menu.append($li);
		});
		applyMomentVisibilityFallback(currentMomentsFilter);
		$menu.off('click.storyMoments').on('click.storyMoments', 'a', function (event) {
			event.preventDefault();
			var filter = $(this).data('filter') || '*';
			currentMomentsFilter = filter;
			$menu.find('.nav-link').removeClass('active');
			$(this).addClass('active');
			if (momentsIsotope) {
				momentsIsotope.isotope({ filter: filter });
			} else {
				applyMomentVisibilityFallback(filter);
			}
		});
	}

	function initMomentsIsotope() {
		var $grid = $('#moments-list');
		if (!$grid.length || !$grid.children().length || typeof $grid.imagesLoaded !== 'function' || typeof $grid.isotope !== 'function') {
			applyMomentVisibilityFallback(currentMomentsFilter);
			return;
		}
		$grid.children().removeClass('d-none');
		$grid.imagesLoaded(function () {
			if (momentsIsotope) {
				momentsIsotope.isotope('destroy');
				momentsIsotope = null;
			}
			if ($momentsGrid) {
				$momentsGrid.off('arrangeComplete.storyMoments');
			}
			momentsIsotope = $grid.isotope({
				itemSelector: '.moment-item',
				layoutMode: 'masonry',
				filter: currentMomentsFilter
			});
			$momentsGrid = $grid;
			$momentsGrid.off('arrangeComplete.storyMoments').on('arrangeComplete.storyMoments', function () {
				refreshVisibleMomentIds();
				if (isMomentViewerOpen() && currentMomentId) {
					var idx = currentVisibleMomentIds.indexOf(currentMomentId);
					if (idx === -1) {
						hideMomentViewer(true);
					} else {
						showMomentByIndex(idx, { id: currentMomentId });
					}
				}
			});
			refreshVisibleMomentIds();
		});
	}

	function destroyMomentsIsotope() {
		if (momentsIsotope) {
			momentsIsotope.isotope('destroy');
			momentsIsotope = null;
		}
		if ($momentsGrid) {
			$momentsGrid.off('arrangeComplete.storyMoments');
			$momentsGrid = null;
		}
		currentVisibleMomentIds = [];
		$('#moments-list .moment-item').removeClass('d-none');
	}

	function refreshVisibleMomentIds() {
		var ids = [];
		if ($momentsGrid && momentsIsotope) {
			var isotopeInstance = $momentsGrid.data('isotope');
			if (isotopeInstance && isotopeInstance.filteredItems) {
				ids = isotopeInstance.filteredItems.map(function (item) {
					return $(item.element).data('momentId');
				}).filter(Boolean);
			}
		}
		if (!ids.length) {
			ids = $('#moments-list .moment-item').filter(function () {
				var $item = $(this);
				return !$item.hasClass('d-none') && $item.is(':visible');
			}).map(function () {
				return $(this).data('momentId');
			}).get();
		}
		if (!ids.length) {
			ids = $('#moments-list .moment-item').map(function () {
				return $(this).data('momentId');
			}).get();
		}
		currentVisibleMomentIds = ids;
	}

	function applyMomentVisibilityFallback(filter) {
		if (momentsIsotope) {
			return;
		}
		var $items = $('#moments-list .moment-item');
		if (!filter || filter === '*') {
			$items.removeClass('d-none');
			refreshVisibleMomentIds();
			return;
		}
		$items.each(function () {
			var $item = $(this);
			if ($item.is(filter)) {
				$item.removeClass('d-none');
			} else {
				$item.addClass('d-none');
			}
		});
		refreshVisibleMomentIds();
	}

	function bindMomentTriggers() {
		refreshVisibleMomentIds();
		var $triggers = $('#moments-list .moment-trigger');
		if (!$triggers.length) {
			currentVisibleMomentIds = [];
			hideMomentViewer(true);
			return;
		}
		$triggers.off('click.storyMoment').on('click.storyMoment', function (event) {
			event.preventDefault();
			event.stopPropagation();
			var id = $(this).data('momentId');
			showMomentById(id);
		});
	}

	function slugifyCategory(name) {
		if (!name) { return ''; }
		return name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\u4e00-\u9fa5-]/g, '');
	}

	function showMomentById(id) {
		if (!id) {
			return;
		}
		showMomentByIndex(currentVisibleMomentIds.indexOf(id), { id: id });
	}

	function showMomentByIndex(index, options) {
		refreshVisibleMomentIds();
		if (options && options.id) {
			var recalculated = currentVisibleMomentIds.indexOf(options.id);
			if (recalculated !== -1) {
				index = recalculated;
			}
		}
		if (!currentVisibleMomentIds.length) {
			hideMomentViewer(true);
			return;
		}
		if (index < 0 || index >= currentVisibleMomentIds.length) {
			return;
		}
		var id = currentVisibleMomentIds[index];
		var entry = storyData.moments.find(function (item) {
			return item.id === id;
		});
		if (!entry) {
			hideMomentViewer(true);
			return;
		}
		currentMomentIndex = index;
		currentMomentId = id;
		var primaryMedia = getMomentPrimaryMedia(entry);
		var coverSrc = getMomentCoverSrc(entry);
		updateMomentViewerMedia(primaryMedia, coverSrc, entry.title);

		if (entry.title) {
			$momentTitle.text(entry.title).removeClass('d-none');
		} else {
			$momentTitle.text('').addClass('d-none');
		}

		var dateLabel = formatMomentDateForDisplay(entry.occurredAt);
		if (dateLabel) {
			$momentDate.text(dateLabel).removeClass('d-none');
		} else {
			$momentDate.text('').addClass('d-none');
		}

		var description = entry.description || '';
		if (!description && entry.tags && entry.tags.length) {
			description = entry.tags.join(' · ');
		}
		if (description) {
			$momentDescription.text(description).removeClass('d-none');
		} else {
			$momentDescription.text('').addClass('d-none');
		}

		var tagList = [];
		if (primaryMedia) {
			tagList.push(primaryMedia.type === 'video' ? '视频' : '照片');
		}
		if (entry.tags && entry.tags.length) {
			tagList = tagList.concat(entry.tags);
		}
		var yearLabel = getMomentYear(entry);
		if (yearLabel) {
			tagList.push(yearLabel + ' 年');
		}
		tagList = dedupeArray(tagList);
		$momentTags.empty();
		if (tagList.length) {
			$momentTags.removeClass('d-none');
			tagList.forEach(function (tag) {
				$momentTags.append($('<span/>', { 'class': 'badge' }).text(tag));
			});
		} else {
			$momentTags.addClass('d-none');
		}

		if (entry.link) {
			var linkAttrs = { href: entry.link, target: '_blank' };
			if (/^https?:/i.test(entry.link)) {
				linkAttrs.rel = 'noopener noreferrer';
			}
			$momentLink.removeClass('d-none').attr(linkAttrs);
			if (!linkAttrs.rel) {
				$momentLink.removeAttr('rel');
			}
		} else {
			$momentLink.addClass('d-none').removeAttr('href target rel');
		}

		updateMomentNavState();
		showMomentViewer();
	}

	function updateMomentViewerMedia(primaryMedia, coverSrc, title) {
		if (!$momentImage.length || !$momentVideo.length) {
			return;
		}
		var videoEl = $momentVideo.get(0);
		if (primaryMedia && primaryMedia.type === 'video' && primaryMedia.src) {
			$momentImage.addClass('d-none').attr({ src: '', alt: '' });
			if (videoEl) {
				videoEl.pause();
				videoEl.removeAttribute('src');
				videoEl.removeAttribute('poster');
				if (primaryMedia.poster || coverSrc) {
					videoEl.setAttribute('poster', primaryMedia.poster || coverSrc);
				}
				videoEl.src = primaryMedia.src;
				try {
					videoEl.load();
				} catch (err) {
					console.warn('无法加载瞬间视频', err);
				}
			}
			$momentVideo.removeClass('d-none');
		} else {
			if (videoEl) {
				try {
					videoEl.pause();
				} catch (error) {
					// ignore
				}
				videoEl.removeAttribute('src');
				videoEl.removeAttribute('poster');
				try {
					videoEl.load();
				} catch (err2) {
					// ignore
				}
			}
			$momentVideo.addClass('d-none');
			$momentImage.attr({
				src: coverSrc,
				alt: title || 'moment image'
			}).removeClass('d-none');
		}
	}

	function resetMomentViewerMedia() {
		if ($momentVideo.length) {
			var videoEl = $momentVideo.get(0);
			if (videoEl) {
				try {
					videoEl.pause();
				} catch (error) {
					// ignore
				}
				videoEl.removeAttribute('src');
				videoEl.removeAttribute('poster');
				try {
					videoEl.load();
				} catch (err) {
					// ignore
				}
			}
			$momentVideo.addClass('d-none');
		}
		if ($momentImage.length) {
			$momentImage.addClass('d-none').attr({ src: '', alt: '' });
		}
	}

	function showMomentViewer() {
		if (!$momentViewer.length) {
			return;
		}
		clearTimeout(hideMomentTimer);
		if ($momentViewer.hasClass('d-none')) {
			$momentViewer.removeClass('d-none');
			requestAnimationFrame(function () {
				$momentViewer.addClass('show');
			});
			$('body').addClass('moment-viewer-open');
		}
	}

	function hideMomentViewer(immediate) {
		if (!$momentViewer.length) {
			return;
		}
		if ($momentViewer.hasClass('d-none') && !isMomentViewerOpen()) {
			return;
		}
		clearTimeout(hideMomentTimer);
		$momentViewer.removeClass('show');
		$('body').removeClass('moment-viewer-open');
		currentMomentIndex = -1;
		currentMomentId = null;
		var delay = immediate ? 0 : 250;
		if (delay === 0) {
			$momentViewer.addClass('d-none');
			resetMomentViewerMedia();
			hideMomentTimer = null;
		} else {
			hideMomentTimer = setTimeout(function () {
				$momentViewer.addClass('d-none');
				resetMomentViewerMedia();
				hideMomentTimer = null;
			}, delay);
		}
	}

	function updateMomentNavState() {
		var total = currentVisibleMomentIds.length || storyData.moments.length;
		var hasPrev = currentMomentIndex > 0;
		var hasNext = currentMomentIndex >= 0 && currentMomentIndex < total - 1;

		$momentPrev.toggleClass('disabled', !hasPrev).prop('disabled', !hasPrev);
		$momentNext.toggleClass('disabled', !hasNext).prop('disabled', !hasNext);

		if (total <= 1) {
			$momentPrev.addClass('d-none');
			$momentNext.addClass('d-none');
		} else {
			$momentPrev.removeClass('d-none');
			$momentNext.removeClass('d-none');
		}
	}

	function isMomentViewerOpen() {
		return $momentViewer.length && !$momentViewer.hasClass('d-none') && $momentViewer.hasClass('show');
	}
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

})(jQuery);
