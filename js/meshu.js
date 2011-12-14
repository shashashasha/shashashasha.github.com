var sb = sb || {};

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

        // random coordinate
        var coords = [(Math.random() * 8) + 33, -120 + (Math.random() * 10)];
        // input.split(",");

        mesh.add(coords[0], coords[1]);
        map.updateBounds(mesh.lats(), mesh.lons());
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