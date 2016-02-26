var Tile = (function () {
	//Singleton
	var
		cellWidth = cellHeight = 375,
		xOffset = 0,
		yOffset = 0,
		anchorPosition; 

	function TileClass(e){
		var 
			x = 0,
			y = 0,
			z = 0,
			prevx = 0,
			prevy = 0,
			prevz = 0,
			element = e,
			zoomed = false,
			flipped = false
			self = this;
		
		function setPosition(position){
			// Save prev position
			prevx = x;
			prevy = y;
			prevz = z;
			
			x = (position.x !== undefined)? position.x : x,
			y = (position.y !== undefined)? position.y : y,
			z = (position.z !== undefined)? position.z : z;
			// Set new position
			$(element).css("transform" , "translate3d("+x+"px,"+y+"px,"+z+"px)");
		}

		function zoomTile(){
			if (zoomed) return;
			$(element).addClass("zoom");
			setPosition(anchorPosition);
			zoomed = true;
		}

		function flipTile(){
				$(element).addClass("flip");
				flipped = true;
		}
		function unflipTile(){
				$(element).removeClass("flip");
				flipped = false;
		}
		function resetTile(){
			setPosition ({"x":prevx, "y":prevy, "z":prevz});
		}

		function unzoomTile(){
			if (!zoomed) return;
			$(element).removeClass("zoom");
			setPosition({"x":prevx, "y":prevy, "z":prevz});
			zoomed = false;
		}
		function hideTile(){
			$(element).addClass("hide");
		}
		function unhideTile(){
			$(element).removeClass("hide");
		}
		
		x = $(element).data("x"),
		y = $(element).data("y"),
		z = $(element).data("z");
		
		setPosition ({"x":x, "y":y, "z":z})

		$(element).select(".cell").on("click", function(e){
			console.log("zoomed" + zoomed)
			if (!zoomed){
				zoomTile();
				$(element).trigger("Tile:Zoom", [element]);
			}
			else{
				//If it's zoomed. let's go in
				if (flipped){
					unflipTile();
				} else {
					flipTile();
				}
				$(element).trigger("Tile:Flip", [element]);
			}
			
			e.preventDefault();
 		});

		return {
			create: function (e){

				return this;
			},
			setPosition : setPosition,
			getElement: function (){
				return element;
			},
			zoomTile: zoomTile,
			flipTile: flipTile,
			unflipTile: unflipTile,
			unzoomTile: unzoomTile,
			resetTile: resetTile,
			setOffset: setOffset,
			hideTile:hideTile,
			unhideTile:unhideTile
		} 

	}

	function setOffset(position){
		xOffset = position.x;
		yOffset = position.y;
		setAnchorPosition();
	}
	function setAnchorPosition(){
 		anchorPosition = {	"x": $(window).width()/2 - cellWidth/2 - xOffset, 
							"y":  $(window).height()/2 - cellHeight/2 - yOffset, 
							"z": 0} ;
	}

	return {
		create: function (e){
			return new TileClass(e);
		},
		setOffset:setOffset
	}
	

})()