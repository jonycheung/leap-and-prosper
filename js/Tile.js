var Tile = (function (){
	//Singleton
	var
		cellWidth = cellHeight = 375,
		xOffset = 0,
		yOffset = 0,
		anchorPosition,
		awayPosition = {"x":-$(window).width()},
		cartPosition = {"x": $(window).width()-xOffset, "y": -200}; 

	function TileClass(e,_x,_y,_z){
			this.x = _x||0,
			this.y = _y||0,
			this.z = _z||0,
			this.prevx = 0,
			this.prevy = 0,
			this.prevz = 0,
			this.element = e,
			this.zoomed = false,
			this.flipped = false,
			this.destroyTimer,
			self = this;
		
		this.setPosition = function(position, delay){
			// Save prev position
			this.prevx = this.x;
			this.prevy = this.y;
			this.prevz = this.z;
			
			this.x = (position.x !== undefined)? position.x : this.x,
			this.y = (position.y !== undefined)? position.y : this.y,
			this.z = (position.z !== undefined)? position.z : this.z;
			// Set new position
			setTimeout($.proxy(function(){
				$(this.element).css("transform" , "translate3d("+this.x+"px,"+this.y+"px,"+this.z+"px)");
			},this), delay*1000);
			
		}
		this.getPosition = function(){
			return {"x":this.x, "y":this.y, "z":this.z}
		}

		this.zoomTile = function(){
			if (this.zoomed) return;
				$(this.element).addClass("zoom");
			this.setPosition(anchorPosition);
			this.zoomed = true;
		}

		this.flipTile = function(){
				$(this.element).addClass("flip");
				this.flipped = true;
		}
		this.unflipTile = function(){
				$(this.element).removeClass("flip");
				this.flipped = false;
		}
		this.resetTile = function(){
			this.setPosition ({"x":this.prevx, "y":this.prevy, "z":this.prevz});
		}

		this.unzoomTile = function(){
			if (!this.zoomed) return;
			$(this.element).removeClass("zoom");
			this.setPosition({"x":this.prevx, "y":this.prevy, "z":this.prevz});
			this.zoomed = false;
		}
		this.hideTile = function(){
			$(this.element).addClass("hide");
		}
		this.unhideTile = function(){
			$(this.element).removeClass("hide");
		}
		this.getElement = function(){
			return this.element;
		}
		this.swipeAway = function(){
			this.setPosition(awayPosition);
			destroyTimer = setTimeout($.proxy(function (){
				this.destroy()
			}, this), 500)
		}
		this.addToCart = function(){
			this.setPosition(cartPosition);
			destroyTimer = setTimeout($.proxy(function (){
				this.destroy()
			}, this), 500)
			$(this.element).trigger("Tile:AddToCart", [this]);
		}
		
		this.x = _x || $(this.element).data("x"),
		this.y = _y ||  $(this.element).data("y"),
		this.z = _z || $(this.element).data("z");
		
		this.setPosition ({"x":this.x, "y":this.y, "z":this.z})

		function clickEvent(e){
			if (!this.zoomed){
				this.zoomTile();
				$(this.element).trigger("Tile:Zoom", [this]);
			}else{
				//If it's zoomed. let's go in
				if (this.flipped){
					this.unflipTile();
					$(this.element).trigger("Tile:Unflip", [this]);
				} else {
					this.flipTile();
					$(this.element).trigger("Tile:Flip", [this]);
				}
			}
			e.preventDefault();
			e.stopPropagation();
 		}
		$(this.element).select(".cell").on("click", $.proxy(clickEvent,this));

		this.destroy = function(){
			// /console.log("destroyed");
			$(this.element).remove();
			delete this;
		}
		return this;
	}

	setOffset = function(position){
		// console.log("setOffset");
		xOffset = position.x || 0;
		yOffset = position.y || 0;
		setAnchorPosition();
	}
	setAnchorPosition = function(){
 		anchorPosition = {	"x":  $(window).width()/2 - cellWidth/3 - xOffset, 
							"y":  $(window).height()/2 - yOffset - cellHeight/1.5, 
							"z":  0} ;
	}

	return {
		create: function(e){
			return new TileClass(e);
		},
		clone: function(tileInstance){
			// $(tileInstance.element).css("zIndex", 10005)
			return new TileClass($(tileInstance.element).clone(), -$(window).width(),tileInstance.y,tileInstance.z);
		},
		setOffset:setOffset,
		getOffset: function(){
			return anchorPosition;
		}
	}
	

})()