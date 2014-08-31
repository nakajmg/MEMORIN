(function() {
  var Memo, Memos, arr, btn, memo, memos, query;

  Parse.initialize("LpYXlaJTI2HXEu2vLj2Gghd2nQH9SUqtEP7nCDVf", "agaBXn8iCD6167GXFO0iUlte916sxIidiRxtACeD");

  Memos = Parse.Object.extend("Memos");

  Memo = Parse.Object.extend("Memo");

  memos = new Memos();

  memo = new Memo();

  query = new Parse.Query(Memos);

  arr = [];

  memo.set({
    "foo": "memomemo"
  });

  arr.push(memo);

  arr.push(memo);

  arr.push(memo);

  memos.set("content", arr);

  btn = document.querySelector("#btn");

  btn.addEventListener("click", function(e) {
    return query.get("qdDL0kOjOr", {
      success: function(memo) {
        return console.log(memo);
      },
      error: function(obj, err) {
        return console.log(obj);
      }
    });
  });

}).call(this);
