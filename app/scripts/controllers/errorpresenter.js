'use strict';

PhonicsApp.controller('ErrorPresenterCtrl', function ErrorPresenterCtrl($scope,
  $rootScope, Editor) {
  var ERROR_LEVEL = 900;
  var WARNING_LEVEL = 500;

  $scope.docsMode = false;

  // Collapse by default in preview mode
  $scope.isCollapsed = $rootScope.isPreviewMode;

  $scope.getErrors = function () {
    var errors = $scope.$parent.errors;
    var warnings = $scope.$parent.warnings;

    // Don't show empty doc error in editor mode
    if (Array.isArray(errors) && errors[0].emptyDocsError) {
      return null;
    }

    if (Array.isArray(errors)) {
      errors = errors.map(function (error) {
        error.level = ERROR_LEVEL;
        return error;
      });
    }

    if (Array.isArray(warnings)) {
      warnings = warnings.map(function (warning) {
        warning.level = WARNING_LEVEL;
        return warning;
      });
      return errors.concat(warnings);
    }

    return errors;
  };

  $scope.getType = function (error) {
    if (error.code && error.message && error.path) {
      if (error.level > 500) {
        return 'Swagger Error';
      }
      return 'Swagger Warning';
    }

    if (error.yamlError) {
      return 'YAML Syntax Error';
    }

    if (error.emptyDocsError) {
      return 'Empty Document Error';
    }

    return 'Unknown Error';
  };

  $scope.getDescription = function (error) {

    if (angular.isString(error.message)) {
      return error.message;
    }

    if (error.emptyDocsError) {
      return error.emptyDocsError.message;
    }

    if (error.yamlError) {
      return error.yamlError.message.replace('JS-YAML: ', '').replace(/./,
        function (a) {
          return a.toUpperCase();
        });
    }

    if (error.resolveError) {
      return error.resolveError;
    }

    return error;
  };

  $scope.goToLineOfError = function (error) {

    if (error && error.yamlError) {
      Editor.gotoLine(error.yamlError.mark.line);
    }
  };

  $scope.showLineJumpLink = function (error) {
    return error && error.yamlError;
  };

  $scope.getLineNumber = function (error) {
    return error.yamlError.mark.line;
  };

  $scope.isWarning = function (error) {
    return error.level < ERROR_LEVEL;
  };

  $scope.toggleCollapse = function () {
    $scope.isCollapsed = !$scope.isCollapsed;
  };
});
