var mstorage = mstorage || {};

mstorage.items = [
  {
    content: "ああああ\nあああいい\nいおい\nおお",
    color: "4",
    category: ["memo"]
  },
  {
    content: "ああああああ\nあいいい\nいあいおあいおいおあおいあ",
    category: ["memo"]
  },
  {
    content: "ああああああ\nあいいい\nいあいおあいおいおあおいあ",
    category: ["memo"]
  },
  {
    content: "ああああああ\nあいいい\nいあいおあいおいおあおいあ",
    color: "2",
    category: ["memo"]
  },
  {
    content: "ああああああ\nあいいい\nいあいおあいおいおあおいあ",
    category: ["memo"]
  },
  {
    content: "ああああああ\nあいいい\nいあいおあいおいおあおいあ",
    category: ["memo"]
  }
];

(function($) {
  $(function() {

  var ANIMATION_END_EVENT;
      ANIMATION_END_EVENT = "webkitAnimationEnd";
  var USER_BUTTON_EVENT_ON  = "touchstart mousedown";
  var USER_BUTTON_EVENT_OFF = "touchend mouseup";

  var memorin = memorin || {};

  memorin.grid = "#js-memorin";

  var $grid = $(memorin.grid);

  memorin.createBrick = function createBrick(content_text){
    var brick = $('<li class="brick small">');
    brick.text(content_text);
    brick.append('<a class="delete"></a>');
    return brick;
  };

  memorin.addBrick = function addBrick(brick){
    $grid.append(brick);
  };

  memorin.createMemo = function createMemo(contents){
      contents = $.extend({
        content: " ",
        color: (( (Math.random()*18) +1 )|0),
        category: ["memo"]
      }, contents);

      contents.content = contents.content.replace(/\n/g,"<br>");

      var $brick = $('<li class="brick small">').addClass('color'+contents.color);
      var $content = $('<div class="memorin__content">').html(contents.content);
      var $del = $('<a class="delete">');

      $brick.append($content).append($del);

      return $brick;
  };


  memorin.init = function init(){
    $(document).on('click','.delete',function(event){
      var $this;
      event.preventDefault();
      event.stopPropagation();
      $this = $(this);

      // $this.closest('.brick').hide("normal",function(){
      //     $(this).remove();
      // });

      var $brick = $this.closest('.brick');
      $this.remove();
      doKeyframesAnime($brick,'anime--brick-out').then(function(){
          $brick.css('padding','0');
          $brick.animate({
            height: 0,
            opacity: 0
          },200,function(){
            $brick.remove();
          });
          // $brick.slideUp(200,function(){
          //   $brick.remove();
          // });
      });
    });

    function doKeyframesAnime($obj, animation_class){
        var def = $.Deferred();

        $obj.one(ANIMATION_END_EVENT,function(){
          def.resolve();
        }).addClass(animation_class);

        return def.promise();
    }

    $(document).on( USER_BUTTON_EVENT_ON,'.js-button',function(){
      $(this).addClass('button--on');
    });
    $(document).on( USER_BUTTON_EVENT_OFF,'.js-button',function(){
      $(this).removeClass('button--on');
    });

    $(document).on('click','.brick',function(){

      $(this).toggleClass('large');
    })

    $('#add').on('click',function(){
      // event.preventDefault();
      // event.stopPropagation();

      var content_text = window.prompt('add event');

      var brick = memorin.createBrick(content_text);
      var rand = ((Math.random()*18)+1)|0;
      var col = 'color'+rand;
      brick.addClass(col);
      memorin.addBrick(brick);
    });

    (function initMemorin(){
      $.each(mstorage.items,function(){
        memorin.addBrick(memorin.createMemo(this));
      });
    })();


  };
  memorin.init();


  $('textarea').autosize();
  });
})(jQuery);
