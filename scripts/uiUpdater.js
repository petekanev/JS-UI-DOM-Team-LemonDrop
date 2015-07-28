define(function() {
	var updateTime = function(startTime) {
		var now,
			hh,
			mm,
			ss,
			timeElapsed;
		
		now = new Date();
		hh = now.getHours() - startTime.getHours();
		mm = now.getMinutes() - startTime.getMinutes();
		ss = now.getSeconds() - startTime.getSeconds();

		if (ss < 0) {
			ss += 60;
			mm -= 1;
		}
		if (mm < 0) {
			mm += 60;
			hh -= 1;
		}

		if (hh < 10) {hh = "0" + hh;}
		if (mm < 10) {mm = "0" + mm;}
		if (ss < 10) {ss = "0" + ss;}

		timeElapsed = hh + ":" + mm + ":" + ss;

		document.getElementById('timeContainer').innerHTML = timeElapsed;
	};

	var updateScore = function(coinsCollected) {
		document.getElementById('scoreContainer').innerHTML = coinsCollected.toString();
	};

	var updateLives = function(lives) {
		document.getElementById('lifesContainer').innerHTML = lives.toString();
	};

	var calculateTime = function(startTime) {
		
	};

	return {
		updateLives: updateLives,
		updateScore: updateScore,
		updateTime: updateTime,
		calculateTime: calculateTime
	};
});