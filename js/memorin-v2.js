(function(){

var COLOR_COUNT = 18;
var EVENT_ANIMATION_END = "webkitAnimationEnd";
var EVENT_USER_BUTTON_ON  = "touchstart mousedown";
var EVENT_USER_BUTTON_OFF = "touchend touchemove mousemove mouseup";

var memorin = memorin || {};

/* memorin util & initialize */

memorin.keyframesAnimationHelper = function keyframesAnimationHelper($target, animation_class_mame, opt_isRemoveClass){
  var def = $.Deferred();

  $target.one(EVENT_ANIMATION_END, function(){
    if(opt_isRemoveClass){
      $target.removeClass(animation_class_mame);
    }
    def.resolve();
  }).addClass(animation_class_mame);

  return def.promise();
}



/* memorin util & initialize */


var Memo = Backbone.Model.extend({
  defaults: function(){
    return {
      content: "",
      color: _.random(1, COLOR_COUNT),
      category: ["memo"]
    }
  },
  validate: function( attrs ){
    if( _.isEmpty(attrs.content) ){
      return true;
    }
  },
  done: function(){
    this.save();
  }
});

var MemoView = Backbone.View.extend({
  tagName: "li",
  className: "memorin-memo small",
  template: _.template( $("#memorin-item").html() ),
  render: function(){
    var template = this.template( this.model.toJSON() );

    this.$el.addClass( "color" + this.model.get("color") );
    this.$el.html(template);

    return this;
  },
  events: {
    "click .delete": "removeMemo",
    "click": "toggleSize"
  },
  removeMemo: function(){
    var $memo = this.$el;
    $memo.find(".delete").remove();
    this.model.destroy();

    memorin.keyframesAnimationHelper($memo, "anime--memo-out").then(function(){
      $memo.css("padding", "0")
      .animate({
        height: 0,
        opacity: 0
      },200,function(){
        $memo.remove();
      });
    });
  },
  toggleSize: function(){
    console.log($(this));
    $(this).toggleClass('large');
  }
});


var Memos = Backbone.Collection.extend({
  model: Memo,
  localStorage: new Backbone.LocalStorage("memos")
});

var MemosView = Backbone.View.extend({
  tagName: "ul",
  id: "js-memorin-items",
  className: "memorin-items",
  render: function(){
    this.collection.each(function( memo ){
      var memoView = new MemoView( {model: memo} );
      this.$el.append(memoView.render().el)
    },this);
    return this;
  }
});

// var memos = new Memos(
//   [
//     {
//       content: "ああああ\nあああいい\nいおい\nおお",
//       color: "4"
//     },
//     {
//       content: "ああああああ\nあいいい\nいあいおあいおいおあおいあ",
//       category: ["memo","test"]
//     },
//     {
//       content: "ああああああ\nあいいい\nいあいおあいおいおあおいあ"
//     },
//     {
//       content: "ああああああ\nあいいい\nいあいおあいおいおあおいあ",
//       color: "2"
//     },
//     {
//       content: "ああああああ\nあいいい\nいあいおあいおいおあおいあ",
//     },
//     {
//       content: "ああああああ\nあいいい\nいあいおあいおいおあおいあ"
//     }
//   ]
// );
var memos = new Memos;

var MemorinView = Backbone.View.extend({

  el: $("#memorin"),
  events: {
    "click #js-menu-memoru": "showEditor",
    "click #js-memorin-editor-close": "hideEditor",
    "click #js-menu-trash" : "removeAll",
    "click #js-memorin-add": "addMemo",
  },
  initialize: function(){
    $(document).on( EVENT_USER_BUTTON_ON,'.js-button',function(){
      $(this).addClass('button--on');
    });
    $(document).on( EVENT_USER_BUTTON_OFF,'.js-button',function(){
      $(this).removeClass('button--on');
    });

    this.listenTo(memos, 'add', this.showMemo);
    this.listenTo(memos, 'remove', this.removeMemo);
    console.log(memos);
    memos.fetch();
    console.log(memos);

    this.render();


  },
  render: function(){
    var memosView = new MemosView( {collection: memos} );
    $("#js-memos-render").html(memosView.render().el);
  },
  showMemo: function(memo){
    var view = new MemoView( {model:memo});
    $("#js-memorin-items").append(view.render().el);
  },
  showEditor: function(){

    $("#js-memorin-editor").css("display","block");
    $("#js-form-textarea").focus();

    memorin.keyframesAnimationHelper($("#js-memorin-editor-outer"),"anime--show-editor").then(function(){
    });

  },
  hideEditor: function(){
    $("#js-memorin-editor").slideUp("fast");
  },
  addMemo: function(){
    var content = $('#js-form-textarea').val();
    var memo = new Memo;
    memo.set({"content":content},{validate:true});

    if( _.isEmpty(memo.get("content")) ){
      return false;
    }else{
      memos.add(memo);
      memo.save();
    }

  },
  removeAll: function(){
    localStorage.clear();
    memos.fetch();
    this.render();
  }

});

var Memorin = new MemorinView;

})();