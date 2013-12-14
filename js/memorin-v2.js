(function(){

var COLOR_COUNT = 18;

var Memo = Backbone.Model.extend({
  defaults: {
    color: (( (Math.random() * COLOR_COUNT) +1 )|0 ),
    category: ["memo"],
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