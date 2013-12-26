// module for ng-app
var app = angular.module("memorin",["ngSanitize"]);

app.controller("editorCtrl",["$scope","$sanitize","$filter","$sce",
  function($scope,$sanitize,$filter,$sce){

    $scope.items = [
      {"content":"test1<br>1111"},
      {"content":"test2<br>2222"},
      {"content":"aaa<br>aa<br>aaa"},
      {"content":"test4"}
    ];

    // $scope.items = angular.fromJson(localStorage.getItem("items"));


    // $scope.htmlFilter = function(text){
    //   // console.log(text);
    //   text = text.replace(/\<br\>/g,"\n");
    //   var linky_text = $filter("linky")(text,"_blank");
    //   // ここでエスケープされたHTMLタグを戻したい
    //   var html = linky_text.replace(/&lt;/g,"<").replace(/&gt;/g, ">").replace(/&#10;/g,"<br>").replace(/&amp;nbsp;/g," ");

    //   return html;
    // }

    $scope.onSubmit = function(){
      var text = $scope.testmodel;
      text = text.replace(/\<br\>/g,"\n");
      var linky_text = $filter("linky")(text,"_blank");
      var html = linky_text.replace(/&lt;/g,"<").replace(/&gt;/g, ">").replace(/&#10;/g,"<br>").replace(/&amp;nbsp;/g," ");

      var item = {"content":html};
      $scope.items.push(item);
      localStorage.setItem("items",angular.toJson($scope.items));
    }
}]);

app.directive("memorinEditor", function(){
  return {
    restrict: "A",
    require: "?ngModel",
    // template: "<strong>this is directive test</strong>"
    link: function(scope, element, attrs, ngModel){
      ngModel.$render = function(){
        element.html(ngModel.$viewValue || "");
      };
      // console.log(ngModel);
      element.on("blur keyup change",function(){
        scope.$apply(read);
      });
      read();
      function read(){
        var html = element.html();
        ngModel.$setViewValue(html);
      }

    }
  }
});

// angular.module('customControl', []).
//   directive('contenteditable', function() {
//     return {
//       restrict: 'A', // only activate on element attribute
//       require: '?ngModel', // get a hold of NgModelController
//       link: function(scope, element, attrs, ngModel) {
//         if(!ngModel) return; // do nothing if no ng-model

//         // Specify how UI should be updated
//         ngModel.$render = function() {
//           element.html(ngModel.$viewValue || '');
//         };

//         // Listen for change events to enable binding
//         element.on('blur keyup change', function() {
//           scope.$apply(read);
//         });
//         read(); // initialize

//         // Write data to the model
//         function read() {
//           var html = element.html();
//           // When we clear the content editable the browser leaves a <br> behind
//           // If strip-br attribute is provided then we strip this out
//           if( attrs.stripBr && html == '<br>' ) {
//             html = '';
//           }
//           ngModel.$setViewValue(html);
//         }
//       }
//     };
//   });