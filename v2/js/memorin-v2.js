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
      category: ["memo"],
      important: false
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
    this.stickit();
    return this;
  },
  bindings: {
    ".memorin__content":{
      observe: "content",
      update: function($el,val,mode,options) {
        $el.html(val);
      }
    }
  },
  events: {
    "click .delete": "removeMemo",
    "click": "updateMemo"
  },
  removeMemo: function(event){
    event.stopPropagation();
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
    this.$el.toggleClass('large');
  },
  updateMemo: function(){
    this.showModal();
  },
  showModal: function(){
    var def = $.Deferred();
    var model = this.model;
    var $textarea = $("#js-modal-textarea");
    var $bg = $("#js-background-dark");
    var $modal = $("#js-memorin-modal");

    $textarea.val(this.model.get("content").replace(/\<br\>/g,"\n"));
    $bg.show();
    $modal.show();
    $textarea.focus();
    $("#js-modal-textarea").autosize();
    $("#js-modal-btn").one('click',function(){
      model.set("content",$textarea.val().replace(/\n/g,"<br>"));
      model.save();
      $textarea.val("");
      $modal.hide();
      $bg.hide();
    });

    return def.promise();
  },
  initialize: function(){
    var isCmd = false;
    $("#js-modal-textarea").keydown(function(e){
      if(e.which === 91 || e.which === 93){
        isCmd = true;
      }
      if(isCmd && e.which === 13){
        isCmd = false;
        $("#js-modal-btn").trigger("click");
      }
    }).keyup(function(e){
      if(e.which === 91 || e.which === 93){
        isCmd = false;
      }
    }).autosize();
  }
});


var Memos = Backbone.Collection.extend({
  model: Memo,
  localStorage: new Backbone.LocalStorage("memos"),
  colorPick: function(num){
    return this.where({color:num});
  }
});

var MemosView = Backbone.View.extend({
  tagName: "ul",
  id: "js-memorin-items",
  className: "memorin-items",
  render: function(){
    this.collection.each(function( memo ){
      var memoView = new MemoView( {model: memo} );
      this.$el.prepend(memoView.render().el)
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
    var isCmd = false;
    var self = this;
    $("#js-form-textarea").keydown(function(e){
      if(e.which === 91 || e.which === 93){
        isCmd = true;
      }
      if(isCmd && e.which === 13){
        isCmd = false;
        self.addMemo();
      }
    }).keyup(function(e){
      if(e.which === 91 || e.which === 93){
        isCmd = false;
      }
    }).autosize();


    this.listenTo(memos, 'add', this.showMemo);
    this.listenTo(memos, 'remove', this.removeMemo);

    memos.fetch();
    this.render();

    // this.render(memos.colorPick(5));


  },
  render: function(){
    var memosView = new MemosView( {collection: memos} );
    $("#js-memos-render").html(memosView.render().el);
    return this;
  },
  showMemo: function(memo){
    var view = new MemoView( {model:memo});
    $("#js-memorin-items").prepend(view.render().el);
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
    var $textarea = $('#js-form-textarea');
    var content = $textarea.val().replace(/\n/g,"<br>");
    var memo = new Memo;
    memo.set({"content":content},{validate:true});

    $textarea.val("");

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