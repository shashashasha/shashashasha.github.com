var sb = sb || {};

sb.map = function(frame, width, height) {
	var po = org.polymaps;
	var self = {};

	var baseURL = "http://tile.cloudmade.com/1a1b06b230af4efdbb989ea99e9841af/22677/256/{Z}/{X}/{Y}.png";

	var container = d3.select(frame || "body").append("div")[0][0];
      
    container.style.position = "absolute";
    container.style.width = width || '600px';
    container.style.height = height || '600px';

	// var container = document.getElementById(selector || "body");
	var image = po.image()
		.url(po.url(baseURL)
	    .hosts(["a.", "b.", "c.", ""]));
	    
	self.map = po.map()
		.container(container.appendChild(po.svg("svg")))
		.zoom(12)
		.center({ lat: 37.755, lon: -122.445 });
	
	self.map.add(image);

	$(".map").find("rect").attr("visibility","visible").attr("fill","white");

	// self.map.add(po.interact());

	self.frame = function() {
		return container;
	};

	self.show = function() {
		if (!image.map()) {
			self.map.add(image);		
		}
	};

	self.hide = function() {
		if (image.map()) {
			self.map.remove(image);
		}
	};

	self.updateBounds = function(lats, lons) {
		if (lats.length == 0 || lons.length == 0) return;
		if (lats.length == 1 && lons.length == 1) {
			self.map.center({
				lat: lats[0],
				lon: lons[0]
			}).zoom(10);
			return;
		}

		// south-west, north-east 
		var extent = [{ 
			lat: d3.min(lats),
			lon: d3.min(lons)
		}, 
		{ 
			lat: d3.max(lats),
			lon: d3.max(lons)
		}];

		self.map.extent(extent);
	};

	// this was old, from when we were updating the proportions of the map. 
	// there are a lot of quirks here because of the difference 
	// between the extent you give it and the one polymaps ends up with
	self.resizeContainer = function(lats, lons) {
		// south-west, north-east 
		var extent = [{ 
			lat: d3.min(lats), 
			lon: d3.min(lons) 
		}, 
		{ 
			lat: d3.max(lats), 
			lon: d3.max(lons)
		}];

		// reset the view for a bit
		self.map.zoom(10).center({
			lat: 0, lon: 0
		});

		var sw_pt = self.map.locationPoint(extent[0]);
		var ne_pt = self.map.locationPoint(extent[1]);
		
		var width = Math.abs(ne_pt.x - sw_pt.x);
		var height = Math.abs(ne_pt.y - sw_pt.y);
		var max = 900;
		var ratio = width > height ? max / width : max / height;

		width *= ratio;
		height *= ratio;

		container.style.width = (width) + 'px';
		container.style.height = (height) + 'px';

		self.map.extent(extent);

		// console.log(extent[0].lat - self.map.extent()[0].lat, extent[0].lon - self.map.extent()[0].lon);
		// console.log('w:', width, 'h:', height);
		
		var dif = self.l2p(extent[0]).y - self.l2p(self.map.extent()[0]).y;
		
		if (dif) {
			container.style.top = (150 - dif) + 'px';	
		}
	};

	// take extent and get it in x y 
	self.getBounds = function() {
		var extent = self.map.extent();
		var sw_pt = self.map.locationPoint(extent[0]);
		var ne_pt = self.map.locationPoint(extent[1]);

		return {
			t: ne_pt.y,
			b: sw_pt.y,
			l: sw_pt.x,
			r: ne_pt.x
		};
	};

	// location to point converter
	self.l2p = function(loc) {
		return self.map.locationPoint(loc);
	};

	// point to location converter
	self.p2l = function(pt) {
		return self.map.pointLocation(pt);
	};

	return self;
};