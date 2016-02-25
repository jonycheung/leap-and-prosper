$(document).ready( function (){
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
 					x = position.x || $(newDiv).data("x") || 0,
 					y = position.y || $(newDiv).data("y") || 0,
 					z = position.z || $(newDiv).data("z") || 0;

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
 		var anchorPosition = {"x":250, "y":400, "z":0} ; 

 		$('#grid .cell').on("click", function(e){
				var parentCell = $(this).parent(".cell-container"),
					alreadyActive = parentCell.hasClass("active");
 				
 				if (alreadyActive){
					$('#grid .cell-container').removeClass("active");
 					$('#grid .cell-container').removeClass("zoom");
 					
 					setTile(parentCell, {	"x":parentCell.data("prevx"),
 											"y":parentCell.data("prevy"),
 											"z":parentCell.data("prevz")});
 				}else{
 					
 					parentCell.toggleClass("active");
 					parentCell.toggleClass("zoom");
 					setTile(parentCell, anchorPosition);

 				}
				e.preventDefault();
 		});



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
		  		 if ($(".cell.active").length == 0)
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

	});