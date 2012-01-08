var sb = sb || {};
var app_key = "dj0yJmk9M1hsekZBSDY1ZjRxJmQ9WVdrOU5uUjZiRzE0TXpRbWNHbzlNVEV5TURZMU1qRTJNZy0tJnM9Y29uc3VtZXJzZWNyZXQmeD00OQ--";

sb.meshu = function(frame) {
	var self = {},
		map = sb.map(frame),
		mesh = sb.mesh(frame, map);

	// this is tied to a global submit button for now
    $("#submit").click(function(){
        var input = $("#coords").val();
        var query = input.replace(" ","+");

        $.ajax({
            url: "http://where.yahooapis.com/geocode?location="+query+"&flags=J&appid="+app_key,
            cache: false,
            success: function(data){
                var results = data.ResultSet.Results;
                $("#cases").empty();
                console.log(results);

                if (results.length == 1)
                    addPoint(results[0],input);
                else {
                    for (var i = 0; i < results.length; i++) {
                        var r = results[i];
                        $("<p>").text(r.city+", "+r.state+", "+r.country)
                            .addClass("maybe-place")
                            .data({"place":r})
                            .appendTo("#cases");
                    }
                    $("#cases p").click(function(){
                        var r = $(this);
                        addPoint(r.data("place"),input);
                        $("#cases").empty();
                    });
                }
            }
        });

        // random coordinate
        //var coords = [(Math.random() * 140) - 70, -180 + (Math.random() * 360)];
    });

    function addPoint(place, input) {
        mesh.add(place.latitude,place.longitude);
        map.updateBounds(mesh.lats(), mesh.lons());
        $("<p>").addClass("place")
            .append($("<span>").text(input))
            .append($("<span>").text("x").addClass("delete"))
            .appendTo("#places");
    }

	// this is tied to a global output button for now
    $("#output").click(function(){
        $("body").append($("<div>").text(self.output()));
    });

    // output the contents of our mesh
    self.output = function() {
    	return mesh.output();
    };

	return self;
};