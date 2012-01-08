var sb = sb || {};
var app_key = "dj0yJmk9M1hsekZBSDY1ZjRxJmQ9WVdrOU5uUjZiRzE0TXpRbWNHbzlNVEV5TURZMU1qRTJNZy0tJnM9Y29uc3VtZXJzZWNyZXQmeD00OQ--";

sb.meshu = function(frame) {
	var self = {},
		map = sb.map(frame),
		mesh = sb.mesh(frame, map);

	$(frame).click(function(e) {
        var loc = map.p2l({ x: e.offsetX, y: e.offsetY });

        mesh.add(loc.lat, loc.lon);
	});

	// this is tied to a global submit button for now
    $("#submit").click(function(){
        var input = $("#coords").val();
        var query = input.replace(" ","+");

        $.ajax({
            url: "http://where.yahooapis.com/geocode?location="+query+"&flags=J&appid="+app_key,
            cache: false,
            success: function(data){
                var place = data.ResultSet.Results[0];
                //console.log(place.longitude, place.latitude);
                mesh.add(place.latitude, place.longitude);
                map.updateBounds(mesh.lats(), mesh.lons());
            }
        });

        // random coordinate
        //var coords = [(Math.random() * 140) - 70, -180 + (Math.random() * 360)];
        // input.split(",");

        //mesh.add(coords[0], coords[1]);
    });

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