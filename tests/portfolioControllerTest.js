describe('PortfolioController', function () {
  var $scope, $rootScope, createController, DashboardFactory, $httpBackend;

  var $controllerConstructor;
  var scope;
  var mockLeaguesData;

  // loads the app into the test
  beforeEach(module('app'));
  beforeEach(inject(function($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
    Portfolio = $injector.get('Portfolio');
    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    createController = function () {
      return $controller('PortfolioController', {
        $scope: $scope,
        Portfolio: Portfolio
      });
    };
  }));

  it('should have a fees property on the $scope set to 10', function () {
    createController();
    expect($scope.fees).toBe(10);
  });

  it('should have a function called resetFields which clears the stock, stockAmount, stockInput, and estPrice $scope properties', function () {
    createController();
    $scope.resetFields();
    expect($scope.stock).toBe(undefined);
    expect($scope.stockAmount).toBe('');
    expect($scope.stockInput).toBe('');
    expect($scope.estPrice).toBe('');

  });

});
