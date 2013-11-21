angular.module('dreamnetwork')
.directive("clickToEditTextField", function() {
    var editorTemplate = '<div class="click-to-edit-text-field">' +
        '<div ng-hide="view.editorEnabled">' +
            '{{value}} ' +
            '<a ng-show="editable" ng-click="enableEditor()"><img class="svg pencil-edit" src="images/edit-pencil.svg" width="10" height="10" /></a>' +
        '</div>' +
        '<div ng-show="view.editorEnabled">' +
            '<input type="text" ng-model="view.editableValue">' +
            '<button class="btn btn-default save-button" ng-click="save()">Save</a>' +
            '<button class="btn btn-default cancel-button" ng-click="disableEditor()">Cancel</a>' +
        '</div>' +
    '</div>';

    return {
        restrict: "A",
        replace: true,
        template: editorTemplate,
        scope: {
            value: "=clickToEditTextField",
            editable: "=fieldEditable"
        },
        controller: function($scope) {
            $scope.view = {
                editableValue: $scope.value,
                editorEnabled: false
            };

            $scope.enableEditor = function() {
                $scope.view.editorEnabled = true;
                $scope.view.editableValue = $scope.value;
            };

            $scope.disableEditor = function() {
                $scope.view.editorEnabled = false;
            };

            $scope.save = function() {
                $scope.value = $scope.view.editableValue;
                $scope.disableEditor();
            };
        }
    };
})
.directive("clickToEditTextArea", function() {
    var editorTemplate = '<div class="click-to-edit-text-area">' +
        '<div ng-hide="view.editorEnabled">' +
            '{{value}} ' +
            '<button class="btn btn-default" ng-show="editable" ng-click="enableEditor()">Edit</a>' +
        '</div>' +
        '<div ng-show="view.editorEnabled">' +
            '<textarea rows="3" ng-model="view.editableValue"></textarea>' +
            '<button class="btn btn-default" ng-click="save()">Save</a>' +
            '<button class="btn btn-default" ng-click="disableEditor()">Cancel</a>' +
        '</div>' +
    '</div>';

    return {
        restrict: "A",
        replace: true,
        template: editorTemplate,
        scope: {
            value: "=clickToEditTextArea",
            editable: "=fieldEditable"
        },
        controller: function($scope) {
            $scope.view = {
                editableValue: $scope.value,
                editorEnabled: false
            };

            $scope.enableEditor = function() {
                $scope.view.editorEnabled = true;
                $scope.view.editableValue = $scope.value;
            };

            $scope.disableEditor = function() {
                $scope.view.editorEnabled = false;
            };

            $scope.save = function() {
                $scope.value = $scope.view.editableValue;
                $scope.disableEditor();
            };
        }
    };
});
