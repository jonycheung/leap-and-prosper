var Cursor = (function(){
 		var img = document.createElement('img');
		var setCursor = function (position){
			setPosition(position);
		}
		,createCursor  = function () {
  			img.src = 'http://www.aminoapps.com/static/bower/emojify.js/images/emoji/black_circle.png';
  			img.style.position = 'absolute';
  			img.style.zIndex = '10001';
  			img.id = "Cursor";
			img.onload = function () {
				$('body').append(img);
			}
		}
		,setPosition = function(position){
			img.style.left = position[0] - img.width  / 2 + 'px';
    		img.style.top  = position[1] + $(window).scrollTop() + $(window).height()*.60 + $(window).height()/4 - img.height / 2+ 'px';
    		
    		img.style.webkitTransform = img.style.MozTransform = img.style.msTransform =
    		img.style.OTransform = img.style.transform;
		}

		return  {
			setCursor	: setCursor,
			create 		: createCursor
		}
	})()