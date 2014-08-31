Parse.initialize "LpYXlaJTI2HXEu2vLj2Gghd2nQH9SUqtEP7nCDVf", "agaBXn8iCD6167GXFO0iUlte916sxIidiRxtACeD"

Memos = Parse.Object.extend "Memos"
Memo = Parse.Object.extend "Memo"
memos = new Memos()
memo = new Memo()

query = new Parse.Query(Memos);

arr = []

memo.set("foo": "memomemo")
arr.push(memo)
arr.push(memo)
arr.push(memo)
memos.set("content", arr)

btn = document.querySelector "#btn"
btn.addEventListener "click", (e) ->
  # memo.save( foo: "memomemo").then (obj) ->
  #   console.log obj
  # memos.save()
  query.get("qdDL0kOjOr", 
    success: (memo) ->
      console.log memo
    error: (obj, err) ->
      console.log obj
  )
  
