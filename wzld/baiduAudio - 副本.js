var baiduAudio = {
	stopped: true,
	getToken: function() {
		baiduAudio.stop();
		baiduAudio.tokenData = {"access_token":"24.c92cf090243175d760c1211371c48464.2592000.1590825156.282335-11519842","session_key":"9mzdWEmYqSVM9O2VUddwzSThiHhst2dUG\/bXRkoZSROBHmTxbtQgUIQtVk4w2RMZetBH0taGBSKGFnVHzlk4ONz3ZC7ayA==","spd":"5","pit":"5","per":106,"enable":true};
		baiduAudio.makePlayer();

	},
	makePlayer: function() {
		var player = $('<div>').attr('id', 'baiduAudioPlayer'),
		playBtn = $('<i class="fa fa-play-circle" aria-hidden="true"></i>').addClass('playBtn active').on('click',
		function(event) {
			baiduAudio.play();
		});
		pauseBtn = $('<i class="fa fa-pause-circle" aria-hidden="true"></i>').addClass('pauseBtn').on('click',
		function(event) {
			baiduAudio.pause();
		});
		stopBtn = $('<i class="fa fa-stop-circle" aria-hidden="true"></i>').addClass('stopBtn').on('click',
		function(event) {
			baiduAudio.stop();
		});
		text = $('<span>朗读本文</span>').addClass('decoration');
		player.append(text).append(playBtn).append(pauseBtn).append(stopBtn);
		if (baiduAudio.tokenData.enable) {
			$('.blog-post article').prepend('<div class="baiduAudioWrap"></div>');
			$('.blog-post article .baiduAudioWrap').append(player);
		}
	},
	tokenData: {},
	speak: function(textArray) {
		if (baiduAudio.tokenData.access_token) {
			if (textArray < 1) {
				return false;
			}
			var tok = baiduAudio.tokenData.access_token,
			cuid = baiduAudio.tokenData.session_key,
			spd = baiduAudio.tokenData.spd,
			pit = baiduAudio.tokenData.pit,
			per = baiduAudio.tokenData.per;
			baiduAudio.audioArray = [];
			for (var i = 0; i < textArray.length; i++) {
				var address = 'http://tsn.baidu.com/text2audio?tex=' + encodeURIComponent(textArray[i]) + '&lan=zh&ctp=1&cuid=' + cuid + '&per=' + per + '&spd=' + spd + '&pit=' + pit + '&tok=' + tok;
				baiduAudio.audioArray.unshift(address);
			}
			baiduAudio.audio.preload = true;
			baiduAudio.audio.controls = true;
			baiduAudio.audio.src = baiduAudio.audioArray.pop();
			baiduAudio.audio.addEventListener('ended', baiduAudio.playEndedHandler, false);
			baiduAudio.audio.loop = false;

			return true;
		} else {
			return false;
		}
	},
	playEndedHandler: function() {
		if (baiduAudio.audioArray.length > 0) {
			baiduAudio.audio.src = baiduAudio.audioArray.pop();
			baiduAudio.audio.play();
		} else {
			baiduAudio.stop();
		}
	},
	audioArray: [],
	audio: new Audio(),
	play: function() {
		if (baiduAudio.stopped) {
			baiduAudio.speak(baiduAudio.getTextArray());
			baiduAudio.stopped = false;
		}
		$('#baiduAudioPlayer .playBtn').removeClass('active');
		$('#baiduAudioPlayer .pauseBtn').addClass('active');
		$('#baiduAudioPlayer .stopBtn').addClass('active');
		baiduAudio.audio.play();
	},
	pause: function() {
		$('#baiduAudioPlayer .playBtn').addClass('active');
		$('#baiduAudioPlayer .pauseBtn').removeClass('active');
		$('#baiduAudioPlayer .stopBtn').addClass('active');
		baiduAudio.audio.pause();
	},
	stop: function() {
		$('#baiduAudioPlayer .playBtn').addClass('active');
		$('#baiduAudioPlayer .pauseBtn').removeClass('active');
		$('#baiduAudioPlayer .stopBtn').removeClass('active');
		baiduAudio.audio.pause();
		baiduAudio.audio.removeEventListener('ended', baiduAudio.playEndedHandler, false);
		baiduAudio.stopped = true;
	},
	getTextArray: function() {
		var result = [];
		var newDom = $('.entry-content.l-h-2x').clone();
		newDom.find('#baiduAudioPlayer,.aplayer,.cpright,.preview,pre,img,table,.modal,style,script').remove();
		var text = '';
		$(newDom).find('div').each(function() {
			$(this).append('。')
		});
		$(newDom).find('*').each(function() {
			var content = $(this).contents();
			$(this).replaceWith(content);
		});
		text = $(newDom).html().replace(/&nbsp;/g, "");
		textArr = text.split(/。/g);
		var aAudioText = '';
		for (var i = 0; i < textArr.length; i++) {
			if (aAudioText.length + textArr[i].length < 500) {
				aAudioText += textArr[i] + '。';
			} else {
				result.push(aAudioText);
				aAudioText = '';
				aAudioText += textArr[i] + '。';
			}
		}
		result.push(aAudioText);
		return result;
	}
}




