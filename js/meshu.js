var sb = sb || {};
var app_key = "dj0yJmk9M1hsekZBSDY1ZjRxJmQ9WVdrOU5uUjZiRzE0TXpRbWNHbzlNVEV5TURZMU1qRTJNZy0tJnM9Y29uc3VtZXJzZWNyZXQmeD00OQ--";

sb.meshu = function(frame, width, height) {
	var self = {},
		map = sb.map(frame, width, height),
		mesh = sb.mesh(frame, map, width, height);

	// this is tied to a global submit button for now
    $("#submit").click(function(){
        var input = $("#coords").val();
        var query = input.replace(" ","+");

        $.ajax({
            url: "http://where.yahooapis.com/geocode?location="+query+"&flags=J&appid="+app_key,
            cache: false,
            success: function(data){
                var results = data.ResultSet.Results;
                var cases = $("#cases");
                cases.empty().hide();

                //if (results == undefined) XXX: make a 404 "results got bonked" case
                if (results.length == 1)
                    addPoint(results[0],input);
                else {
                    var list = $("<ul>").append($("<li>").attr("class","title").text("Hrm, did you mean:")).appendTo(cases);
                    for (var i = 0; i < results.length; i++) {
                        var r = results[i];
                        $("<li>").text(r.city+", "+r.state+", "+r.country)
                            .addClass("maybe-place")
                            .data("place",r)
                            .appendTo(list);
                    }
                    cases.slideDown('fast');
                    $("#cases li").click(function(){
                        var r = $(this);
                        addPoint(r.data("place"),input);
                        cases.slideUp('fast');
                    });
                }
            }
        });

        // random coordinate
        //var coords = [(Math.random() * 140) - 70, -180 + (Math.random() * 360)];
    });

    function addPoint(place, input) {
        mesh.add(place.latitude, place.longitude, input);
        map.updateBounds(mesh.lats(), mesh.lons());
    }

	// this is tied to a global output button for now
    $("#output").click(function(){
        $("body").append($("<div>").text(self.output()));
    });

    self.locations = function(locations) {

        for (var i = 0; i < locations.length; i++) {
            setTimeout(function(loc) {
                return function() {
                    mesh.add(loc.lat, loc.lon, loc.name);
                    map.updateBounds(mesh.lats(), mesh.lons());                 
                };
            }(locations[i]), i * 400);
        }

        // mesh.locations(locations);
        // map.updateBounds(mesh.lats(), mesh.lons());

        // refresh should probably be tied to an event or something
        // mesh.refresh();
    };

    // output the contents of our mesh
    self.output = function() {
    	return mesh.output();
    };

	return self;
};