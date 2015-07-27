define(function() {
	var update = function(playerAssets) {
		var timeElapsed = calculateTime(playerAssets.startTime);

		document.getElementById('lifesContainer').innerHTML = playerAssets.lives.toString();
		document.getElementById('scoreContainer').innerHTML = playerAssets.coinsCollected.toString();
		document.getElementById('timeContainer').innerHTML = timeElapsed;
	};

	var calculateTime = function(startTime) {
		var timeElapsedToString,
			now,
			hh,
			mm,
			ss,
			result;
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

		result = hh + ":" + mm + ":" + ss;

		return result;
	};

	return {
		update: update,
		calculateTime: calculateTime
	};
});