var tiles = [];
$(document).ready( function (){

		// Setup a grid
		$(".cell-container").each( function (i, newDiv){
			var 
			x = $(window).width()/2,
			y = $(window).height()/2,
			z = 0;
			$(newDiv).css("transform" , "translate3d("+x+"px,"+y+"px,"+z+"px)");
		});

 		function initTiles(){
 			$(".cell-container").each( function (i, newDiv){
 				var tile= Tile.create(newDiv);
 				tiles.push( tile );
 				tile.setPosition({});
 				tile.setOffset({"x":$("#grid").offset().left, "y":0})
 			});
 		}
		initTiles();
		
		function resize(){
			$("body").height($(window).height())
			$("body").width($(window).width())


			$("#grid").css("margin-left", $(window).width()/2-750/2);
			for (var i in tiles){
				tiles[i].setOffset({"x":$("#grid").offset().left, "y":0})
			}
		}

 		 resize();
 		 $("#grid").on("Tile:Zoom", function(event, tile){
 		 	for (var i in tiles){
 		 		if (tile != tiles[i].getElement()){
 		 			tiles[i].unzoomTile();
 		 			tiles[i].hideTile();
 		 		}else{
 		 			tiles[i].unhideTile();
 		 		}
 		 	}
 		 })
 		 $("#grid").on("Tile:Unzoom", function(event, tile){
			for (var i in tiles){
 		 		tiles[i].unzoomTile();
 		 		tiles[i].unhideTile();
 		 	}
 		 })

 		function resetTiles(){
 			for (var i in tiles){
 				var item = tiles[i];
 				item.unhideTile();
 				item.unzoomTile();
 				item.unflipTile();
 			}
 		}

 		var lastIndexFingerTip;
		var controller = Leap.loop(function(frame){
		  if(frame.valid && frame.gestures.length > 0){
		    frame.gestures.forEach(function(gesture){
		        switch (gesture.type){
		          case "keyTap":
		          case "screenTap":
		              console.log("Tap Gesture");
		              if ($(".cell-container.zoom").length>0){
		              	if (isOverlap("#Cursor", "#grid .zoom", 250)== true ){
		              		$(".cell-container.zoom").first().trigger('click');
		              	}else
		              		resetTiles();
		              }else if ($("#Cursor").collision(".cell").length > 0)
		              	$("#Cursor").collision(".cell").trigger('click');
		              else
		              	resetTiles();
		              break;
		        }
		    });
		  }

		  if (frame&&frame.fingers.length){
		  		var indexFingerTip = frame.fingers[1]&&frame.fingers[1].tipPosition,  // [x,y,z]
		  		 doc 	= document.documentElement, body = document.body,
		  		 deltaY = Math.round((indexFingerTip[1]-250)/5),
		  		 yThreshold = 15,
		  		 top 	= window.scrollY,
		  		 left 	= 0,
		  		 finalDeltaY = (deltaY > yThreshold || deltaY < -yThreshold)? deltaY: Math.floor(deltaY/yThreshold*2)
		  		 ;
		  		 // console.log(finalDeltaY,  top)
		  		 // if ($(".cell-container.active").length == 0)
		  		 window.scrollTo (left, top - finalDeltaY)
		  		 lastIndexFingerTip = indexFingerTip;

		  }

		  frame.hands.forEach(function(hand, index) {
		    // console.log(hand.sreenPosition)
		  });

		})
		.use('screenPosition')
		.connect()


		Leap.loop(function(frame) {
		  frame.hands.forEach(function(hand, index) {
		    Cursor.setCursor(hand.screenPosition())
		  });

		}).use('screenPosition', {scale: 0.75});
		Cursor.create();

 		$(window).resize(function(){
 			 resize();
 		})

	});


function isOverlap(idOne,idTwo, thres){
        var objOne=$(idOne),
            objTwo=$(idTwo),
            offsetOne = objOne.offset(),
            offsetTwo = objTwo.offset(),
            threshold = thres || 0,
            
            topOne=offsetOne.top-threshold,
            topTwo=offsetTwo.top,
            leftOne=offsetOne.left-threshold,
            leftTwo=offsetTwo.left,
            widthOne = objOne.width()+threshold,
            widthTwo = objTwo.width(),
            heightOne = objOne.height()+threshold,
            heightTwo = objTwo.height();
        var leftTop = leftTwo > leftOne && leftTwo < leftOne+widthOne                  && topTwo > topOne && topTwo < topOne+heightOne, 
            rightTop = leftTwo+widthTwo > leftOne && leftTwo+widthTwo < leftOne+widthOne                  && topTwo > topOne && topTwo < topOne+heightOne,             leftBottom = leftTwo > leftOne && leftTwo < leftOne+widthOne                  && topTwo+heightTwo > topOne && topTwo+heightTwo < topOne+heightOne,             rightBottom = leftTwo+widthTwo > leftOne && leftTwo+widthTwo < leftOne+widthOne                  && topTwo+heightTwo > topOne && topTwo+heightTwo < topOne+heightOne;
        return leftTop || rightTop || leftBottom || rightBottom;
}
