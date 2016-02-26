var tiles = [];
var loans = [];
$(document).ready(function () {
  init();
});
// States
var
  HOME = "home",
  ZOOM = "zoom",
  FLIP = "flip",
  cartNum = 0;
var removeTimer;

function init() {
  // Setup a grid
  setState(HOME)
  $(".cell-container").each(function (i, newDiv) {
    var
      x = $(window).width() / 2,
      y = $(window).height() / 2,
      z = 0;
    $(newDiv).css("transform", "translate3d(" + x + "px," + y + "px," + z + "px)");
  });

  function initTiles() {
    $(".cell-container").each(function (i, newDiv) {
      var tile = Tile.create(newDiv);
      tiles.push(tile);
      tile.setPosition({});
    });
	Tile.setOffset({
	"x": $("#grid").offset().left,
	"y":0
	})
  }
  initTiles();

  function resize() {
    $("body").height($(window).height())
    $("body").width($(window).width())

    $("#grid").css("margin-left", $(window).width() / 2 - 750 / 2);
    Tile.setOffset({
      "x": $("#grid").offset().left,
      "y": 0
    })
  }
  function addLoanTiles(tile){
    for (var i = 20; i > 0; i--) {
      var newLoan = Tile.clone(tile);
      newLoan.element.addClass("loan");
      var newPosition = tile.getPosition();

      newPosition.y -= i * 7-250;
      newLoan.setPosition(newPosition,.5);

      loans.push(newLoan);
      $("#grid").prepend(newLoan.getElement());
    }
  }

  function updateCart(num){
  	$('#itemNumber').html(num);
  }

  resize();
  $("#grid").on("Tile:Zoom", function (event, tile) {
    for (var i in tiles) {
      if (tile.getElement() != tiles[i].getElement()) {
        tiles[i].unzoomTile();
        tiles[i].hideTile();
      } else {
        tiles[i].unhideTile();
      }
    }
    if (loans.length > 0) return;
    addLoanTiles(tile)
    setState(ZOOM);
  })
  $("#grid").on("Tile:Unzoom", function (event, tile) {
    for (var i in tiles) {
      tiles[i].unzoomTile();
      tiles[i].unhideTile();
    }
    while (loans.length > 0) {
      var item = loans.pop();
      item.destroy();
    }
  })

  $("#grid").on("Tile:Flip", function (event, tile) {

  })
  $("#grid").on("Tile:Unflip", function (event, tile) {

  })

  $("#grid").on("Tile:AddToCart", function (event, tile) {
    cartNum++;
    updateCart(cartNum);
  })


  updateCart(0);

  function resetTiles() {
    for (var i in tiles) {
      var item = tiles[i];
      item.unhideTile();
      item.unzoomTile();
      item.unflipTile();
    }
    while (loans.length > 0) {
      var item = loans.pop();
      item.destroy();
    }
  }

  function setState(setState){
  	//States: HOME, ZOOM, FLIP
  	console.log(setState)
  	$("body").removeClass(HOME);
  	$("body").removeClass(ZOOM);
  	$("body").removeClass(FLIP);
  	state = setState;
  	$("body").addClass(state);
  }

  var lastIndexFingerTip;

  var controller = Leap.loop(function (frame) {
      if (frame.valid && frame.gestures.length > 0) {
        frame.gestures.forEach(function (gesture) {
          console.log(gesture.type);
          switch (gesture.type) {
          case "keyTap":
            {
              if (state === ZOOM && (isOverlap("#Cursor", "#grid .zoom.loan", 250) == true)) {
                $(".cell-container.zoom.loan").last().trigger('click');
              } else if (state === ZOOM) {
                resetTiles();
                setState(HOME);
              } else if (state == HOME && $("#Cursor").collision(".cell").length > 0) {
                $("#Cursor").collision(".cell").trigger('click');
                setState(ZOOM)
              } else {
                resetTiles();
                setState(HOME)
              }

              break;
            }
          case "swipe":
            {

              var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);
              //Classify as right-left or up-down
              if (isHorizontal) {
                if (gesture.direction[0] > 0) {
                  swipeDirection = "right";
                  if (state === ZOOM) {
                  	clearTimeout(removeTimer);
                    removeTimer = setTimeout($.proxy(function () {
                      if (loans.length > 0) {
                        var loan = loans.shift();
                        loan.addToCart();
                      }
                    }, this), 500);
                	}
                } else {
                  swipeDirection = "left";
                  if (state === ZOOM) {
                    clearTimeout(removeTimer);
                    removeTimer = setTimeout($.proxy(function () {
                      if (loans.length > 0) {
                        var loan = loans.shift();
                        loan.swipeAway();
                      }
                    }, this), 500);
                  }
                }
              } else { //vertical
                if (gesture.direction[1] > 0) {
                  swipeDirection = "up";
                } else {
                  swipeDirection = "down";
                }
              }
              break;
            }
          }
        });
      }

      if (frame && frame.fingers.length) {
        var indexFingerTip = frame.fingers[1] && frame.fingers[1].tipPosition, // [x,y,z]
          doc = document.documentElement,
          body = document.body,
          deltaY = Math.round((indexFingerTip[1] - 250) / 5),
          yThreshold = 15,
          top = window.scrollY,
          left = 0,
          finalDeltaY = (deltaY > yThreshold || deltaY < -yThreshold) ? deltaY : Math.floor(deltaY / yThreshold * 2);
        window.scrollTo(left, top - finalDeltaY)
        lastIndexFingerTip = indexFingerTip;

      }

      frame.hands.forEach(function (hand, index) {
        // console.log(hand.sreenPosition)
      });

    })
    .use('screenPosition')
    .connect()


  Leap.loop(function (frame) {
    frame.hands.forEach(function (hand, index) {
      Cursor.setCursor(hand.screenPosition())
    });

  }).use('screenPosition', {
    scale: 0.75
  });
  Cursor.create();

  $(window).resize(function () {
    resize();
  })

  $("body").on("click", function(){
  	resetTiles();
  	setState(HOME)
  })
}

function isOverlap(idOne, idTwo, thres) {
  var objOne = $(idOne),
    objTwo = $(idTwo),
    offsetOne = objOne.offset(),
    offsetTwo = objTwo.offset(),
    threshold = thres || 0,

    topOne = offsetOne.top - threshold,
    topTwo = offsetTwo.top,
    leftOne = offsetOne.left - threshold,
    leftTwo = offsetTwo.left,
    widthOne = objOne.width() + threshold,
    widthTwo = objTwo.width(),
    heightOne = objOne.height() + threshold,
    heightTwo = objTwo.height();
  var leftTop = leftTwo > leftOne && leftTwo < leftOne + widthOne && topTwo > topOne && topTwo < topOne + heightOne,
    rightTop = leftTwo + widthTwo > leftOne && leftTwo + widthTwo < leftOne + widthOne && topTwo > topOne && topTwo < topOne + heightOne,
    leftBottom = leftTwo > leftOne && leftTwo < leftOne + widthOne && topTwo + heightTwo > topOne && topTwo + heightTwo < topOne + heightOne,
    rightBottom = leftTwo + widthTwo > leftOne && leftTwo + widthTwo < leftOne + widthOne && topTwo + heightTwo > topOne && topTwo + heightTwo < topOne + heightOne;
  return leftTop || rightTop || leftBottom || rightBottom;
}
