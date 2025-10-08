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
			{ id: 'ms-20190618', date: '2019.06.18', title: '首次遇见', icon: 'fas fa-moon', description: '图书馆的夜灯下，我们因为一本借错的书开始了长长的聊天。' },
			{ id: 'ms-20190705', date: '2019.07.05', title: '第一杯热可可', icon: 'fas fa-mug-hot', description: '窗外雷雨，我们在星河咖啡谈论梦想，从此每场暴雨都变得浪漫。' },
			{ id: 'ms-20200214', date: '2020.02.14', title: '确定关系', icon: 'fas fa-heart', description: '情人节的晚安电话里，我们终于说出口：要好好地在一起。' },
			{ id: 'ms-20201225', date: '2020.12.25', title: '第一趟旅行', icon: 'fas fa-route', description: '在大理的清晨醒来，我们一起看见天空最柔软的粉色。' },
			{ id: 'ms-20220403', date: '2022.04.03', title: '家里迎来 Nabi', icon: 'fas fa-cat', description: '第一只小猫入住，家里多了肉垫踩踏，也学会一起守护新的生命。' },
			{ id: 'ms-20230901', date: '2023.09.01', title: '新家入住', icon: 'fas fa-home', description: '我们亲手布置每个角落，把生活的碎片变成名为“家”的答案。' }
		],
		moments: [
			{ id: 'mo-1', title: '大理清晨的粉色天空', subtitle: '旅行日记', image: 'images/projects/project-1.jpg', link: 'ajax/portfolio-ajax-project-1.html', tag: '旅行' },
			{ id: 'mo-2', title: '第一次跨年烟花', subtitle: '纪念日', image: 'images/projects/project-2.jpg', link: 'ajax/portfolio-ajax-project-2.html', tag: '纪念日' },
			{ id: 'mo-3', title: '雨天同款雨衣', subtitle: '日常碎片', image: 'images/projects/project-3.jpg', link: 'ajax/portfolio-ajax-project-3.html', tag: '日常' },
			{ id: 'mo-4', title: '周年纪念的海边', subtitle: '旅行 + 纪念', image: 'images/projects/project-4.jpg', link: 'ajax/portfolio-ajax-project-4.html', tag: '旅行,纪念日' },
			{ id: 'mo-5', title: '家里的周日下午', subtitle: '慵懒时光', image: 'images/projects/project-5.jpg', link: 'ajax/portfolio-ajax-project-5.html', tag: '日常' },
			{ id: 'mo-6', title: '生日餐桌', subtitle: '专属于你的颜色', image: 'images/projects/project-6.jpg', link: 'ajax/portfolio-ajax-project-6.html', tag: '纪念日' },
			{ id: 'mo-7', title: '无人岛上的日落', subtitle: '旅行日记', image: 'images/projects/project-7.jpg', link: 'ajax/portfolio-ajax-project-7.html', tag: '旅行' }
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
			{ id: 'ln-20200214-d', writer: 'doudou', recipient: '汉堡', date: '2020-02-14', title: '写给你的第一封信', excerpt: '那天的风很柔软，我把第一次为你写下的句子都折进了信封里。', pdfUrl: 'files/letters/20200214-doudou.pdf', createdAt: '2020-02-14T09:00:00+08:00' },
			{ id: 'ln-20210520-h', writer: 'hamburger', recipient: '兜兜', date: '2021-05-20', title: '给兜兜的长信', excerpt: '谢谢你出现在我最需要的时刻，我会用一生回应你温柔的邀请。', pdfUrl: 'files/letters/20210520-hamburger.pdf', createdAt: '2021-05-20T21:10:00+08:00' },
			{ id: 'ln-20221231-d', writer: 'doudou', recipient: '汉堡', date: '2022-12-31', title: '写在跨年的夜里', excerpt: '新年的钟声敲响之前，我想先亲手为未来写下一些祝福。', pdfUrl: 'files/letters/20221231-doudou.pdf', createdAt: '2022-12-31T23:40:00+08:00' },
			{ id: 'ln-20230808-h', writer: 'hamburger', recipient: '兜兜', date: '2023-08-08', title: '我们的日常也是情书', excerpt: '我喜欢和你一起过每一个普通的清晨，把最平凡的日子写成情书。', pdfUrl: 'files/letters/20230808-hamburger.pdf', createdAt: '2023-08-08T08:08:00+08:00' }
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
	var momentsIsotope = null;
	var $momentsGrid = null;
	var currentMomentsFilter = '*';
	var currentMomentIndex = -1;
	var currentMomentId = null;
	var hideMomentTimer = null;
	var currentVisibleMomentIds = [];
	var $momentViewer = $('#moment-viewer');
	var $momentImage = $('#moment-viewer-image');
	var $momentTitle = $('#moment-viewer-title');
	var $momentSubtitle = $('#moment-viewer-subtitle');
	var $momentTags = $('#moment-viewer-tags');
	var $momentLink = $('#moment-viewer-link');
	var $momentPrev = $('#moment-viewer-prev');
	var $momentNext = $('#moment-viewer-next');
	var $momentClose = $('#moment-viewer-close');

	normalizeLoveNotesData();
	renderAllSections();
	bindForms();
	bindDeletion();
	setupTabListeners();
	bindLetterPaginationControls();

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
		var recipient = entry.recipient;
		if (!recipient) {
			recipient = LETTER_WRITER_CONFIG[writer].recipientName;
			changed = true;
		}
		var normalizedDate = normalizeLetterDateInput(entry.date || entry.meta || '');
		if (!normalizedDate && entry.date && entry.date !== normalizedDate) {
			normalizedDate = entry.date;
		}
		var title = entry.title || entry.meta || '未命名的信件';
		if (!entry.title) {
			changed = true;
		}
		var excerpt = entry.excerpt || entry.message || '';
		if (!entry.excerpt && entry.message) {
			changed = true;
		}
		var pdfUrl = entry.pdfUrl || entry.pdf || '';
		if (!entry.pdfUrl && entry.pdf) {
			changed = true;
		}
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
			date: normalizedDate || (entry.date || ''),
			title: title,
			excerpt: excerpt,
			pdfUrl: pdfUrl,
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
		$('#story-count-memories').text(storyData.memories.length);
	}

	function renderAllSections() {
		renderMilestones();
		renderMoments();
		renderFavorites();
		renderLoveNotes();
		renderMemories();
		updateCounts();
		rebindPopupGalleries();
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
		storyData.milestones.forEach(function (entry) {
			var $col = $('<div/>', { 'class': 'col-md-6' });
			var $box = $('<div/>', { 'class': 'featured-box style-3 mb-5' });
			var $icon = $('<div/>', { 'class': 'featured-box-icon text-primary bg-white shadow-sm rounded' });
			$icon.append($('<i/>', { 'class': entry.icon || 'fas fa-star' }));
			$box.append($icon);
			$box.append($('<h3/>').text(entry.date + ' ' + entry.title));
			$box.append($('<p/>', { 'class': 'mb-0' }).text(entry.description));
			$col.append($box);
			$mainList.append($col);

			var $item = $('<div/>', { 'class': 'list-group-item d-flex align-items-start justify-content-between gap-3' });
			var $body = $('<div/>', { 'class': 'flex-grow-1' });
			$body.append($('<h5/>', { 'class': 'mb-1' }).text(entry.date + ' ' + entry.title));
			$body.append($('<p/>', { 'class': 'mb-0 small text-muted' }).text(entry.description));
			var $actions = $('<div/>', { 'class': 'd-flex flex-column align-items-end gap-2' });
			$actions.append($('<span/>', { 'class': 'badge bg-light text-muted' }).text(entry.icon || 'fas fa-star'));
			$actions.append($('<button/>', { 'type': 'button', 'class': 'btn btn-sm btn-outline-danger story-delete', 'data-category': 'milestones', 'data-id': entry.id }).text('删除'));
			$item.append($body, $actions);
			$managerList.append($item);
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
		var categorySet = new Set();
		storyData.moments.forEach(function (entry) {
			var categories = getMomentCategories(entry);
			if (!categories.length) {
				categories = ['未分类'];
			}
			categories.forEach(function (cat) { categorySet.add(cat); });
			var categoryClasses = categories.map(function (cat) {
				var slug = slugifyCategory(cat);
				return slug ? 'cat-' + slug : '';
			}).filter(Boolean);
			var colClasses = ['col-sm-6', 'col-lg-4', 'moment-item'].concat(categoryClasses).join(' ').trim();
			var $col = $('<div/>', { 'class': colClasses });
			var $box = $('<div/>', { 'class': 'portfolio-box rounded position-relative' });
			var $imgWrap = $('<div/>', { 'class': 'portfolio-img rounded' });
			$imgWrap.append($('<img/>', { 'class': 'img-fluid d-block', 'src': entry.image || 'images/projects/project-1.jpg', 'alt': entry.title || 'moment image' }));
			var $overlay = $('<div/>', { 'class': 'portfolio-overlay' });
			var $anchor = $('<a/>', {
				'href': '#',
				'class': 'moment-trigger stretched-link',
				'data-moment-id': entry.id,
				'aria-label': (entry.title ? '查看 ' + entry.title : '查看瞬间')
			});
			$overlay.append($anchor);
			var $details = $('<div/>', { 'class': 'portfolio-overlay-details' });
			$details.append($('<h5/>', { 'class': 'text-white fw-400' }).text(entry.title));
			$details.append($('<span/>', { 'class': 'text-light' }).text(entry.subtitle || categories.join(' · ')));
			$overlay.append($details);
			$imgWrap.append($overlay);
			$box.append($imgWrap);
			$col.append($box);
			$mainList.append($col);

			var $item = $('<div/>', { 'class': 'list-group-item d-flex align-items-start justify-content-between gap-3' });
			var $body = $('<div/>', { 'class': 'flex-grow-1' });
			$body.append($('<h5/>', { 'class': 'mb-1' }).text(entry.title));
			var metaText = [];
			if (entry.subtitle) {
				metaText.push(entry.subtitle);
			}
			if (categories.length) {
				metaText.push(categories.join(' / '));
			}
			if (entry.image) {
				metaText.push(entry.image);
			}
			if (metaText.length) {
				$body.append($('<p/>', { 'class': 'mb-0 small text-muted' }).text(metaText.join(' · ')));
			}
			var $actions = $('<div/>', { 'class': 'd-flex flex-column align-items-end gap-2' });
			$actions.append($('<span/>', { 'class': 'badge bg-light text-muted' }).text(categories.join(' / ')));
			if (entry.link) {
				var viewAttrs = {
					'href': entry.link,
					'class': 'btn btn-sm btn-outline-secondary',
					'text': '查看'
				};
				if (/\.html?$/i.test(entry.link)) {
					viewAttrs.target = '_self';
				} else {
					viewAttrs.target = '_blank';
					if (/^https?:\/\//i.test(entry.link)) {
						viewAttrs.rel = 'noopener noreferrer';
					}
				}
				$actions.append($('<a/>', viewAttrs));
			}
			$actions.append($('<button/>', { 'type': 'button', 'class': 'btn btn-sm btn-outline-danger story-delete', 'data-category': 'moments', 'data-id': entry.id }).text('删除'));
			$item.append($body, $actions);
			$managerList.append($item);
		});
		var categoriesArray = Array.from(categorySet);
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
				$list.append(buildLetterCard(entry, config));
			});
			updateLetterPaginationControls(side, currentPage, totalPages);
		});

		var managerLetters = storyData.loveNotes.slice().sort(sortLettersDescending);
		managerLetters.forEach(function (entry) {
			$managerList.append(buildLetterManagerItem(entry));
		});
	}

	function renderMemories() {
		var $list = $('#memory-list');
		var $empty = $('#memory-empty');
		$list.empty();
		if (!storyData.memories.length) {
			$empty.removeClass('d-none');
			return;
		}
		$empty.addClass('d-none');
		storyData.memories.forEach(function (entry) {
			var $col = $('<div/>', { 'class': 'col-12 col-lg-6' });
			var $card = $('<div/>', { 'class': 'card h-100 shadow-sm border-0' });
			var $body = $('<div/>', { 'class': 'card-body d-flex flex-column' });
			$body.append($('<h4/>', { 'class': 'card-title text-primary mb-3' }).text(entry.title));
			var $meta = $('<ul/>', { 'class': 'list-unstyled small text-muted mb-3' });
			$meta.append($('<li/>').text('日期：' + entry.date));
			if (entry.location) {
				if (entry.lat && entry.lng) {
					var link = 'https://www.openstreetmap.org/?mlat=' + encodeURIComponent(entry.lat) + '&mlon=' + encodeURIComponent(entry.lng) + '&zoom=14';
					var $loc = $('<a/>', { 'href': link, 'target': '_blank', 'rel': 'noopener noreferrer', 'text': entry.location });
					$meta.append($('<li/>').append('地点：').append($loc));
				} else {
					$meta.append($('<li/>').text('地点：' + entry.location));
				}
			}
			$body.append($meta);
			$body.append($('<p/>', { 'class': 'card-text flex-grow-1' }).text(entry.text));
			$body.append($('<div/>', { 'class': 'd-flex justify-content-between align-items-center mt-3' }).append($('<span/>', { 'class': 'text-muted small' }).text('记录于 ' + new Date(entry.createdAt).toLocaleString())).append($('<button/>', { 'type': 'button', 'class': 'btn btn-sm btn-outline-danger story-delete', 'data-category': 'memories', 'data-id': entry.id }).text('删除')));
			$card.append($body);
			$col.append($card);
			$list.append($col);
		});
	}

	function buildLetterCard(entry, config) {
		var routeLabel = (config.writerName || '') + ' → ' + (config.recipientName || entry.recipient || '');
		var dateLabel = formatLetterDateForDisplay(entry.date);
		var excerpt = entry.excerpt || '';
		var pdfHref = (entry.pdfUrl || '').trim();
		var createdAtLabel = formatLetterDateTimeForDisplay(entry.createdAt);

		var $card = $('<article/>', { 'class': 'letter-card border rounded-4 bg-light p-4 shadow-sm' });
		var $meta = $('<div/>', { 'class': 'd-flex justify-content-between align-items-center flex-wrap gap-2 mb-3' });
		$meta.append($('<span/>', { 'class': 'badge letter-date-badge' }).text(dateLabel || '日期待补充'));
		$meta.append($('<span/>', { 'class': 'text-muted small fw-500' }).text(routeLabel));
		$card.append($meta);
		$card.append($('<h4/>', { 'class': 'text-5 fw-600 mb-3' }).text(entry.title || '未命名的信件'));
		if (excerpt) {
			$card.append($('<p/>', { 'class': 'mb-4 text-muted small lh-lg' }).text(excerpt));
		} else {
			$card.append($('<p/>', { 'class': 'mb-4 text-muted small fst-italic' }).text('这封信还没有节选，打开 PDF 阅读全部内容。'));
		}
		var $footer = $('<div/>', { 'class': 'd-flex flex-wrap align-items-center gap-3' });
		if (pdfHref && pdfHref.toLowerCase().indexOf('javascript:') === -1) {
			$footer.append($('<a/>', {
				'class': 'btn btn-sm btn-outline-primary rounded-pill',
				'href': pdfHref,
				'target': '_blank',
				'rel': 'noopener noreferrer'
			}).text('阅读完整信件 (PDF)'));
		} else {
			$footer.append($('<span/>', { 'class': 'badge bg-light text-muted' }).text('PDF 链接待补充'));
		}
		if (createdAtLabel) {
			$footer.append($('<span/>', { 'class': 'text-muted small' }).text('更新于 ' + createdAtLabel));
		}
		$card.append($footer);
		return $card;
	}

	function buildLetterManagerItem(entry) {
		var config = LETTER_WRITER_CONFIG[entry.writer] || LETTER_WRITER_CONFIG.doudou;
		var routeLabel = (config.writerName || entry.writer) + ' → ' + (config.recipientName || entry.recipient || '彼此');
		var dateLabel = formatLetterDateForDisplay(entry.date);
		var excerpt = entry.excerpt || '';
		var pdfHref = (entry.pdfUrl || '').trim();

		var $item = $('<div/>', { 'class': 'list-group-item d-flex align-items-start justify-content-between gap-3' });
		var $body = $('<div/>', { 'class': 'flex-grow-1' });
		$body.append($('<h5/>', { 'class': 'mb-1' }).text(entry.title || '未命名的信件'));
		var metaParts = [routeLabel, dateLabel ? ('写于 ' + dateLabel) : '日期待补充'];
		$body.append($('<p/>', { 'class': 'mb-1 small text-muted' }).text(metaParts.join(' · ')));
		if (excerpt) {
			$body.append($('<p/>', { 'class': 'mb-0 small text-muted' }).text(excerpt));
		}

		var $actions = $('<div/>', { 'class': 'd-flex flex-column align-items-end gap-2' });
		if (pdfHref && pdfHref.toLowerCase().indexOf('javascript:') === -1) {
			$actions.append($('<a/>', {
				'class': 'btn btn-sm btn-outline-primary',
				'href': pdfHref,
				'target': '_blank',
				'rel': 'noopener noreferrer'
			}).text('打开 PDF'));
		} else {
			$actions.append($('<span/>', { 'class': 'badge bg-light text-muted' }).text('PDF 待上传'));
		}
		$actions.append($('<button/>', { 'type': 'button', 'class': 'btn btn-sm btn-outline-danger story-delete', 'data-category': 'loveNotes', 'data-id': entry.id }).text('删除'));

		$item.append($body, $actions);
		return $item;
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
		if (!value) { return NaN; }
		var trimmed = value.toString().trim();
		if (!trimmed) { return NaN; }
		var normalized = trimmed.replace(/[年\/\.]/g, '-').replace(/月/g, '-').replace(/日/g, '');
		var parts = normalized.split('-').filter(Boolean);
		if (parts.length >= 3) {
			parts[1] = parts[1].padStart(2, '0');
			parts[2] = parts[2].padStart(2, '0');
			normalized = parts[0] + '-' + parts[1] + '-' + parts[2];
		}
		var timestamp = Date.parse(normalized);
		if (isNaN(timestamp)) {
			return NaN;
		}
		return timestamp;
	}

	function formatLetterDateForDisplay(value) {
		if (!value) { return ''; }
		var trimmed = value.toString().trim();
		if (!trimmed) { return ''; }
		if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
			return trimmed.replace(/-/g, '.');
		}
		if (/^\d{4}\.\d{1,2}\.\d{1,2}$/.test(trimmed)) {
			var parts = trimmed.split('.');
			return parts[0] + '.' + parts[1].padStart(2, '0') + '.' + parts[2].padStart(2, '0');
		}
		return trimmed;
	}

	function formatLetterDateTimeForDisplay(value) {
		if (!value) { return ''; }
		var date = new Date(value);
		if (isNaN(date.getTime())) { return ''; }
		var y = date.getFullYear();
		var m = String(date.getMonth() + 1).padStart(2, '0');
		var d = String(date.getDate()).padStart(2, '0');
		var h = String(date.getHours()).padStart(2, '0');
		var min = String(date.getMinutes()).padStart(2, '0');
		return y + '.' + m + '.' + d + ' ' + h + ':' + min;
	}

	function normalizeLetterDateInput(value) {
		if (!value) { return ''; }
		var trimmed = value.toString().trim();
		if (!trimmed) { return ''; }
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

	function bindForms() {
		$('#form-milestones').on('submit', function (event) {
			event.preventDefault();
			var date = $.trim($(this).find('[name="milestone-date"]').val());
			var title = $.trim($(this).find('[name="milestone-title"]').val());
			var icon = $(this).find('[name="milestone-icon"]').val();
			var description = $.trim($(this).find('[name="milestone-description"]').val());
			if (!date || !title || !icon || !description) { return; }
			storyData.milestones.unshift({ id: generateId('ms'), date: date, title: title, icon: icon, description: description });
			saveData();
			renderAllSections();
			this.reset();
		});

		$('#form-moments').on('submit', function (event) {
			event.preventDefault();
			var title = $.trim($(this).find('[name="moment-title"]').val());
			var subtitle = $.trim($(this).find('[name="moment-subtitle"]').val());
			var image = $.trim($(this).find('[name="moment-image"]').val());
			var link = $.trim($(this).find('[name="moment-link"]').val());
			var tag = $.trim($(this).find('[name="moment-tag"]').val());
			if (!title || !subtitle || !image || !tag) { return; }
			storyData.moments.unshift({ id: generateId('mo'), title: title, subtitle: subtitle, image: image, link: link, tag: tag });
			saveData();
			renderAllSections();
			this.reset();
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
			var writer = $(this).find('[name="letter-writer"]').val();
			var date = $(this).find('[name="letter-date"]').val();
			var title = $.trim($(this).find('[name="letter-title"]').val());
			var excerpt = $.trim($(this).find('[name="letter-excerpt"]').val());
			var pdfUrl = $.trim($(this).find('[name="letter-pdf"]').val());
			if (!writer || !date || !title || !excerpt || !pdfUrl) { return; }
			var normalizedDate = normalizeLetterDateInput(date);
			var config = LETTER_WRITER_CONFIG[writer] || LETTER_WRITER_CONFIG.doudou;
			storyData.loveNotes.push({
				id: generateId('ln'),
				writer: writer,
				recipient: config.recipientName,
				date: normalizedDate || date,
				title: title,
				excerpt: excerpt,
				pdfUrl: pdfUrl,
				createdAt: new Date().toISOString()
			});
			letterPaginationState[writer] = 0;
			saveData();
			renderAllSections();
			this.reset();
		});

		$('#form-memories').on('submit', function (event) {
			event.preventDefault();
			var $form = $(this);
			var title = $.trim($form.find('[name="memory-title"]').val());
			var date = $form.find('[name="memory-date"]').val();
			var location = $.trim($form.find('[name="memory-location"]').val());
			var lat = $.trim($form.find('[name="memory-lat"]').val());
			var lng = $.trim($form.find('[name="memory-lng"]').val());
			var text = $.trim($form.find('[name="memory-text"]').val());
			if (!title || !date || !text) { return; }
			storyData.memories.unshift({ id: generateId('me'), title: title, date: date, location: location, lat: lat, lng: lng, text: text, createdAt: new Date().toISOString() });
			saveData();
			renderAllSections();
			resetMemoryForm();
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

		$('#clear-memories').on('click', function () {
			if (!storyData.memories.length) { return; }
			if (!window.confirm('确定要清空本地保存的所有回忆吗？此操作无法撤销。')) {
				return;
			}
			storyData.memories = [];
			saveData();
			renderAllSections();
			resetMemoryForm();
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

	var memoryMap, memoryMarker, memoryMapReady = false;
	var $memoryLocation = $('#memory-location');
	var $memoryLat = $('#memory-lat');
	var $memoryLng = $('#memory-lng');

	function setupTabListeners() {
		$('button[data-bs-toggle="pill"]').on('shown.bs.tab', function (event) {
			var target = $(event.target).attr('data-bs-target');
			if (target === '#story-pane-memories') {
				setTimeout(initMemoryMap, 100);
			}
		});
		if ($('#story-pane-memories').hasClass('show active')) {
			initMemoryMap();
		}
	}

	function initMemoryMap() {
		var $mapContainer = $('#memory-map');
		if (typeof window.L === 'undefined') {
			if ($mapContainer.length && !$mapContainer.hasClass('story-map-error')) {
				$mapContainer.addClass('story-map-error bg-light d-flex align-items-center justify-content-center text-muted text-center').html('<span>地图组件未能加载，请检查网络连接。</span>');
			}
			return;
		}
		if (memoryMapReady) {
			if (memoryMap) {
				memoryMap.invalidateSize();
			}
			return;
		}
		var defaultCenter = [31.2304, 121.4737];
		memoryMap = L.map('memory-map', {
			center: defaultCenter,
			zoom: 4,
			scrollWheelZoom: true
		});
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }).addTo(memoryMap);
		memoryMapReady = true;

		memoryMap.on('click', function (event) {
			setMemoryMarker(event.latlng.lat, event.latlng.lng, true);
		});

		$memoryLocation.on('change', function () {
			var parsed = parseCoordinateInput($(this).val());
			if (!parsed) { return; }
			setMemoryMarker(parsed.lat, parsed.lng, true);
		});

		resetMemoryForm();
	}

	function parseCoordinateInput(value) {
		if (!value) { return null; }
		var cleaned = value.replace(/\s+/g, '');
		var parts = cleaned.split(',');
		if (parts.length !== 2) { return null; }
		var lat = parseFloat(parts[0]);
		var lng = parseFloat(parts[1]);
		if (!isFinite(lat) || !isFinite(lng)) { return null; }
		if (lat < -90 || lat > 90 || lng < -180 || lng > 180) { return null; }
		return { lat: lat, lng: lng };
	}

	function setMemoryMarker(lat, lng, centerMap) {
		if (!memoryMapReady) { return; }
		if (!memoryMarker) {
			memoryMarker = L.marker([lat, lng]).addTo(memoryMap);
		} else {
			memoryMarker.setLatLng([lat, lng]);
		}
		$memoryLat.val(lat.toFixed(6));
		$memoryLng.val(lng.toFixed(6));
		if (centerMap) {
			memoryMap.setView([lat, lng], Math.max(memoryMap.getZoom(), 12));
		}
		if (!$memoryLocation.val() || parseCoordinateInput($memoryLocation.val())) {
			$memoryLocation.val(lat.toFixed(5) + ', ' + lng.toFixed(5));
		}
	}

	function resetMemoryForm() {
		var $form = $('#form-memories');
		if (!$form.length) { return; }
		$form[0].reset();
		$memoryLat.val('');
		$memoryLng.val('');
		if (memoryMapReady) {
			memoryMap.setView([31.2304, 121.4737], 4);
			if (memoryMarker) {
				memoryMap.removeLayer(memoryMarker);
				memoryMarker = null;
			}
		}
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
		var options = categories.slice().sort(function (a, b) {
			return a.localeCompare(b, 'zh-CN');
		}).map(function (label) {
			var slug = slugifyCategory(label);
			return {
				label: label,
				filter: slug ? '.cat-' + slug : '*'
			};
		}).filter(function (option) { return option.filter !== '*'; });
		options.unshift({ label: '全部', filter: '*' });
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

	function getMomentCategories(entry) {
		var source = entry.tag || entry.subtitle || '';
		return source.split(/[,+/|]+/).map(function (item) {
			return item.trim();
		}).filter(Boolean);
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
		var categories = getMomentCategories(entry);
		var imageSrc = entry.image || '';

		if (!imageSrc) {
			imageSrc = 'images/projects/project-1.jpg';
		}

		$momentImage.attr({
			src: imageSrc,
			alt: entry.title || 'moment image'
		});

		if (entry.title) {
			$momentTitle.text(entry.title).removeClass('d-none');
		} else {
			$momentTitle.text('').addClass('d-none');
		}

		if (entry.subtitle) {
			$momentSubtitle.text(entry.subtitle).removeClass('d-none');
		} else {
			$momentSubtitle.text('').addClass('d-none');
		}

		$momentTags.empty();
		if (categories.length) {
			$momentTags.removeClass('d-none');
			categories.forEach(function (cat) {
				$momentTags.append($('<span/>', { 'class': 'badge' }).text(cat));
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
			hideMomentTimer = null;
		} else {
			hideMomentTimer = setTimeout(function () {
				$momentViewer.addClass('d-none');
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

})(jQuery)
