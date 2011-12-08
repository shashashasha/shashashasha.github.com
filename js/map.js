var mappu = {};

mappu = function() {
	var po = org.polymaps;
	var self = {};

	var baseURL = "http://tile.cloudmade.com/1a1b06b230af4efdbb989ea99e9841af/22677/256/{Z}/{X}/{Y}.png";
	var container = document.getElementById("map");

	self.map = po.map()
		.container(container.appendChild(po.svg("svg")))
		.zoom(13)
		.center({ lat: 37.755, lon: -122.445 });
	
	self.map.add(po.image()
		.url(po.url(baseURL)
	    .hosts(["a.", "b.", "c.", ""])));

	self.updateBounds = function(lats, lons) {
		// south-west, north-east 
		var extent = [{ 
			lat: d3.min(lats), 
			lon: d3.min(lons) 
		}, 
		{ 
			lat: d3.max(lats), 
			lon: d3.max(lons)
		}];

		// self.map.zoom(10).center({
		// 	lat: 0, lon: 0
		// });

		// var sw_pt = self.map.locationPoint(extent[0]);
		// var ne_pt = self.map.locationPoint(extent[1]);
		
		// var width = Math.abs(ne_pt.x - sw_pt.x);
		// var height = Math.abs(ne_pt.y - sw_pt.y);
		// var max = 900;
		// var ratio = width > height ? max / width : max / height;

		// width *= ratio;
		// height *= ratio;

		// container.style.width = (width) + 'px';
		// container.style.height = (height) + 'px';
		
		// self.map.extent(extent);

		// console.log(extent, self.map.extent());
		// console.log(extent[0].lat - self.map.extent()[0].lat, extent[0].lon - self.map.extent()[0].lon);
		// console.log('w:', width, 'h:', height);
		
		// var lp = self.map.locationPoint;
		// var dif = lp(extent[0]).y - lp(self.map.extent()[0]).y;
		
		// if (dif) {
		// 	container.style.top = (150 - dif) + 'px';	
		// }
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

	return self;
}();