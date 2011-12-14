var sb = sb || {};

sb.meshu = function(frame) {
	var self = {},
		map = sb.map(frame),
		mesh = sb.mesh(frame, map);

	$(frame).click(function(e) {
        var loc = map.p2l({ x: e.offsetX, y: e.offsetY });

        console.log(loc.lat, loc.lon);
        mesh.add(loc.lat, loc.lon);
		// mesh.add()
	});

    $("#submit").click(function(){
        var input = $("#coords").val();
        var coords = [(Math.random() * 8) + 33, -120 + (Math.random() * 10)];
        // input.split(","); // 
        
        //points.push([Math.random() * 900, Math.random() * 400])            
        // main.append("svg:text").text(input).attr("x",x(coords[1])).attr("y",y(coords[0]));
        
        mesh.add(coords[0], coords[1]);
        map.updateBounds(mesh.lats(), mesh.lons());
    });


	return self;
};