var sb = sb || {};

sb.mesh = function(frame, map, width, height) {
	var self = {},
		selfId = parseInt(Math.random() * 10000000000);

    var main = d3.select(frame || "body").append("div")
        .attr("id", selfId)
        .attr("style", "position:absolute;z-index:100;")
        .append("svg:svg")
        .attr("width", width || "400px")
        .attr("height", height || "400px");

    var g = main.append("svg:g")
            .attr("id","delaunay");

    var points = [], 
    	lats = [], 
    	lons = [],
    	new_pt = [],
    	updateInterval = 0;

    function update(){
        g.selectAll("path")
            .data(d3.geom.delaunay(points))
            .enter().append("svg:path");

        g.selectAll("path")
            .attr("d", function(d) {
                var l = d.length;
                var draw = [];
                for (var i = 0; i < l; i++){
                    var loc = {
                        lat: parseFloat(d[i][1]),
                        lon: parseFloat(d[i][0])
                    };

                    var pt = map.l2p(loc);

                    // draw.push([x(d[i][0]),y(d[i][1])]);
                    draw.push([pt.x, pt.y]);
                } 
                return "M" + draw.join("L") + "Z"; 
            });

        if (new_pt) {
	        var last = points[points.length-1];
	        if (Math.abs(last[0] - new_pt[0]) > .0003) {
	            last[0] += (new_pt[0] - last[0]) / 3;
	        }    
	        if (Math.abs(last[1] - new_pt[1]) > .0003) {
	            last[1] += (new_pt[1] - last[1]) / 3;
	        }    

	        points[points.length - 1] = last;
	        
	        if (Math.abs(last[1] - new_pt[1]) < .0005 && Math.abs(last[0] - new_pt[0]) < .0005) {
	            clearInterval(updateInterval);
	            new_pt = null;
	        }	
        } else {
            clearInterval(updateInterval);
        }
    };

    self.add = function(latitude, longitude) {
    	// clear previous update
    	if (updateInterval) {
            clearInterval(updateInterval);
    	}

        var lat = parseFloat(latitude);
        var lon = parseFloat(longitude);

        lats.push(lat);
        lons.push(lon);

        if (points.length) {
        	new_pt = [lon, lat];

        	// make the new point start from the last location
            var last = points[points.length-1];
            points.push([last[0], last[1]]);  

            // animate the new point in place
            updateInterval = setInterval(update, 40);
        } else {
            points.push([lon, lat]);
            update();
        }

        return self;
    };

    self.lats = function() {
    	return lats;
    };

    self.lons = function() {
    	return lons;
    };

    self.points = function(pts) {
    	if (!arguments.length) {
    		return points;
    	}

    	points = pts;
    	return self;
    };

    self.output = function() {
    	return $('#' + selfId).html();
    };

	return self;
};