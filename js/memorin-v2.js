(function(){

var COLOR_COUNT = 18;
var EVENT_ANIMATION_END = "webkitAnimationEnd";
var EVENT_USER_BUTTON_ON  = "touchstart mousedown";
var EVENT_USER_BUTTON_OFF = "touchend mouseup";

var memorin = memorin || {};

memorin.keyframesAnimationHelper = function keyframesAnimationHelper($target, animation_class_mame){
  var def = $.Deferred();

  $target.one(EVENT_ANIMATION_END, function(){
    def.resolve();
  }).addClass(animation_class_mame);

  return def.promise();
}

var Memo = Backbone.Model.extend({
  defaults: function(){
    return {
      color: _.random(1, COLOR_COUNT),
      category: ["memo"]
    }
  },
  validate: function( attrs ){
    if( _.isEmpty(attrs.content) ){
      return "content must not be empty";
    }
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
    "click .delete": "removeMemo"
  },
  removeMemo: function(){
      var $memo = this.$el;
      $memo.find(".delete").remove();
      memorin.keyframesAnimationHelper($memo, "anime--memo-out").then(function(){
        console.log("anime ned");
        $memo.css("padding", "0")
        .animate({
          height: 0,
          opacity: 0
        },200,function(){
          $memo.remove();
        });
      });

  }
});

var Memos = Backbone.Collection.extend({
  model: Memo
});

var MemosView = Backbone.View.extend({
  tagName: "ul",
  className: "memorin-items",
  render: function(){
    this.collection.each(function( memo ){
      var memoView = new MemoView( {model: memo} );
      this.$el.append(memoView.render().el)
    },this);
    return this;
  }
});

var memos = new Memos(
  [
    {
      content: "ああああ\nあああいい\nいおい\nおお",
      color: "4"
    },
    {
      content: "ああああああ\nあいいい\nいあいおあいおいおあおいあ",
      category: ["memo","test"]
    },
    {
      content: "ああああああ\nあいいい\nいあいおあいおいおあおいあ"
    },
    {
      content: "ああああああ\nあいいい\nいあいおあいおいおあおいあ",
      color: "2"
    },
    {
      content: "ああああああ\nあいいい\nいあいおあいおいおあおいあ",
    },
    {
      content: "ああああああ\nあいいい\nいあいおあいおいおあおいあ"
    }
  ]
);

var memosView = new MemosView( {collection: memos} );

$("#js-memos-render").html(memosView.render().el);



})();