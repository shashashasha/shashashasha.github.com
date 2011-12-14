$(function() {

	// create a meshu object for every frame class div
	for (var i = 0; i < $(".frame").length; i++) {
		var meshu = sb.meshu($(".frame")[i]);
	}

});