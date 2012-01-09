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
    
    var uiFrame = d3.select(frame || "body").append("div")
        .attr("style", "position:absolute;z-index:1337;")
        .append("svg:svg")
        .attr("width", width || "400px")
        .attr("height", height || "400px");

    var ui = uiFrame.append("svg:g")
        .attr("id", "delaunay-ui");

    var list = d3.select("#places")
                .append("ul");

    var points = [], 
    	lats = [], 
    	lons = [],
        places = [],
    	new_pt = [],
    	updateInterval = 0,
        selected = null,
        moved = false,
        dragging = null;

    d3.select(frame)
        .on("mousemove", mousemove)
        .on("mouseup", mouseup);

    function mousemove() {
        if (!dragging) {
            return;
        }

        var m = d3.svg.mouse(main.node());
        var l = map.p2l({
            x: m[0],
            y: m[1]
        });
        dragging[0] = l.lon;
        dragging[1] = l.lat;
        
        update();

        moved = true;
    }

    function mouseup() {
        if (!dragging) {
            var m = d3.svg.mouse(main.node());
            var loc = map.p2l({
                x: m[0],
                y: m[1]
            });

            self.add(loc.lat, loc.lon);
            return;
        }

        // delete the point if we mouseup on a point 
        if (!moved && dragging) {
            var index = points.indexOf(dragging);
            self.remove(index);

            update();
        } else {
            mousemove();
        }

        if (d3.event) {
          d3.event.preventDefault();
          d3.event.stopPropagation();
        }

        moved = false;
        dragging = null;
    }

    function update(){
        // the transparent circles that serve as ui, allowing for dragging and deleting
        var circles = ui.selectAll("circle")
            .data(points);

        circles.enter()
                .append("svg:circle")
                .on("mousedown", function(d) {
                    selected = dragging = d;
                });
        
        circles.exit().remove();

        circles.attr("r", 6)
            .attr("cx", function(d) {
                return map.l2p({
                    lat: d[1],
                    lon: d[0]
                }).x;
            })
            .attr("cy", function(d) {
                return map.l2p({
                    lat: d[1],
                    lon: d[0]
                }).y;
            });

        // the delaunay mesh paths
        var lines = g.selectAll("path")
            .data(d3.geom.delaunay(points));

        lines.enter().append("svg:path");
        lines.exit().remove();
        
        lines.attr("d", function(d) {
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

        var names = list.selectAll("li.place")
            .data(points);
        
        names.enter().append("li").attr("class","place");
        names.exit().remove();

        names.text(function(d,i){
            return places[i];   
        });
        
        // we move the newest point closer and closer to its destination
        if (new_pt) {
	        var last = points[points.length-1];
	        if (Math.abs(last[0] - new_pt[0]) > .0003) {
	            last[0] += (new_pt[0] - last[0]) / 3;
	        }    
	        if (Math.abs(last[1] - new_pt[1]) > .0003) {
	            last[1] += (new_pt[1] - last[1]) / 3;
	        }    

	        points[points.length - 1] = last;
	        
            var dlon = Math.abs(last[0] - new_pt[0]);
            var dlat = Math.abs(last[1] - new_pt[1]);
	        if (dlat < .0005 && dlon < .0005) {
	            clearInterval(updateInterval);
	            new_pt = null;
	        }	
        } else {
            clearInterval(updateInterval);
        }
    };

    self.add = function(latitude, longitude, placename) {
    	// clear previous update
    	if (updateInterval) {
            clearInterval(updateInterval);
    	}

        var lat = parseFloat(latitude);
        var lon = parseFloat(longitude);

        lats.push(lat);
        lons.push(lon);
        places.push(placename);

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

    self.remove = function(index) {
        
        points.splice(index, 1);
        lats.splice(index, 1);
        lons.splice(index, 1);
        places.splice(index, 1);
    };

    self.lats = function() {
    	return lats;
    };

    self.lons = function() {
    	return lons;
    };

    self.places = function() {
        return places;
    }

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