import UiGrid from '../common/uiGrid';

function gridController($scope, $element, $attrs, $timeout, uiGridConstants,
  $http, oauthDataFactory) {
  var vm = this;
  var filterDefaultObject = angular.copy($scope.ciFilterDefault);
  if ($scope.ciQueryId) {
    filterDefaultObject.QueryId = $scope.ciQueryId;
  }
  

  $scope.data = [];  
  var uiGrid = new UiGrid($scope, $timeout, uiGridConstants, $http, oauthDataFactory, 'data', 
  null, filterDefaultObject);
  vm.gridOptions = uiGrid.gridOptions;
  vm.uiGrid = uiGrid;

  vm.refresh = function () {
    vm.uiGrid.init();
  }
  
  if ($scope.ciRole) {
    vm.role = $scope.ciRole;
  }
  
  vm.scopeGridChirent = {};
  vm.setItemScope = function (s, queryId) {
    vm.scopeGridChirent[queryId] = s;
  };
  vm.getItemSccope = function (queryId) { 
    return vm.scopeGridChirent[queryId];
  }

  vm.create = function (id, type) {    
    var scope = vm.getItemSccope(id);    
    if ($scope.ciGridCommand && $scope.ciGridCommand.create) {
      var refresh = null;
      if (scope && scope.gridExpand) {
        refresh = scope.gridExpand.refresh;
      }
      if (scope && scope.grid) {
        refresh = scope.grid.refresh;
      }
      if (refresh === null) {
        $scope.ciGridCommand.create(id, type);
      } else {
        $scope.ciGridCommand.create(id, type, refresh);
      }
    }
  }

  vm.update = function (row, type) {
    if ($scope.ciGridCommand && $scope.ciGridCommand.update) {
      $scope.ciGridCommand.update(row, type, vm.refresh);
    }
  }

  vm.delete = function (row, type) {
    if ($scope.ciGridCommand && $scope.ciGridCommand.delete) {
      $scope.ciGridCommand.delete(row, type, vm.refresh);
    }
  }

  //----------------------Filter-------------------------------
  if ($scope.watchFilter) {
    $scope.watchFilter();
  }
  $scope.watchFilter = $scope.$watch('ciFilter', function (nval, oval) {
    if (nval !== oval) {
      vm.uiGrid.gridOptions.enableFiltering = nval;
      vm.uiGrid.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    }
  });

  //----------------------init-----------------
  function resize() {
    if (angular.isUndefined($scope.ciHeight) || $scope.ciHeight !== '') {     
      $timeout(function () {      
        var heightPx = $('.auto-of-content .box-body').css('min-height');
        var height = parseInt(heightPx.replace('px', '')) - 25;
        $('#' + $scope.ciId).css('height', height);
        vm.uiGrid.gridApi.core.handleWindowResize();
      });
    }    
  }

  function init() {
    if ($scope.ciSetScope) {
      $scope.ciSetScope($scope, $scope.ciQueryId);
    }    
    $(window, '.content-wrapper').bind('resize', function () {
      resize();
    });
    $timeout(function () {
      $.AdminLTE.callbackPushMenu = function () {
        
        $timeout(function () {
          vm.uiGrid.gridApi.core.handleWindowResize();
        }, 520)
      }
      vm.uiGrid.init();      
    })
    resize();    
  }
  init();
}

/* @ngInject */
export default gridController;
