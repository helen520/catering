//      Pop Easy | jQuery Modal Plugin
//      Version 1.0
//      Created 2013 by Thomas Grauer
///////////////////////////////////////////////////////////////////////////////////////
//      Permission is hereby granted, free of charge, to any person obtaining
//      a copy of this software and associated documentation files (the
//      "Software"), to deal in the Software without restriction, including
//      without limitation the rights to use, copy, modify, merge, publish,
//      distribute, sublicense, and/or sell copies of the Software, and to
//      permit persons to whom the Software is furnished to do so, subject to
//      the following conditions:
//
//      The above copyright notice and this permission notice shall be
//      included in all copies or substantial portions of the Software.
//
//      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
//      EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
//      MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
//      NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
//      LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
//      OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
//      WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
///////////////////////////////////////////////////////////////////////////////////////

(function($) {

	$.fn.modal = function(options) {

		options = $.extend({
			level : 1,
			animationEffect : 'fadeIn',
			animationSpeed : 200,
			moveModalSpeed : 'slow',
			background : '000',
			opacity : 0.6,
			openOnLoad : true,
			docClose : false,
			closeByEscape : true,
			autoPosition : true,
			moveOnScroll : true,
			resizeWindow : true,
			video : '',
			videoClass : 'video',
			close : '.closeBtn'

		}, options);

		var olay = $('<div>').css("width", "100%").css("height", "100%").css(
				"position", "fixed").css("top", "0").css("left", "0").css(
				"z-index", (999 + options.level * 2).toString()).css("display",
				"none").appendTo('body');
		var modal = this;
		var isopen = false;

		if (options.animationEffect === 'fadein') {
			options.animationEffect = 'fadeIn';
		}
		if (options.animationEffect === 'slidedown') {
			options.animationEffect = 'slideDown';
		}

		olay.css({
			opacity : 0
		});

		if (options.openOnLoad) {
			openModal();
		} else {
			olay.hide();
			modal.hide();
		}

		this.open = function() {
			openModal();
		};

		this.close = function() {
			closeModal();
		};

		this.closeNotRemoved = function() {
			closeNotRemoved();
		};

		return this;

		function openModal() {
			$('.' + options.videoClass).attr('src', options.video);
			modal.hide();
			modal.css({
				position : 'fixed',				
				left : $(window).width() / 2 - modal.outerWidth() / 2
			}).css("z-index", (1000 + options.level * 2).toString());
			if (options.autoPosition) {
				modal.css({
					top : $(window).height() / 2 - modal.outerHeight() / 2
				});
			}

			if (isopen === false) {
				olay.css({
					opacity : options.opacity,
					backgroundColor : '#' + options.background
				});
				olay[options.animationEffect](options.animationSpeed);
				modal[options.animationEffect](options.animationSpeed);
			} else {
				modal.show();
			}

			isopen = true;
		}

		function moveModal() {
			modal.stop(true).animate(
					{
						top : $(window).height() / 2 - modal.outerHeight() / 2
								+ $(window).scrollTop(),
						left : $(window).width() / 2 - modal.outerWidth() / 2
								+ $(window).scrollLeft()
					}, options.moveModalSpeed);
		}

		function closeModal() {
			$('.' + options.videoClass).attr('src', '');
			isopen = false;
			modal.fadeOut(100, function() {
				if (options.animationEffect === 'slideDown') {
					olay.slideUp();
				} else if (options.animationEffect === 'fadeIn') {
					olay.fadeOut();
				}
			});

			olay.remove();
			modal.remove();
			return false;
		}

		function closeNotRemoved() {
			$('.' + options.videoClass).attr('src', '');
			isopen = false;
			modal.fadeOut(100, function() {
				if (options.animationEffect === 'slideDown') {
					olay.slideUp();
				} else if (options.animationEffect === 'fadeIn') {
					olay.fadeOut();
				}
			});

			olay.remove();
			return false;
		}

		if (options.docClose) {
			olay.bind('click', closeModal);
		}

		$(options.close).bind('click', closeModal);

		if (options.closeByEscape) {
			$(window).bind('keyup', function(e) {
				if (e.which === 27) {
					closeModal();
				}
			});
		}

		if (options.resizeWindow) {
			$(window).bind('resize', moveModal);
		} else {
			return false;
		}

		if (options.moveOnScroll) {
			$(window).bind('scroll', moveModal);
		} else {
			return false;
		}
	};
})(jQuery);
