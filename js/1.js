window.addEventListener("DOMContentLoaded", function() {
	var navbar = document.querySelector(".navbar");
	var isOver = false;
	//Nav
	window.onscroll = function() {
		var vertical = window.pageYOffset;
		if (vertical > 60) {
			if (!isOver) {
				navbar.classList.add("fixed");
			}
			isOver = true;
		} else {
			if (isOver) {
				navbar.classList.remove("fixed");
			}
			isOver = false;
		}
	};
	//Nav

	//Banner
	var distanceNumberMove = 34;
	var imgs = document.querySelectorAll(".banner img");
	var numbers = document.querySelectorAll(".banner .numbers div");
	var preBtn = document.querySelector(".pre");
	var nextBtn = document.querySelector(".next");
	var number_move = document.querySelector(".number_move");

	var autoBanner = setInterval(function() {
		moveNext(null);
	}, 3000);

	nextBtn.addEventListener("click", function() {
		clearInterval(autoBanner);
		moveNext(null);
	});

	function moveNext(nextEle) {
		var currentImg = document.querySelector(".img_active");
		currentImg.classList.add("moveNextCurrent");
		var nextImg;
		if (nextEle == null) {
			if (parseInt(currentImg.getAttribute("data-img")) == imgs.length) {
				nextImg = imgs[0];
			} else {
				nextImg = currentImg.nextElementSibling;
			}
		} else {
			nextImg = imgs[parseInt(nextEle.getAttribute("data-img"))-1]
		}
		nextImg.classList.add("moveNextNext");

		currentImg.addEventListener("webkitAnimationEnd", function() {
			this.classList.remove("img_active");
			this.classList.remove("moveNextCurrent");
		});
		nextImg.addEventListener("webkitAnimationEnd", function() {
			this.classList.remove("moveNextNext");
			this.classList.add("img_active");
		});
		number_move.style.transform = "translateX(" + numbers[parseInt(nextImg.getAttribute("data-img"))-1].offsetLeft + "px)";
		number_move.textContent = parseInt(nextImg.getAttribute("data-img"));
	}

	preBtn.addEventListener("click", function() {
		movePre(null);
	});

	function movePre(preEle) {
		clearInterval(autoBanner);
		var currentImg = document.querySelector(".img_active");
		currentImg.classList.add("movePreCurrent");
		var nextImg;
		if (preEle == null) {
			if (parseInt(currentImg.getAttribute("data-img")) == 1) {
				nextImg = imgs[imgs.length-1];
			} else {
				nextImg = currentImg.previousElementSibling;
			}
		} else {
			nextImg = imgs[parseInt(preEle.getAttribute("data-img"))-1]
		}
		
		nextImg.classList.add("movePrePre");

		currentImg.addEventListener("webkitAnimationEnd", function() {
			this.classList.remove("img_active");
			this.classList.remove("movePreCurrent");
		});
		nextImg.addEventListener("webkitAnimationEnd", function() {
			this.classList.remove("movePrePre");
			this.classList.add("img_active");
		});
		number_move.style.transform = "translateX(" + numbers[parseInt(nextImg.getAttribute("data-img"))-1].offsetLeft + "px)";
		number_move.textContent = parseInt(nextImg.getAttribute("data-img"));
	}

	for(var i = 0; i < numbers.length; i++) {
		numbers[i].addEventListener("click", function() {
			if(parseInt(this.getAttribute("data-img")) > parseInt(number_move.textContent)) {
				moveNext(this);
			} else {
				movePre(this);
			}
		});
	}
	//Banner

	//Make the DIV element draggagle:
	dragElement(document.querySelector(".draggable"));

	function dragElement(elmnt) {
		var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
		if (document.getElementById(elmnt.id + "header")) {
			/* if present, the header is where you move the DIV from:*/
			document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
		} else {
			/* otherwise, move the DIV from anywhere inside the DIV:*/
			elmnt.onmousedown = dragMouseDown;
		}

		function dragMouseDown(e) {
			e = e || window.event;
			e.preventDefault();
	    // get the mouse cursor position at startup:
	    pos3 = e.clientX;
	    pos4 = e.clientY;
	    document.onmouseup = closeDragElement;
	    // call a function whenever the cursor moves:
	    document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
	    // calculate the new cursor position:
	    pos1 = pos3 - e.clientX;
	    pos2 = pos4 - e.clientY;
	    pos3 = e.clientX;
	    pos4 = e.clientY;
	    // set the element's new position:
	    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
	    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	}

	function closeDragElement() {
		/* stop moving when mouse button is released:*/
		document.onmouseup = null;
		document.onmousemove = null;
	}
}
	//Make the DIV element draggagle:

	//Background-audio
	var audio = document.getElementById("myAudio");
	var audioPlayBtn = document.querySelector(".audio_play");
	var audioNextBtn = document.querySelector(".audio_next");
	var audioPreBtn = document.querySelector(".audio_pre");
	var audioShuffleBtn = document.querySelector(".audio_shuffle");
	var audioPrefixPath = "audio/";
	var audios = [];
	var audiosTemp = [];
	// var currentAudioName = parseInt(audio.src.split(audioPrefixPath)[1].split(".")[0]);
	var currentAudioName;
	var isShuffle = true;
	var audioIndex = 0;

	audioPlayBtn.addEventListener("click", function() {
		if(this.classList.contains("fa-play")) {
			
			enableAutoplay(null);
		} else {
			
			disableAutoplay();
		}
	});

	audioNextBtn.addEventListener("click", function() {
		audioIndex++;
		if (isShuffle) {
			if (audioIndex == audios.length) {
				audioIndex = 0;
				// shuffle(audiosTemp);
			}
			currentAudioName = audiosTemp[audioIndex];
		} else {
			currentAudioName = audios[audioIndex];
		}
		enableAutoplay(currentAudioName);
	});

	audioPreBtn.addEventListener("click", function() {
		audioIndex--;
		if (audioIndex == -1) {
			audioIndex = audios.length-1;
				// shuffle(audiosTemp);
			}
			if (isShuffle) {
				currentAudioName = audiosTemp[audioIndex];
			} else {
				currentAudioName = audios[audioIndex];
			}
			enableAutoplay(currentAudioName);
		});

	audioShuffleBtn.addEventListener("click", function() {
		if (isShuffle) {
			this.style.color = "#16a085";
			isShuffle = false;
		} else {
			this.style.color = 'red';
			isShuffle = true;
			shuffle(audiosTemp);
		}
	});

	audio.addEventListener("ended", function() {
		audioIndex++;
		if(isShuffle) {
			if (audioIndex == audios.length) {
				audioIndex = 0;
				shuffle(audiosTemp);
			}
			currentAudioName = audiosTemp[audioIndex];
		} else {
			currentAudioName = audios[audioIndex];
		}
		this.src = audioPrefixPath + currentAudioName;
		audio.autoplay = true;
		audio.load();
	});

	function enableAutoplay(audioName) { 
		audioPlayBtn.classList.remove("fa-play");
		audioPlayBtn.classList.add("fa-pause");
		if (audioName != null)
			audio.src = audioPrefixPath + audioName; 
		audio.autoplay = true;
		audio.play();
	}
	function disableAutoplay() { 
		audioPlayBtn.classList.remove("fa-pause");
		audioPlayBtn.classList.add("fa-play");
		audio.autoplay = false;
		audio.pause();
	}

	function generateAudioName() {
		for(var i = 1; i < 82; i++)
			audios.push(i+".mp4");
	}

	function shuffle(arra1) {
		var ctr = arra1.length, temp, index;
		while (ctr > 0) {
			index = Math.floor(Math.random() * ctr);
			ctr--;
			temp = arra1[ctr];
			arra1[ctr] = arra1[index];
			arra1[index] = temp;
		}
		return arra1;
	}
	generateAudioName();
	audiosTemp = audios.slice(0);
	shuffle(audiosTemp);

	currentAudioName = audiosTemp[audioIndex];
	audio.src = audioPrefixPath + currentAudioName;
	//Background-audio

	//Social btns
	document.querySelector(".fa-facebook-square").addEventListener("click", function() {
		window.open("https://www.facebook.com/lamthanhit", "_blank");
	});

	document.querySelector(".fa-instagram-square").addEventListener("click", function() {
		window.open("https://www.instagram.com/it_nlthanh/", "_blank");
	});
	//Social bts

	//Tell me something https://forms.gle/EFhNEv8PFRviW3ST8
	document.querySelector(".footer_content_right button").addEventListener("click", function() {
		$.ajax({
			url : "https://docs.google.com/forms/u/0/d/e/1FAIpQLScKaAmhFUf_o_jMXjHcjU-wAoJHzr-3i0didTlbGQZStUraUw/formResponse",
			type : "POST",
			data : {
				"entry.1671984691" : document.querySelector(".footer_content_right textarea").value
			},
			dataType: "jsonp",
			// contentType : "application/json; charset=utf-8",
			jsonpCallBack : function(){alert(2)},
			success : function(data) {
				alert(1);
			},
			error: function(jqXHR, textStatus, errorThrown) {
		        // When AJAX call has failed
		        console.log('AJAX call failed.');
		        console.log(textStatus + ': ' + errorThrown);
		    },
		});
	});
	//Tell me something https://forms.gle/EFhNEv8PFRviW3ST8

	//Responsive navbar
	document.querySelector(".menu_toggle").addEventListener("click", function() {
		document.querySelector(".menu").classList.add("slide_nav");
		document.querySelector(".blur").classList.add("blur_appear");
		// document.querySelector(".container").classList.add("slide_container");
	});

	document.querySelector(".close_toggle").addEventListener("click", function() {
		document.querySelector(".menu").classList.remove("slide_nav");
		document.querySelector(".blur").classList.remove("blur_appear");
		// document.querySelector(".container").classList.remove("slide_container");
	});

	document.querySelector(".blur").addEventListener("click", function() {
		document.querySelector(".menu").classList.remove("slide_nav");
		document.querySelector(".blur").classList.remove("blur_appear");
		// document.querySelector(".container").classList.remove("slide_container");
	});
	//Responsive navbar

	//Main door
	// setTimeout(function(){
	// 	document.querySelector(".main_door1").classList.add("main_door1_disappear");
	// 	document.querySelector(".main_door2").classList.add("main_door2_disappear");
	// }, 3000);
	//Main door

	//Birthday question
	var months = document.querySelectorAll(".months input");
	var submitBtn = document.querySelector(".myBirthday button");
	var myBirthdayValue = 5;
	var myBirthday = document.querySelector(".myBirthday");
	var isChecked = false;
	var inform = document.querySelector(".inform");
	var correct = "Yè Ye, đúng rồi Tiên, đợi 4 giây nha.";
	var incorrect = "EEEEEEEEEE, Sai rồi nha, phải nhớ mới vào được sâu bên trong nha!!!";
	var empty = "Tien ơi, phải trả lời câu hỏi nha, có vẻ như tiên chưa trả lời ó..."; 
	var timeout = null;
	submitBtn.addEventListener("click", function() {
		for(var i = 0; i < months.length; i++) {
			if (months[i].checked) {
				isChecked = true;
				if (parseInt(months[i].value) == myBirthdayValue) {
					showInform(correct, 1);
				} else {
					showInform(incorrect, 0);
				}
			}
		}
		if (!isChecked) {
			showInform(empty, 0);
		}
	});

	function showInform(text, isCorrect) {
		if(timeout != null)
			clearTimeout(timeout);
		inform.querySelector("p").textContent = text;
		inform.classList.add("inform_appear");
		submitBtn.disabled = true;
		timeout = setTimeout(function(){
			inform.classList.remove("inform_appear");
			inform.addEventListener("webkitTransitionEnd", function() {
				submitBtn.disabled = false;
				if(isCorrect == 1) {
					submitBtn.disabled = true;
					myBirthday.classList.add("myBirthday_disappear");
					myBirthday.addEventListener("webkitTransitionEnd", function() {
						document.querySelector(".main_door1").classList.add("main_door1_disappear");
						document.querySelector(".main_door2").classList.add("main_door2_disappear");
					});
				}
			});
		}, 4000);
	}
	//Birthday question

	//Crush
	document.querySelector(".crush button").addEventListener("click", function() {
		document.querySelector(".crush .video_blur").classList.add("myBirthday_disappear");
		document.querySelector(".crush video").play();

		document.querySelector(".crush video").addEventListener("ended", function() {
			document.querySelector(".crush .video_blur").classList.remove("myBirthday_disappear");
			document.querySelector(".crush .video_blur").classList.add("move");
			setTimeout(function() {
				document.querySelector(".crush").classList.add("myBirthday_disappear");
			}, 5000)
		});
	});	
	//Crush

	//Happy
	document.querySelector(".happy button").addEventListener("click", function() {
		this.disabled = true;
		document.querySelector(".happy audio").play();
		setTimeout(function() {
			document.querySelector(".happy").classList.add("myBirthday_disappear");
		}, 	61000)
	});
	//Happy
	
});