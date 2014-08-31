(function() {
  var appData, memoView;

  appData = {};

  appData.memos = {
    data: [
      {
        memo: {
          content: "memo1"
        }
      }, {
        memo: {
          content: "memo2"
        }
      }, {
        memo: {
          content: "memo3"
        }
      }, {
        memo: {
          content: "memo4"
        }
      }, {
        memo: {
          content: "memo5"
        }
      }
    ]
  };

  Vue.component("m-memoList", {
    className: "m-memos__list",
    methods: {
      addItem: function(item) {
        return this.data.push({
          memo: {
            content: "test"
          }
        });
      },
      removeItem: function(index) {
        return this.data.$remove(index, 1);
      },
      updateItem: function(data) {
        return console.log(data.content);
      }
    },
    ready: function() {
      this.$on("remove:memoItem", this.removeItem);
      return this.$on("update:memoItem", this.updateItem);
    },
    components: {
      "m-memoItem": {
        className: "m-memos__item",
        methods: {
          remove: function() {
            return this.$parent.$emit("remove:memoItem", this.$index);
          },
          update: function() {
            var content, index;
            content = this.memo.content;
            index = this.$index;
            return this.$parent.$emit("update:memoItem", {
              content: content,
              index: index
            });
          }
        }
      }
    }
  });

  memoView = new Vue({
    el: "#m-app",
    data: appData,
    methods: {
      test: function() {}
    },
    ready: function() {}
  });

}).call(this);
