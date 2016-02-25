$(document).ready( function (){



		var cellWidth = 300 , cellHeight = 300;

		// Setup a grid
		$(".cell-container").each( function (i, newDiv){
			var 
			x = $(window).width()/2,
			y = $(window).height()/2,
			z = 0;

			console.log(x,y,z);

			$(newDiv).css("transform" , "translate3d("+x+"px,"+y+"px,"+z+"px)");
		});

 		function setTile(newDiv, position){
 			console.log(position)
 				var 
 					x = (position.x !== undefined)? position.x : $(newDiv).data("x"),
 					y = (position.y !== undefined)? position.y : $(newDiv).data("y"),
 					z = (position.z !== undefined)? position.z : $(newDiv).data("z");

 				// Save prev position
 				$(newDiv).data("prevx", $(newDiv).data("x"));
 				$(newDiv).data("prevy", $(newDiv).data("y"));
 				$(newDiv).data("prevz", $(newDiv).data("z"));
 				// Set new position
 				$(newDiv).css("transform" , "translate3d("+x+"px,"+y+"px,"+z+"px)");
 				$(newDiv).data("x", x);
 				$(newDiv).data("y", y);
 				$(newDiv).data("z", z);
 		}


 		function initTiles(){
 			$(".cell-container").each( function (i, newDiv){
 				setTile(newDiv,{});
 			});
 		}

		initTiles();

 		$(window).resize(function(){
 			// resize();
 		})
 		var anchorPosition = {	"x": $(window).width()/2 - cellWidth/2, 
 								"y": $(window).height()/2 - cellHeight/2, 
 								"z": 0} ; 

 		$('#grid .cell').on("click", function(e){
				var parentCell = $(this).parent(".cell-container"),
					alreadyActive = parentCell.hasClass("active");
 				
 				if (alreadyActive){
 					resetTiles(parentCell);
 				}else{
					resetTiles();
 					
 					parentCell.toggleClass("active");
 					parentCell.toggleClass("zoom");
 					console.log("set center")
 					setTile(parentCell, anchorPosition);

 				}
				e.preventDefault();
 		});

 		function resetTiles(active){
 			$('#grid .cell-container').each(function(i,e){
 				if ($(e).hasClass("active") && $(e) != $(active)){
 					$(e).removeClass("active");
					$(e).removeClass("zoom");
 					console.log("reset tile")
 					setTile(e, {		"x":$(e).data("prevx"),
										"y":$(e).data("prevy"),
										"z":$(e).data("prevz")});

 					
 				}

 			})
 		}



 		var lastIndexFingerTip;
		var controller = Leap.loop(function(frame){
		  if(frame.valid && frame.gestures.length > 0){
		    frame.gestures.forEach(function(gesture){
		        switch (gesture.type){
		          case "keyTap":
		              console.log("Key Tap Gesture");
		              $("#Cursor").collision(".cell").trigger('click');	
		              break;
		          case "screenTap":
		              console.log("Screen Tap Gesture");
		              $("#Cursor").collision(".cell").trigger('click');
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
		  		 // if ($(".cell.active").length == 0)
		  		 // 	window.scrollTo (left, top - finalDeltaY)
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

	});