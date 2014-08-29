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
    var EVENT_ANIMATION_END = "webkitAnimationEnd";
    // console.log(this.$el);
    // this.model.$
    var $target = this.$el;
    var self = this;
    $target.one(EVENT_ANIMATION_END,function(){
      self.$el.remove();
    }).addClass("anime-memo-remove");
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
    console.log("削除アニメ開始地点");
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
    localStorage.setItem(storageKey,json);
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


// localStorageのに内容があるかチェック.重複をさけるため.nowをkeyに足して保存
if(_.isEmpty(localStorage.getItem("memorin"))){
  var now = Date.now()+"";
  localStorage.setItem("memorin",now);
}

var storageKey = "memorin-"+localStorage.getItem("memorin");

var memoList = new MemoList(JSON.parse(localStorage.getItem(storageKey)));


var AppView = Backbone.View.extend({
  el: "#main",
  initialize: function(){
    var self = this;
    var EVENT_USER_BUTTON_ON  = "touchstart mousedown";
    var EVENT_USER_BUTTON_OFF = "touchend touchemove mousemove mouseup";

    this.$render = this.$el.find("#render");
    this.showAllMemo();

    this.$el.find(".show-tag").on("click",function(){
      self.showTagMemo($(this).val());
    });

    $(document).on( EVENT_USER_BUTTON_ON,'.js-button',function(){ $(this).addClass('button--on'); });
    $(document).on( EVENT_USER_BUTTON_OFF,'.js-button',function(){ $(this).removeClass('button--on'); });

    $("#js-toggle-editor").on("click",function(){
      var $this = $(this);
      if($this.hasClass("anime-plus-btn")){
        $this.removeClass("anime-plus-btn");
        $("#editor").slideUp(500);
      }else{
        $this.addClass("anime-plus-btn");
        $("#editor").slideDown(500);
      }

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
  isCmd: false,
  events: {
    "submit": "onSubmit",
    "keydown .memo__editor": "onKeydown",
    "keyup .memo__editor": "onKeyup"
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
      var self = this;
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

      this.keyframesAnimationHelper($("#textarea"), "anime-memo-add").then(function(){
        console.log("animation end");
        $("#textarea").css("visibility","hidden");
        $("#textarea").removeClass("anime-memo-add");

        resetEditor();
        setTimeout(function(){
          $("#textarea").css("visibility","visible");
          self.collection.add(memo);
        },100);

      });
      function resetEditor(){
        self.resetEditor();
      }
    }
  },
  onKeydown: function(e){
    console.log("keydown");
    if(e.which === 91 || e.which === 93){
      this.isCmd = true;
    }
    if(this.isCmd && e.which === 13){
      this.isCmd = false;
      this.onSubmit(e);
      $(e.target).blur();
    }
  },
  onKeyup: function(e){
    if(e.which === 91 || e.which === 93){
      this.isCmd = false;
    }
  },
  resetEditor: function(){
    var color = _.random(1,this.COLOR_COUNT);
    var before_color = $("#textarea").attr("data-color");
    $("#textarea").attr("data-color",color);
    $("#textarea").html("").removeClass("color"+before_color).addClass("color"+color);
    $("#todo").prop("checked","");
    $("#other").prop("checked","");
    $("#important").prop("checked","");
  },
  keyframesAnimationHelper: function($target, animation_class_name, opt_isRemoveClass){
    var def = $.Deferred();
    var EVENT_ANIMATION_END = "webkitAnimationEnd";

    $target.one(EVENT_ANIMATION_END, function(){
      if(opt_isRemoveClass){
        $target.removeClass(animation_class_name);
      }
      def.resolve($target);
    }).addClass(animation_class_name);

    return def.promise();
  }
});

var appView = new AppView({collection: memoList});
var addMemoView = new AddMemoView({collection:memoList});
})();