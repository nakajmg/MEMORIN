(function(){

var Memo = Backbone.Model.extend({
  defaults: function(){
    return {
      content: "",
      color: _.random(1,10),
      tags: [],
      important: false
    }
  },
  validate: function(attrs){
    if(_.isEmpty(attrs.content)){
      return "content must not be empty";
    }
  },
  toggleImportant: function(){
    this.set("important", !this.get("important"));
  },
  toggleTag: function(tagname){
    console.log("toggletag:",tagname);
    var tags = _(this.get("tags")).clone();
    /* _.without */
    if(_.contains(tags, tagname)){
      tags = _.filter(tags, function(tag){
        return tag != tagname;
      });
    }else{
      tags.push(tagname);
    }
    this.set("tags", tags);
    console.log("tags",tags);
  }
});

var MemoView = Backbone.View.extend({
  tagName: "div",
  className: "memo",
  template: _.template($("#template-memo").html()),
  initialize: function(){
    this.isCmd = false;
    this.model.on("change", this.change,this);
    this.model.on("destroy", this.destroy,this);
  },
  events: {
    "keydown .memo__content": "onUpdate",
    "keyup .memo__content": "checkCmdKey",
    "blur .memo__content": "onBlur",
    "click .memo__remove": "removeMemo",
    "click .memo__flip": "flipMemo",
    "click .memo__backface__important": "toggleImportant",
    "click .js-toggle-tag": "toggleTag"
  },
  toggleTag: function(ev){
    var name = $(ev.target).attr("name");
    this.model.toggleTag(name);
  },
  toggleImportant: function(){
    console.log(this);
    this.model.toggleImportant();
  },
  change: function(){
    console.log("MemoView:changememo");
  },
  destroy: function(){
    // console.log(this.$el);
    // this.model.$
    this.$el.remove();
  },
  onUpdate: function(e){
    if(e.which === 91 || e.which === 93){
      this.isCmd = true;
    }
    if(this.isCmd && e.which === 13){
      this.isCmd = false;
      console.log("call save");
      this.doSave();
    }
  },
  onBlur: function(){
    var $el = this.$el.find(".memo__content");
    $el.attr("contenteditable","false");
    setTimeout(function(){
      $el.attr("contenteditable","true");
    },0);
    this.setContent();
  },
  checkCmdKey: function(e){
    if(e.which === 91 || e.which === 93){
      this.isCmd = false;
    }
  },
  doSave: function(){
    this.$el.find(".memo__content").blur();
  },
  setContent: function(){

    this.model.set("content",this.$el.find(".memo__content").html());
  },
  removeMemo: function(){
    this.model.destroy();
  },
  flipMemo: function(){
    this.$el.toggleClass('flip');
  },
  render: function(){
    var model= this.model;
    // var template;
    // template = this.model.get("content");
    var template = this.template(this.model.toJSON());
    this.$el.html(template);
    return this;
  }
});
var MemoList = Backbone.Collection.extend({
  model: Memo
});

var MemoListView = Backbone.View.extend({
  tagName: "section",
  className: "memo-list",
  initialize: function(){
    this.collection.on("change",this.onChange,this);
    this.collection.on("add",this.onAdd,this);
    this.collection.on("remove",this.onUpdate,this);
    this.collection.on("update",this.onUpdate,this);
  },
  onUpdate: function(){
    this.saveLocalStorage();
  },
  onChange: function(){
    console.log("MemolistView:onchange");
    this.saveLocalStorage();
  },
  saveLocalStorage: function(){
    var json = JSON.stringify( this.collection.toJSON());
    localStorage.setItem("memorin",json);
    console.log("save:localStorage");
  },
  onAdd: function(memo){
    this.saveLocalStorage();
    var memoView = new MemoView({model:memo});
    this.$el.prepend(memoView.render().el);
  },
  render: function(){
    this.collection.each(function(memo){
      var memoView = new MemoView({model:memo});
      this.$el.prepend(memoView.render().el);
    },this);
    return this;
  },
  renderImportant: function(){
    var important = this.collection.where({"important":true});
    _.each(important,function(memo){
        var memoView = new MemoView({model:memo});
        this.$el.prepend(memoView.render().el);
    },this);
    return this;
  },
  renderTag: function(tag){
    this.collection.each(function(memo){
      var tags = memo.get("tags");
      if(_.contains(tags,tag)){
        var memoView = new MemoView({model:memo});
        this.$el.prepend(memoView.render().el);
      }
    },this);
    return this;
  }
})

var memoList = new MemoList(JSON.parse(localStorage.getItem("memorin")));

// var memoList = new MemoList(
//   [
//     {
//       content:"めも1",
//       tags:["other"]
//     },
//     {
//       content:"めも2",
//       important: true,
//       tags:["todo"]
//     },
//     {
//       content:"めも3",
//       tags:["other","todo",]
//     },
//     {
//       content:"めも4",
//       important: true
//     },
//   ]
// );

var AppView = Backbone.View.extend({
  el: "#main",
  initialize: function(){
    var self = this;
    this.$render = this.$el.find("#render");
    this.showAllMemo();

    this.$el.find(".show-tag").on("click",function(){
      self.showTagMemo($(this).val());
    });
  },
  events:{
    "click #show-all":"showAllMemo",
    "click #show-important":"showImportantMemo"
  },
  showAllMemo: function(){
    var memoListView = new MemoListView({collection: this.collection});
    this.$render.html(memoListView.render().el);
    console.log("show all memo");
  },
  showImportantMemo: function(){
    var memoListView = new MemoListView({collection: this.collection});
    this.$render.html(memoListView.renderImportant().el);
    console.log("show important memo");
  },
  showTagMemo: function(tag){
    var memoListView = new MemoListView({collection: this.collection});
    this.$render.html(memoListView.renderTag(tag).el);
    console.log("show tag memo");
  }
});

var AddMemoView = Backbone.View.extend({
  el: "#editor",
  events: {
    "submit": "onSubmit"
  },
  COLOR_COUNT: 18,
  initialize: function(){
    var color = _.random(1,this.COLOR_COUNT)
    $("#textarea").addClass("color"+color).attr("data-color",color);
  },
  onSubmit: function(e){
    e.preventDefault();
    var content = $("#textarea").html();
    var color = $("#textarea").attr("data-color");

    if(_.isEmpty(content)){
      return false;
    }else{
      var memo = new Memo;
      var tags = [];
      if($("#todo").prop("checked")){
        tags.push($("#todo").attr("id"));
      }
      if($("#other").prop("checked")){
        tags.push($("#other").attr("id"));
      }
      var important = $("#important").prop("checked");
      memo.set({"content":content, "important": important, "tags": tags, "color": color},{validate:true});
      this.collection.add(memo);
      this.resetEditor();
    }
  },
  resetEditor: function(){
    var color = _.random(1,this.COLOR_COUNT);
    var before_color = $("#textarea").attr("data-color");
    $("#textarea").html("").removeClass("color"+before_color).addClass("color"+color);
    $("#todo").prop("checked","");
    $("#other").prop("checked","");
    $("#important").prop("checked","");
  }
});

var appView = new AppView({collection: memoList});
var addMemoView = new AddMemoView({collection:memoList});
})();