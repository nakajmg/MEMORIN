appData = {}
appData.memos =
  data: [
    {memo: content: "memo1"}
    {memo: content: "memo2"}
    {memo: content: "memo3"}
    {memo: content: "memo4"}
    {memo: content: "memo5"}
  ]


Vue.component "m-memoList",
  className: "m-memos__list"
  methods:
    addItem: (item) ->
      @data.push(memo: content: "test")
    removeItem: (index) ->
      @data.$remove(index,1)
    updateItem: (data) ->
      console.log data.content
  ready: ->
    @$on("remove:memoItem", @removeItem)
    @$on("update:memoItem", @updateItem)
    
  components:
    "m-memoItem":
      className: "m-memos__item"
      methods:
        remove: ->
          @$parent.$emit("remove:memoItem", @$index)
        update: ->
          content = @memo.content
          index = @$index
          @$parent.$emit("update:memoItem", {content, index})

memoView = new Vue
  el: "#m-app"
  data: appData
  methods:
    test: ->
  ready: ->
    
    
        
