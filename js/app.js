$(function() {

	// create a meshu object for every frame class div
	$(".frame").each(function(i, e) {
		var meshu = sb.meshu(e);
	});
	$("#next").click(function(){
	    $(".frame").addClass("left");
	    $("#materials").addClass("active");
	});
	$("#back").click(function(){
	    $(".frame").removeClass("left");
	});
	
});