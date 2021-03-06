(function(){
  var app = angular.module('VASapp', ['ngRoute']);

  // configure routes with routeProvider
  // locationProvider needed to remove the /#/ from the url
  app.config(['$routeProvider', '$locationProvider',function($routeProvider, $locationProvider){
    $locationProvider.html5Mode(true);
    $routeProvider
      .when('/states',{
        templateUrl: '/static/partials/states.html',
        controller: 'statesController',
        controllerAs: 'states'
      }).when('/cities', {
        templateUrl: '/static/partials/cities.html',
        controller: 'citiesController',
        controllerAs: 'cities',
      }).when('/neighborhoods', {
        templateUrl: '/static/partials/neighborhoods.html',
        controller: 'neighborhoodsController',
        controllerAs: 'neighborhoods'
      }).when('/about', {
        templateUrl: '/static/partials/about.html',
        controller: 'aboutController',
        controllerAs: 'about'
      }).when('/search', {
        templateUrl: '/static/partials/search.html',
        controller: 'searchController',
        controllerAs: 'search'
      }).when('/states/:stateCode', {
        templateUrl: '/static/partials/state_model.html',
        controller: 'stateModelController',
        controllerAs: 'state'
      }).when('/cities/:cityId', {
        templateUrl: '/static/partials/city_model.html',
        controller: 'cityModelController',
        controllerAs: 'city'
      }).when('/neighborhoods/:neighborhoodId', {
        templateUrl: '/static/partials/neighborhood_model.html',
        controller: 'neighborhoodModelController',
        controllerAs: 'neighborhood'
      }).when('/home', {
        redirectTo: '/'
      }).when('/', {
        templateUrl: '/static/partials/splash.html',
        controller: 'splashController',
        controllerAs: 'splash'
      }).when('/seriesz', {
        templateUrl: '/static/partials/series_z_cities.html',
        controller: 'serieszController',
        controllerAs: 'seriesz'
      }).when('/seriesz/:class/:id', {
        templateUrl: '/static/partials/serieszsingle.html',
        controller: 'serieszSingleController',
        controllerAs: 'seriesz'
      }).
      otherwise({
        redirectTo: '/'
      });
    // $httpProvider.defaults.useXDomain = true;

  }]);

  app.controller('serieszSingleController', ['$scope', '$routeParams','dataGetService', function($scope, $routeParams, dataGetService){
    $scope.data = null;
    $scope.keys = null;
    $scope.class = $routeParams["class"];
    console.log($routeParams);
    var cleanData = function(obj) {
      for (var i in obj) {
        if (!isNaN(obj[i])) {
          obj[i] = Number(obj[i]);
        };
      };
      $scope.keys = Object.keys(obj);
    };
    var init = function(){
      dataGetService.call('/api/seriesz/' + $routeParams["class"] + '/' + $routeParams["id"]).then(function(data){$scope.data = data; cleanData($scope.data)}, function(data){$scope.data = data});
    };
    init();
  }]);

  app.controller('serieszController', ['$scope','dataGetService', function($scope, dataGetService){
    $scope.cities = null;
    $scope.startups = null;
    $scope.founders = null;

    this.printData = function(){
      console.log(this.data);
    };

    var cleanData = function(objArray) {
      for (var i in objArray) {
        for (var prop in objArray[i]){
          if (!isNaN(objArray[i][prop])) {
            objArray[i][prop] = Number(objArray[i][prop]);
          };
        };
      };
    };

    this.data = null;

    this.call = function(url) {dataGetService.call(url).then(function(data){this.data = data}, function(data){this.data = data});};

    var init = function() {
      dataGetService.call('/api/seriesz/cities_good').then(function(data){$scope.cities = data; cleanData($scope.cities)}, function(data){$scope.cities = data});
      dataGetService.call('/api/seriesz/startups_good').then(function(data){$scope.startups = data; cleanData($scope.startups)}, function(data){$scope.startups = data});
      dataGetService.call('/api/seriesz/founders_good').then(function(data){$scope.founders = data; cleanData($scope.founders)}, function(data){$scope.founders = data});
    };
    init();
  }]);

  app.controller('serieszController', ['$scope','dataGetService', function($scope, dataGetService){
    $scope.cities = null;
    $scope.startups = null;
    $scope.founders = null;

    this.printData = function(){
      console.log(this.data);
    };

    var cleanData = function(objArray) {
      for (var i in objArray) {
        for (var prop in objArray[i]){
          if (!isNaN(objArray[i][prop])) {
            objArray[i][prop] = Number(objArray[i][prop]);
          };
        };
      };
    };

    this.data = null;

    this.call = function(url) {dataGetService.call(url).then(function(data){this.data = data}, function(data){this.data = data});};

    var init = function() {
      dataGetService.call('/api/seriesz/cities_good').then(function(data){$scope.cities = data; cleanData($scope.cities)}, function(data){$scope.cities = data});
      dataGetService.call('/api/seriesz/startups_good').then(function(data){$scope.startups = data; cleanData($scope.startups)}, function(data){$scope.startups = data});
      dataGetService.call('/api/seriesz/founders_good').then(function(data){$scope.founders = data; cleanData($scope.founders)}, function(data){$scope.founders = data});
    };
    init();
  }]);

  app.controller('tableController', ['$scope', function($scope){
    $scope.sort = {
      by: 'name',
      descending: false
    };
    //used to update/set sort values
    this.sortBy = function(col) {
      if ($scope.sort['by'] === col) {
        $scope.sort['descending'] = !$scope.sort['descending'];
      } else {
        $scope.sort['by'] = col;
        $scope.sort['descending'] = false;
      };
    };
    //used by ng-show, for chevron on column
    this.sortedBy = function(col) {
      return $scope.sort['by'] === col;
    };
    //used by ng-class, for chevron direction
    this.isDescending = function() {
      return $scope.sort['descending'];
    };
  }]);

  app.service('dataGetService', ['$q','$http', '$location', '$sce', function($q,$http,$location,$sce){
    // var baseUrl = 'http://192.168.99.100';
    this.data = {};
    this.call = function(url){
      var deferred = $q.defer();
      console.log("calling API at: " + url);
      $http.get(url).then(
        //success
        function(response){
          console.log(response);
          console.log(response.data);
          this.data = response.data;
          deferred.resolve(response.data);
        }
        , //failure
        function(response){
          console.log("api call failed on: " + jsonUrl);
          console.log(response);
          deferred.reject("api call failed on: " + jsonUrl);
        }
      );
      return deferred.promise;
    };
  }]);

  //just for printing the maps, and for initializing the idMappingService.
  app.controller('mainController',['$scope', 'idMappingService', function($scope,idMappingService){
    this.printMappings = function(){console.log($scope.stateIdToName);console.log($scope.cityIdToName);console.log($scope.neighborhoodIdToName);};
  }]);

  app.controller('navController',['$scope', '$location', function($scope, $location){
    //for highlighting; key == path, value == display
    this.navLinks = {'about':"About", 'states':"States", 'cities':"Cities", 'neighborhoods':"Neighborhoods"}
  }]);

  app.controller('splashController',['$scope', function($scope){
    this.searchUrl = '/search?q=';
    $scope.searchValue = '';
    this.makeSearchUrl = function(){
      this.searchUrl = '/search?q=' + $scope.searchValue;
      console.log(this.searchUrl);
    };
  }]);

  app.controller('searchController', ['$scope', '$routeParams', 'searchService', function($scope, $routeParams, searchService) {

    $scope.searchResults = {};
    $scope.searchQuery = $routeParams['q'];

    var buildData = function(data) {
      $scope.searchResults = {};
      var re = /\W+/;
      var queryValues = $routeParams['q'].split(re);
      // var queryValues = ['Akin', 'Austin', 'Texas'];
      console.log(queryValues);
      if (queryValues.length > 0) {
        $scope.searchResults['or'] = [];
      };
      if (queryValues.length > 1) {
        $scope.searchResults['and'] = [];
      };
      var neighborhoodsFoundOr = {};
      var citiesFoundOr = {};
      var statesFoundOr = {};
      var neighborhoodsFoundAnd = {};
      var citiesFoundAnd = {};
      var statesFoundAnd = {};
      for(var key in data) {
        var currentRow = data[key];
        // var newRow = {};
        var cityName = '';
        if (currentRow['city_id'] !== undefined && $scope.cityIdToName[currentRow['city_id']] != undefined) {
          cityName = $scope.cityIdToName[currentRow['city_id']];
        };
        var stateName = $scope.stateIdToName[currentRow['state_code']];
        var neighborhoodName = currentRow['neighborhood_name'];
        if (queryValues.length > 0) {
          for(var q in queryValues) {
            if (neighborhoodName.toLowerCase().includes(queryValues[q].toLowerCase()) && !neighborhoodsFoundOr.hasOwnProperty(currentRow['neighborhood_id'])){
              neighborhoodsFoundOr[currentRow['neighborhood_id']] = true;
              // console.log("found neighborhood match: ");
              // console.log(currentRow);
              var newRow = {};
              newRow['id'] = currentRow['neighborhood_id'];
              newRow['name'] = neighborhoodName + ', ' + cityName + ', ' + stateName;
              newRow['type'] = 'neighborhoods';
              $scope.searchResults['or'].push(newRow);
            };
            if (cityName.toLowerCase().includes(queryValues[q].toLowerCase()) && !citiesFoundOr.hasOwnProperty(currentRow['city_id'])){
              // console.log("found city match: ");
              // console.log(currentRow);
              citiesFoundOr[currentRow['city_id']] = true;
              var newRow = {};
              newRow['id'] = currentRow['city_id'];
              newRow['name'] = cityName + ', ' + stateName;
              newRow['type'] = 'cities';
              $scope.searchResults['or'].push(newRow);
            };
            if (stateName.toLowerCase().includes(queryValues[q].toLowerCase()) && !statesFoundOr.hasOwnProperty(currentRow['state_code'])){
              // console.log("found state match: ");
              // console.log(currentRow);
              statesFoundOr[currentRow['state_code']] = true;
              var newRow = {};
              newRow['id'] = currentRow['state_code'];
              newRow['name'] = stateName;
              newRow['type'] = 'states';
              $scope.searchResults['or'].push(newRow);
            };
          };
        };
      };
      if (queryValues.length > 1) {
        for (var key in $scope.searchResults['or']) {
          var match = true;
          for (var q in queryValues) {
            if(match && !$scope.searchResults['or'][key]['name'].toLowerCase().includes(queryValues[q].toLowerCase())) {
              match = false;
            };
          };
          if(match) {
            $scope.searchResults['and'].push($scope.searchResults['or'][key]);
          };
        };
      };
      console.log($scope.searchResults);
    };

    $scope.sort = {
      by: 'name',
      descending: false
    };
    //used to update/set sort values
    this.sortBy = function(col) {
      if ($scope.sort['by'] === col) {
        $scope.sort['descending'] = !$scope.sort['descending'];
      } else {
        $scope.sort['by'] = col;
        $scope.sort['descending'] = false;
      };
    };
    //used by ng-show, for chevron on column
    this.sortedBy = function(col) {
      return $scope.sort['by'] === col;
    };
    //used by ng-class, for chevron direction
    this.isDescending = function() {
      return $scope.sort['descending'];
    };
    this.showTable = function(tableType) {
      console.log('Checking if show');
      return $scope.searchResults.hasOwnProperty(tableType) && $scope.searchResults[tableType].length > 0;
    };

    var init = function() {
      console.log($routeParams);
      searchService.callAPI().then(function(data){buildData(data);}, function(data) {alert(data)});
    };
    init();

  }]);

  app.service('searchService', ['$q', '$http', '$location', '$sce', '$routeParams', function($q, $http, $location, $sce, $routeParams) {

    // var baseUrl = 'http://192.168.99.100';
    var baseUrl = '';
    var api = '/api/neighborhoods';

    var temp = '/json_data/neighborhoods.json';

    var url = '';
    var makeJsonUrl = function() {
      url = baseUrl + api;
      // url=temp;
      return url;
    };

    this.data = {};

    //call neighborhoods json
    this.callAPI = function() {
      makeJsonUrl();
      console.log("making API call at: " + url);
      var deferred = $q.defer();
      $http.get(url).then (
        function(response) {
          this.data = response.data;
          deferred.resolve(response.data);
        },
        function(response) {
          console.log(response);
          deferred.reject("api call failed");
        }
      );
      return deferred.promise;
    };
  }]);

  app.controller('aboutController',['$scope', '$q', '$http', function($scope, $q, $http){
    $scope.testsCalled = false;
    $scope.testsResults = '';
    var url = "/tests";
    var callTests = function() {
      console.log("making API call at: " + url);
      var deferred = $q.defer();
      $http.get(url).then (
        function(response) {
          console.log(response);
          this.data = response.data;
          deferred.resolve(response.data);
        },
        function(response) {
          console.log(response);
          deferred.reject("api call failed");
        }
      );
      return deferred.promise;
    };
    this.runTests = function() {
      callTests().then(
        function(data) {
          $scope.testsCalled = true;
          $scope.testsResults = data['test_results'];
          // this.showResults();
        },
        function(data) {
          $scope.testsCalled = true;
          $scope.testsResults = "There was an error; test call failed";
          console.log(data);
        }
      );
    };
    this.showResults = function() {
      $scope.$apply();
    };
  }]);

  //first attempt:
  //filters API call into state_model data object.
  app.controller('stateModelController',['$scope', '$routeParams', 'dataService', '$sce', function($scope, $routeParams, dataService, $sce){
    $scope.data = {};
    //current week shown
    $scope.week = null;
    //array of possible weeks, based on API response; used for select;
    $scope.weeks = [];
    //thinking ahead; can tie to radio buttons, to filter via ng-show
    $scope.filterOptions = {};
    //accepts data from API call to states (via dataService); parses into $scope.data for use by state_model page
    var buildData = function(data) {
      //reset
      $scope.data = {};
      $scope.week = null;
      $scope.weeks = [];
      $scope.filterOptions = {};
      var temp = {};
      //used for getting weeks: keys
      $scope.data['stateCode'] = $routeParams['stateCode'];
      $scope.data['propertyStats'] = [];
      $scope.data['cities'] = [];
      $scope.data['cityIds'] = [];
      //go through stats; can compress into fewer vars
      for (var key in data['stats']) {
        var newRow = {};
        var weekOf = data['stats'][key]['week_of'];
        var propertyType = data['stats'][key]['property_type'];
        var avg = data['stats'][key]['avg_listing_price'];
        var med = data['stats'][key]['med_listing_price'];
        var num = data['stats'][key]['num_properties'];
        temp[weekOf] = true;
        newRow['week'] = weekOf;
        newRow['type'] = propertyType;
        newRow['average'] = Number(avg);
        newRow['median'] = Number(med);
        newRow['numProps'] = Number(num);
        //append to array for use in stats table
        $scope.data['propertyStats'].push(newRow);
        // console.log(newRow);
      };
      //go through cities
      for (var key in data['cities']) {
        //append to array for use by cities table
        $scope.data['cities'].push({'name':data['cities'][key]['city_name'],'id':key});
        $scope.data['cityIds'].push(data['cities'][key]['city_id']);
      };
      //go through keys of stats for filter radio
      for(var key in $scope.data['propertyStats'][0]) {
        $scope.filterOptions[key] = true;
      };
      //go through temp keys (set), push to array;
      for(var key in temp) {
        $scope.weeks.push(key);
      };
      //set current week to last pushed; should be most recent, based on API
      $scope.week = $scope.weeks[$scope.weeks.length - 1];
    };
    //print data to console for review
    this.printData = function(){
      console.log($scope.data);
      console.log($scope.filterOptions);
      console.log($scope.week);
    };
    //FROM HERE ########################
    $scope.sort = {
      by: 'type',
      descending: false
    };
    this.showRow = function(row) {
      // console.log(row);
      return $scope.week === row['week'];
    };
    //used to update/set sort values
    this.sortBy = function(col) {
      if ($scope.sort['by'] === col) {
        $scope.sort['descending'] = !$scope.sort['descending'];
      } else {
        $scope.sort['by'] = col;
        $scope.sort['descending'] = false;
      };
    };
    //used by ng-show, for chevron on column
    this.sortedBy = function(col) {
      return $scope.sort['by'] === col;
    };
    //used by ng-class, for chevron direction
    this.isDescending = function() {
      return $scope.sort['descending'];
    };
    //TO HERE ########################## is VERY repetitive code (copy-paste, with minor changes)
    //for map
    this.setStateMapUrl = function() {
      var embedKey = "AIzaSyC5xVHl08OeT9jM4q_lwfY30IYPf3Jd3B0"
      var q = "State+of+" + $scope.data['stateCode'];
      var src = "https://www.google.com/maps/embed/v1/place?key="
      src += embedKey;
      src += "&q=";
      src += q;
      console.log(src);
      // var x ="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6509713.084021231!2d-123.77347912442343!3d37.1866687017569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb9fe5f285e3d%3A0x8b5109a227086f55!2sCalifornia!5e0!3m2!1sen!2sus!4v1458871633347"
      return $sce.trustAsResourceUrl(src);
    };
    var test_object = {"cities":{"05000":{"city_id":"05000","city_name":"Austin","latitude":"30.265887","longitude":"-97.745876","state_code":"TX"},"07396":{"city_id":"07396","city_name":"Bellevue","latitude":"33.6338544894988","longitude":"-98.0163214693602","state_code":"TX"},"19000":{"city_id":"19000","city_name":"Dallas","latitude":"32.775728","longitude":"-96.798477","state_code":"TX"},"35000":{"city_id":"35000","city_name":"Houston","latitude":"29.754839","longitude":"-95.365104","state_code":"TX"}},"stats":{"51":{"avg_listing_price":"389681","id":51,"med_listing_price":"277473","num_properties":"39109","property_type":"All Properties","state_code":"TX","week_of":"2016-03-12"},"52":{"avg_listing_price":"399421","id":52,"med_listing_price":"137555","num_properties":"588","property_type":"1 Bedroom Properties","state_code":"TX","week_of":"2016-03-12"},"53":{"avg_listing_price":"246210","id":53,"med_listing_price":"169593","num_properties":"3097","property_type":"2 Bedroom Properties","state_code":"TX","week_of":"2016-03-12"},"54":{"avg_listing_price":"285476","id":54,"med_listing_price":"215097","num_properties":"15975","property_type":"3 Bedroom Properties","state_code":"TX","week_of":"2016-03-12"},"55":{"avg_listing_price":"422477","id":55,"med_listing_price":"341389","num_properties":"14038","property_type":"4 Bedroom Properties","state_code":"TX","week_of":"2016-03-12"},"56":{"avg_listing_price":"667787","id":56,"med_listing_price":"456424","num_properties":"3748","property_type":"5 Bedroom Properties","state_code":"TX","week_of":"2016-03-12"},"57":{"avg_listing_price":"1592651","id":57,"med_listing_price":"771707","num_properties":"321","property_type":"6 Bedroom Properties","state_code":"TX","week_of":"2016-03-12"},"58":{"avg_listing_price":"2597785","id":58,"med_listing_price":"982114","num_properties":"74","property_type":"7 Bedroom Properties","state_code":"TX","week_of":"2016-03-12"},"59":{"avg_listing_price":"2208287","id":59,"med_listing_price":"1553000","num_properties":"22","property_type":"8 Bedroom Properties","state_code":"TX","week_of":"2016-03-12"},"60":{"avg_listing_price":"5250080","id":60,"med_listing_price":"2178571","num_properties":"13","property_type":"9 Bedroom Properties","state_code":"TX","week_of":"2016-03-12"},"61":{"avg_listing_price":"3008709","id":61,"med_listing_price":"2965786","num_properties":"6","property_type":"10 Bedroom Properties","state_code":"TX","week_of":"2016-03-12"},"62":{"avg_listing_price":"415439","id":62,"med_listing_price":"289450","num_properties":"24685","property_type":"All Properties","state_code":"TX","week_of":"2016-03-19"},"63":{"avg_listing_price":"525410","id":63,"med_listing_price":"148500","num_properties":"373","property_type":"1 Bedroom Properties","state_code":"TX","week_of":"2016-03-19"},"64":{"avg_listing_price":"256589","id":64,"med_listing_price":"182245","num_properties":"1877","property_type":"2 Bedroom Properties","state_code":"TX","week_of":"2016-03-19"},"65":{"avg_listing_price":"298659","id":65,"med_listing_price":"224900","num_properties":"9672","property_type":"3 Bedroom Properties","state_code":"TX","week_of":"2016-03-19"},"66":{"avg_listing_price":"437791","id":66,"med_listing_price":"348250","num_properties":"9150","property_type":"4 Bedroom Properties","state_code":"TX","week_of":"2016-03-19"},"67":{"avg_listing_price":"695985","id":67,"med_listing_price":"468498","num_properties":"2551","property_type":"5 Bedroom Properties","state_code":"TX","week_of":"2016-03-19"},"68":{"avg_listing_price":"1752797","id":68,"med_listing_price":"897450","num_properties":"210","property_type":"6 Bedroom Properties","state_code":"TX","week_of":"2016-03-19"},"69":{"avg_listing_price":"2965977","id":69,"med_listing_price":"1407250","num_properties":"57","property_type":"7 Bedroom Properties","state_code":"TX","week_of":"2016-03-19"},"70":{"avg_listing_price":"2111666","id":70,"med_listing_price":"1846250","num_properties":"13","property_type":"8 Bedroom Properties","state_code":"TX","week_of":"2016-03-19"},"71":{"avg_listing_price":"6697849","id":71,"med_listing_price":"4250000","num_properties":"10","property_type":"9 Bedroom Properties","state_code":"TX","week_of":"2016-03-19"},"72":{"avg_listing_price":"3025000","id":72,"med_listing_price":"3025000","num_properties":"3","property_type":"10 Bedroom Properties","state_code":"TX","week_of":"2016-03-19"}}};
    var init = function() {
      dataService.callAPI().then(function(data){buildData(data);}, function(data) {alert(data);buildData(test_object);});
    };
    init();
  }]);

  app.controller('cityModelController',['$scope', '$routeParams', 'dataService', '$sce', function($scope, $routeParams, dataService, $sce){
    $scope.data = {};
    //current week shown
    $scope.week = null;
    //array of possible weeks, based on API response; used for select;
    $scope.weeks = [];
    //thinking ahead; can tie to radio buttons, to filter via ng-show
    $scope.filterOptions = {};
    //accepts data from API call to states (via dataService); parses into $scope.data for use by state_model page
    var buildData = function(data) {
      //reset
      $scope.data = {};
      $scope.week = null;
      $scope.weeks = [];
      $scope.filterOptions = {};
      //used for getting weeks: keys are a set;
      var temp = {};
      //initialize data subcategories
      //key different vs state model ('cityId' vs 'stateCode') [sill primary key]
      $scope.data['cityId'] = $routeParams['cityId'];
      $scope.data['cityName'] = $scope.cityIdToName[$routeParams['cityId']];
      $scope.data['propertyStats'] = [];
      $scope.data['neighborhoods'] = [];
      //go through stats; can compress into fewer vars
      //identical to state model
      for (var key in data['stats']) {
        var newRow = {};
        var weekOf = data['stats'][key]['week_of'];
        var propertyType = data['stats'][key]['property_type'];
        var avg = data['stats'][key]['avg_listing_price'];
        var med = data['stats'][key]['med_listing_price'];
        var num = data['stats'][key]['num_properties'];
        temp[weekOf] = true;
        newRow['week'] = weekOf;
        newRow['type'] = propertyType;
        newRow['average'] = Number(avg);
        newRow['median'] = Number(med);
        newRow['numProps'] = Number(num);
        //append to array for use in stats table
        $scope.data['propertyStats'].push(newRow);
      };
      //go through cities
      //key different vs state model ('neighborhoods' vs 'cities')
      for (var key in data['neighborhoods']) {
        //append to array for use by cities table
        $scope.data['neighborhoods'].push({'name':data['neighborhoods'][key]['neighborhood_name'],'id':key});
        $scope.data['stateCode'] = data['neighborhoods'][key]['state_code'];
      };
      //go through keys of stats for filter radio
      for(var key in $scope.data['propertyStats'][0]) {
        $scope.filterOptions[key] = true;
      };
      //go through temp keys (set), push to array;
      for(var key in temp) {
        $scope.weeks.push(key);
      };
      //set current week to last pushed; should be most recent, based on API
      $scope.week = $scope.weeks[$scope.weeks.length - 1];
    };
    //print data to console for review
    this.printData = function(){
      console.log($scope.data);
      console.log($scope.filterOptions);
      console.log($scope.week);
      console.log($scope.pagination);
    };
    //FROM HERE ########################
    $scope.sort = {
      by: 'type',
      descending: false
    };
    this.showRow = function(row) {
      // console.log(row);
      return $scope.week === row['week'];
    };
    //used to update/set sort values
    this.sortBy = function(col) {
      if ($scope.sort['by'] === col) {
        $scope.sort['descending'] = !$scope.sort['descending'];
      } else {
        $scope.sort['by'] = col;
        $scope.sort['descending'] = false;
      }
    };
    //used by ng-show, for chevron on column
    this.sortedBy = function(col) {
      return $scope.sort['by'] === col;
    };
    //used by ng-class, for chevron direction
    this.isDescending = function() {
      return $scope.sort['descending'];
    };
    //TO HERE ########################## is VERY repetitive code (copy-paste, with minor changes)
    //for map
    //query is unique, but the rest is identical
    //mapDone is to prevent unnecessary calls
    var mapDone = false;
    this.setCityMapUrl = function() {
      if (!mapDone && $scope.data['cityName'] && $scope.data['stateCode']) {
        var embedKey = "AIzaSyC5xVHl08OeT9jM4q_lwfY30IYPf3Jd3B0"
        var q = $scope.data['cityName'] + ',+' + $scope.data['stateCode'];
        var src = "https://www.google.com/maps/embed/v1/place?key="
        src += embedKey;
        src += "&q=";
        src += q;
        console.log(src);
        mapDone = true;
        // var x ="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6509713.084021231!2d-123.77347912442343!3d37.1866687017569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb9fe5f285e3d%3A0x8b5109a227086f55!2sCalifornia!5e0!3m2!1sen!2sus!4v1458871633347"
        return $sce.trustAsResourceUrl(src);
      };
    };
    //PAGINATION START
    $scope.pagination = {};
    $scope.paginationCurrentPage = 0;
    var setupPagination = function(){
      $scope.pagination = {};
      $scope.pagination['numPerPage'] = 10;
      $scope.pagination['currentPage'] = 0;
      $scope.pagination['array'] = new Array(Math.ceil($scope.data['neighborhoods'].length/$scope.pagination.numPerPage));
      console.log($scope.pagination);
    };
    this.setPage = function(num){
      if(num >= 0 && num < $scope.pagination['array'].length) {
        $scope.pagination['currentPage'] = Number(num);
      };
      if(num >= $scope.pagination['array'].length) {
        $scope.pagination['currentPage'] = $scope.pagination['array'].length-1;
      };
      console.log($scope.pagination['currentPage']);
    };
    this.showIndex = function(index) {
      var base = ($scope.pagination['currentPage']*$scope.pagination['numPerPage']);
      return base <= index && index < (base + $scope.pagination['numPerPage']);
    };
    //PAGINATION END
    //test object, for when api call fails
    var test_object = {"neighborhoods":{"11756":{"city_id":"05000","neighborhood_id":"11756","neighborhood_name":"Meadows Of Brushy Creek","state_code":"TX"},"29023":{"city_id":"05000","neighborhood_id":"29023","neighborhood_name":"Pecan Bottom On Lake Austin","state_code":"TX"},"29024":{"city_id":"05000","neighborhood_id":"29024","neighborhood_name":"Lake Austin Village","state_code":"TX"},"29025":{"city_id":"05000","neighborhood_id":"29025","neighborhood_name":"The Golf Club At Avery Ranch","state_code":"TX"},"29026":{"city_id":"05000","neighborhood_id":"29026","neighborhood_name":"Sonesta West","state_code":"TX"},"29027":{"city_id":"05000","neighborhood_id":"29027","neighborhood_name":"Valle Escondido","state_code":"TX"},"29028":{"city_id":"05000","neighborhood_id":"29028","neighborhood_name":"The Village Of Angus Valley","state_code":"TX"},"29030":{"city_id":"05000","neighborhood_id":"29030","neighborhood_name":"Pioneer Hill","state_code":"TX"},"29031":{"city_id":"05000","neighborhood_id":"29031","neighborhood_name":"Angel Pass","state_code":"TX"},"29032":{"city_id":"05000","neighborhood_id":"29032","neighborhood_name":"Spicewood Bend","state_code":"TX"},"29035":{"city_id":"05000","neighborhood_id":"29035","neighborhood_name":"Watersedge At River Place","state_code":"TX"},"29036":{"city_id":"05000","neighborhood_id":"29036","neighborhood_name":"Canyon Rim","state_code":"TX"},"29037":{"city_id":"05000","neighborhood_id":"29037","neighborhood_name":"Bridgehead","state_code":"TX"},"29038":{"city_id":"05000","neighborhood_id":"29038","neighborhood_name":"Oakchase","state_code":"TX"},"29040":{"city_id":"05000","neighborhood_id":"29040","neighborhood_name":"Sanctuary At Coldwater","state_code":"TX"},"29041":{"city_id":"05000","neighborhood_id":"29041","neighborhood_name":"Hillcrest Village","state_code":"TX"},"29043":{"city_id":"05000","neighborhood_id":"29043","neighborhood_name":"Palladio Point","state_code":"TX"},"29045":{"city_id":"05000","neighborhood_id":"29045","neighborhood_name":"The Terraces","state_code":"TX"},"29046":{"city_id":"05000","neighborhood_id":"29046","neighborhood_name":"The Market At Three Points","state_code":"TX"},"29047":{"city_id":"05000","neighborhood_id":"29047","neighborhood_name":"Windmill Bluff Estates","state_code":"TX"},"29048":{"city_id":"05000","neighborhood_id":"29048","neighborhood_name":"Shadow Oaks","state_code":"TX"},"29049":{"city_id":"05000","neighborhood_id":"29049","neighborhood_name":"Bull Creek Ranch","state_code":"TX"},"29050":{"city_id":"05000","neighborhood_id":"29050","neighborhood_name":"Panther Hollow","state_code":"TX"},"29051":{"city_id":"05000","neighborhood_id":"29051","neighborhood_name":"Silverado Mobile Home Park","state_code":"TX"},"29052":{"city_id":"05000","neighborhood_id":"29052","neighborhood_name":"Shepherd Mountain","state_code":"TX"},"29054":{"city_id":"05000","neighborhood_id":"29054","neighborhood_name":"Marshall Ford Vista","state_code":"TX"},"29055":{"city_id":"05000","neighborhood_id":"29055","neighborhood_name":"Spraddle Creek","state_code":"TX"},"29056":{"city_id":"05000","neighborhood_id":"29056","neighborhood_name":"Terrace Plaza","state_code":"TX"},"29057":{"city_id":"05000","neighborhood_id":"29057","neighborhood_name":"The Meadow","state_code":"TX"},"29058":{"city_id":"05000","neighborhood_id":"29058","neighborhood_name":"Clayton's Crossing","state_code":"TX"},"29059":{"city_id":"05000","neighborhood_id":"29059","neighborhood_name":"Valley Oaks","state_code":"TX"},"29060":{"city_id":"05000","neighborhood_id":"29060","neighborhood_name":"Avery Ranch Garden Homes","state_code":"TX"},"29061":{"city_id":"05000","neighborhood_id":"29061","neighborhood_name":"Horseshoe Bend Estates","state_code":"TX"},"29063":{"city_id":"05000","neighborhood_id":"29063","neighborhood_name":"Highpoint Professional Park","state_code":"TX"},"29064":{"city_id":"05000","neighborhood_id":"29064","neighborhood_name":"The Highlands At Oak Forest","state_code":"TX"},"29065":{"city_id":"05000","neighborhood_id":"29065","neighborhood_name":"Highland Park Court","state_code":"TX"},"29066":{"city_id":"05000","neighborhood_id":"29066","neighborhood_name":"Baker Hills","state_code":"TX"},"29067":{"city_id":"05000","neighborhood_id":"29067","neighborhood_name":"Palisades West","state_code":"TX"},"29068":{"city_id":"05000","neighborhood_id":"29068","neighborhood_name":"Shinoak Valley","state_code":"TX"},"29069":{"city_id":"05000","neighborhood_id":"29069","neighborhood_name":"Coppertree","state_code":"TX"},"29070":{"city_id":"05000","neighborhood_id":"29070","neighborhood_name":"Hunter Oaks","state_code":"TX"},"29071":{"city_id":"05000","neighborhood_id":"29071","neighborhood_name":"Renaissance Park","state_code":"TX"},"29072":{"city_id":"05000","neighborhood_id":"29072","neighborhood_name":"The Overlook At Treemont","state_code":"TX"},"29073":{"city_id":"05000","neighborhood_id":"29073","neighborhood_name":"Oakwood Hollow Pud","state_code":"TX"},"29074":{"city_id":"05000","neighborhood_id":"29074","neighborhood_name":"Jourdan Crossing","state_code":"TX"},"29075":{"city_id":"05000","neighborhood_id":"29075","neighborhood_name":"6d Ranch","state_code":"TX"},"29076":{"city_id":"05000","neighborhood_id":"29076","neighborhood_name":"Pioneer Valley","state_code":"TX"},"29077":{"city_id":"05000","neighborhood_id":"29077","neighborhood_name":"Valle Del Rio","state_code":"TX"},"29078":{"city_id":"05000","neighborhood_id":"29078","neighborhood_name":"High Sierra Oaks","state_code":"TX"},"29079":{"city_id":"05000","neighborhood_id":"29079","neighborhood_name":"Norwood Acres","state_code":"TX"},"29082":{"city_id":"05000","neighborhood_id":"29082","neighborhood_name":"River Bend","state_code":"TX"},"29083":{"city_id":"05000","neighborhood_id":"29083","neighborhood_name":"Panorama Ranch","state_code":"TX"},"29084":{"city_id":"05000","neighborhood_id":"29084","neighborhood_name":"Sharmark West","state_code":"TX"},"29085":{"city_id":"05000","neighborhood_id":"29085","neighborhood_name":"Spice Forest","state_code":"TX"},"29086":{"city_id":"05000","neighborhood_id":"29086","neighborhood_name":"Alexan Mountain View","state_code":"TX"},"29087":{"city_id":"05000","neighborhood_id":"29087","neighborhood_name":"Mcneil Estates","state_code":"TX"},"29088":{"city_id":"05000","neighborhood_id":"29088","neighborhood_name":"Oak Forest West","state_code":"TX"},"29089":{"city_id":"05000","neighborhood_id":"29089","neighborhood_name":"Cima Oaks","state_code":"TX"},"29090":{"city_id":"05000","neighborhood_id":"29090","neighborhood_name":"Woodlands At Lake Creek","state_code":"TX"},"29091":{"city_id":"05000","neighborhood_id":"29091","neighborhood_name":"Parkstone","state_code":"TX"},"29093":{"city_id":"05000","neighborhood_id":"29093","neighborhood_name":"Whitney Oaks","state_code":"TX"},"29094":{"city_id":"05000","neighborhood_id":"29094","neighborhood_name":"Ferguson Crossing","state_code":"TX"},"29095":{"city_id":"05000","neighborhood_id":"29095","neighborhood_name":"The Meadows Of Great Hills","state_code":"TX"},"29098":{"city_id":"05000","neighborhood_id":"29098","neighborhood_name":"Alta Vista P.u.d.","state_code":"TX"},"29099":{"city_id":"05000","neighborhood_id":"29099","neighborhood_name":"Spicewood Springs Road Office Park","state_code":"TX"},"29100":{"city_id":"05000","neighborhood_id":"29100","neighborhood_name":"Park North","state_code":"TX"},"29102":{"city_id":"05000","neighborhood_id":"29102","neighborhood_name":"Crested Butte Hillside","state_code":"TX"},"29103":{"city_id":"05000","neighborhood_id":"29103","neighborhood_name":"Bull Creek Park","state_code":"TX"},"29104":{"city_id":"05000","neighborhood_id":"29104","neighborhood_name":"Wood Island","state_code":"TX"},"29107":{"city_id":"05000","neighborhood_id":"29107","neighborhood_name":"Spicewood Green","state_code":"TX"},"29108":{"city_id":"05000","neighborhood_id":"29108","neighborhood_name":"The Arbors","state_code":"TX"},"29109":{"city_id":"05000","neighborhood_id":"29109","neighborhood_name":"Marbry's Ridge","state_code":"TX"},"29110":{"city_id":"05000","neighborhood_id":"29110","neighborhood_name":"Northwest Hills Lakeview","state_code":"TX"},"29111":{"city_id":"05000","neighborhood_id":"29111","neighborhood_name":"Lakeside Terrace","state_code":"TX"},"29113":{"city_id":"05000","neighborhood_id":"29113","neighborhood_name":"Countryside","state_code":"TX"},"29114":{"city_id":"05000","neighborhood_id":"29114","neighborhood_name":"The Setting","state_code":"TX"},"29115":{"city_id":"05000","neighborhood_id":"29115","neighborhood_name":"Shady Lake Acres","state_code":"TX"},"29116":{"city_id":"05000","neighborhood_id":"29116","neighborhood_name":"Clear Creek Estates","state_code":"TX"},"29119":{"city_id":"05000","neighborhood_id":"29119","neighborhood_name":"Austin Woods","state_code":"TX"},"29120":{"city_id":"05000","neighborhood_id":"29120","neighborhood_name":"Avery West","state_code":"TX"},"29121":{"city_id":"05000","neighborhood_id":"29121","neighborhood_name":"Parmer South","state_code":"TX"},"29122":{"city_id":"05000","neighborhood_id":"29122","neighborhood_name":"Mountain Ridge","state_code":"TX"},"29123":{"city_id":"05000","neighborhood_id":"29123","neighborhood_name":"Mt. Bonnell Village","state_code":"TX"},"29125":{"city_id":"05000","neighborhood_id":"29125","neighborhood_name":"Lakeland Park","state_code":"TX"},"29126":{"city_id":"05000","neighborhood_id":"29126","neighborhood_name":"Avery Ranch East Parkside","state_code":"TX"},"29127":{"city_id":"05000","neighborhood_id":"29127","neighborhood_name":"Mccarty Triangle","state_code":"TX"},"29128":{"city_id":"05000","neighborhood_id":"29128","neighborhood_name":"The Canyon - The Preserve","state_code":"TX"},"29129":{"city_id":"05000","neighborhood_id":"29129","neighborhood_name":"Deerwood","state_code":"TX"},"29130":{"city_id":"05000","neighborhood_id":"29130","neighborhood_name":"High Pointe Subdivision","state_code":"TX"},"29132":{"city_id":"05000","neighborhood_id":"29132","neighborhood_name":"Bend At The Villages Of Spicewood","state_code":"TX"},"29133":{"city_id":"05000","neighborhood_id":"29133","neighborhood_name":"Nalle Woods","state_code":"TX"},"29134":{"city_id":"05000","neighborhood_id":"29134","neighborhood_name":"Richland Estates","state_code":"TX"},"29136":{"city_id":"05000","neighborhood_id":"29136","neighborhood_name":"Hermosa Office Park","state_code":"TX"},"29138":{"city_id":"05000","neighborhood_id":"29138","neighborhood_name":"Avery South Townhouse","state_code":"TX"},"29142":{"city_id":"05000","neighborhood_id":"29142","neighborhood_name":"Linda Vista","state_code":"TX"},"29143":{"city_id":"05000","neighborhood_id":"29143","neighborhood_name":"Hidden Valley","state_code":"TX"},"29144":{"city_id":"05000","neighborhood_id":"29144","neighborhood_name":"Sierra Arbor Estates","state_code":"TX"},"29145":{"city_id":"05000","neighborhood_id":"29145","neighborhood_name":"Angus Trail","state_code":"TX"},"29146":{"city_id":"05000","neighborhood_id":"29146","neighborhood_name":"Capital Memorial Park","state_code":"TX"},"29147":{"city_id":"05000","neighborhood_id":"29147","neighborhood_name":"Walnut Forest","state_code":"TX"},"29148":{"city_id":"05000","neighborhood_id":"29148","neighborhood_name":"Forest Ridge","state_code":"TX"},"29149":{"city_id":"05000","neighborhood_id":"29149","neighborhood_name":"Turbine West","state_code":"TX"},"29154":{"city_id":"05000","neighborhood_id":"29154","neighborhood_name":"Parkcrest Center","state_code":"TX"},"29156":{"city_id":"05000","neighborhood_id":"29156","neighborhood_name":"Hillcrest Mesa Townhomes","state_code":"TX"},"29157":{"city_id":"05000","neighborhood_id":"29157","neighborhood_name":"Park Place","state_code":"TX"},"29158":{"city_id":"05000","neighborhood_id":"29158","neighborhood_name":"Terraces At Scofield Ridge","state_code":"TX"},"29159":{"city_id":"05000","neighborhood_id":"29159","neighborhood_name":"Summit Park","state_code":"TX"},"29160":{"city_id":"05000","neighborhood_id":"29160","neighborhood_name":"Stirling Bridge","state_code":"TX"},"29162":{"city_id":"05000","neighborhood_id":"29162","neighborhood_name":"The Paddock At Commons Ford","state_code":"TX"},"29163":{"city_id":"05000","neighborhood_id":"29163","neighborhood_name":"Anderson Mill Village","state_code":"TX"},"29164":{"city_id":"05000","neighborhood_id":"29164","neighborhood_name":"Avery Ranch Commercial Far West","state_code":"TX"},"29165":{"city_id":"05000","neighborhood_id":"29165","neighborhood_name":"Montview Acres","state_code":"TX"},"29166":{"city_id":"05000","neighborhood_id":"29166","neighborhood_name":"Ribelin Ranch","state_code":"TX"},"29167":{"city_id":"05000","neighborhood_id":"29167","neighborhood_name":"Overlook At Bull Creek","state_code":"TX"},"29168":{"city_id":"05000","neighborhood_id":"29168","neighborhood_name":"Mustang Ranch","state_code":"TX"},"29171":{"city_id":"05000","neighborhood_id":"29171","neighborhood_name":"Thunderbird Village","state_code":"TX"},"29172":{"city_id":"05000","neighborhood_id":"29172","neighborhood_name":"Coldwater","state_code":"TX"},"29173":{"city_id":"05000","neighborhood_id":"29173","neighborhood_name":"Oak Ridge","state_code":"TX"},"29174":{"city_id":"05000","neighborhood_id":"29174","neighborhood_name":"Three Points Common","state_code":"TX"},"29175":{"city_id":"05000","neighborhood_id":"29175","neighborhood_name":"The Cliffs Of Austin","state_code":"TX"},"29176":{"city_id":"05000","neighborhood_id":"29176","neighborhood_name":"Beverly Hills","state_code":"TX"},"29177":{"city_id":"05000","neighborhood_id":"29177","neighborhood_name":"Balcones Professional Park","state_code":"TX"},"29178":{"city_id":"05000","neighborhood_id":"29178","neighborhood_name":"Oaks","state_code":"TX"},"29179":{"city_id":"05000","neighborhood_id":"29179","neighborhood_name":"Bee Creek Hills","state_code":"TX"},"29180":{"city_id":"05000","neighborhood_id":"29180","neighborhood_name":"Glenbrook","state_code":"TX"},"29181":{"city_id":"05000","neighborhood_id":"29181","neighborhood_name":"Walnut Place","state_code":"TX"},"29182":{"city_id":"05000","neighborhood_id":"29182","neighborhood_name":"Bancroft Woods","state_code":"TX"},"29183":{"city_id":"05000","neighborhood_id":"29183","neighborhood_name":"Carson Creek","state_code":"TX"},"29184":{"city_id":"05000","neighborhood_id":"29184","neighborhood_name":"Eubank Acres","state_code":"TX"},"29185":{"city_id":"05000","neighborhood_id":"29185","neighborhood_name":"Alegre Park","state_code":"TX"},"29186":{"city_id":"05000","neighborhood_id":"29186","neighborhood_name":"Amarra Drive","state_code":"TX"},"29187":{"city_id":"05000","neighborhood_id":"29187","neighborhood_name":"Preston Oaks","state_code":"TX"},"29190":{"city_id":"05000","neighborhood_id":"29190","neighborhood_name":"Mt. Bonnell Terrace","state_code":"TX"},"29193":{"city_id":"05000","neighborhood_id":"29193","neighborhood_name":"Berkley Square - Headway","state_code":"TX"},"29196":{"city_id":"05000","neighborhood_id":"29196","neighborhood_name":"The Courtyarad","state_code":"TX"},"29197":{"city_id":"05000","neighborhood_id":"29197","neighborhood_name":"Anderson Arbor","state_code":"TX"},"29198":{"city_id":"05000","neighborhood_id":"29198","neighborhood_name":"The Meadows Of Anderson Mill","state_code":"TX"},"29199":{"city_id":"05000","neighborhood_id":"29199","neighborhood_name":"Anderson Mills East","state_code":"TX"},"29200":{"city_id":"05000","neighborhood_id":"29200","neighborhood_name":"Anderson Mill Estates","state_code":"TX"},"29201":{"city_id":"05000","neighborhood_id":"29201","neighborhood_name":"Anderson Mills Lake Sites","state_code":"TX"},"29202":{"city_id":"05000","neighborhood_id":"29202","neighborhood_name":"Hidden Meadows","state_code":"TX"},"29203":{"city_id":"05000","neighborhood_id":"29203","neighborhood_name":"Estates Of Brentwood","state_code":"TX"},"29204":{"city_id":"05000","neighborhood_id":"29204","neighborhood_name":"Angus Ranch","state_code":"TX"},"29205":{"city_id":"05000","neighborhood_id":"29205","neighborhood_name":"Angus Valley","state_code":"TX"},"29206":{"city_id":"05000","neighborhood_id":"29206","neighborhood_name":"Barclay Woods","state_code":"TX"},"29207":{"city_id":"05000","neighborhood_id":"29207","neighborhood_name":"Apache Shores","state_code":"TX"},"29208":{"city_id":"05000","neighborhood_id":"29208","neighborhood_name":"Aqc Commercial Subdivision","state_code":"TX"},"29209":{"city_id":"05000","neighborhood_id":"29209","neighborhood_name":"Universal Heights","state_code":"TX"},"29210":{"city_id":"05000","neighborhood_id":"29210","neighborhood_name":"North Central Estates","state_code":"TX"},"29211":{"city_id":"05000","neighborhood_id":"29211","neighborhood_name":"Rio Robles","state_code":"TX"},"29213":{"city_id":"05000","neighborhood_id":"29213","neighborhood_name":"The Arboretum At Great Hills","state_code":"TX"},"29215":{"city_id":"05000","neighborhood_id":"29215","neighborhood_name":"Arrowwood","state_code":"TX"},"29216":{"city_id":"05000","neighborhood_id":"29216","neighborhood_name":"Dorsett Oaks","state_code":"TX"},"29217":{"city_id":"05000","neighborhood_id":"29217","neighborhood_name":"Arroyo Secco","state_code":"TX"},"29218":{"city_id":"05000","neighborhood_id":"29218","neighborhood_name":"Stony Ridge North","state_code":"TX"},"29219":{"city_id":"05000","neighborhood_id":"29219","neighborhood_name":"Four Points Centre","state_code":"TX"},"29220":{"city_id":"05000","neighborhood_id":"29220","neighborhood_name":"The Austin Center","state_code":"TX"},"29221":{"city_id":"05000","neighborhood_id":"29221","neighborhood_name":"River Place Centre","state_code":"TX"},"29222":{"city_id":"05000","neighborhood_id":"29222","neighborhood_name":"The Centrum","state_code":"TX"},"29223":{"city_id":"05000","neighborhood_id":"29223","neighborhood_name":"Calhoun's Corner","state_code":"TX"},"29224":{"city_id":"05000","neighborhood_id":"29224","neighborhood_name":"Austin Lake Estates","state_code":"TX"},"29226":{"city_id":"05000","neighborhood_id":"29226","neighborhood_name":"Avery Brookside","state_code":"TX"},"29227":{"city_id":"05000","neighborhood_id":"29227","neighborhood_name":"Avery Estates","state_code":"TX"},"29228":{"city_id":"05000","neighborhood_id":"29228","neighborhood_name":"Avery Morrison","state_code":"TX"},"29229":{"city_id":"05000","neighborhood_id":"29229","neighborhood_name":"Avery Ranch Commercial Northeast","state_code":"TX"},"29230":{"city_id":"05000","neighborhood_id":"29230","neighborhood_name":"Avery Ranch East","state_code":"TX"},"29231":{"city_id":"05000","neighborhood_id":"29231","neighborhood_name":"Avery Ranch Far West","state_code":"TX"},"29232":{"city_id":"05000","neighborhood_id":"29232","neighborhood_name":"Avery South","state_code":"TX"},"29233":{"city_id":"05000","neighborhood_id":"29233","neighborhood_name":"Tress Sonesta","state_code":"TX"},"29234":{"city_id":"05000","neighborhood_id":"29234","neighborhood_name":"Jefferson At Waterspark","state_code":"TX"},"29235":{"city_id":"05000","neighborhood_id":"29235","neighborhood_name":"Balcones Commercial","state_code":"TX"},"29236":{"city_id":"05000","neighborhood_id":"29236","neighborhood_name":"Balcones Greene","state_code":"TX"},"29237":{"city_id":"05000","neighborhood_id":"29237","neighborhood_name":"Balcones Hills","state_code":"TX"},"29238":{"city_id":"05000","neighborhood_id":"29238","neighborhood_name":"Balcones Oaks","state_code":"TX"},"29239":{"city_id":"05000","neighborhood_id":"29239","neighborhood_name":"Balcones Park Edgemont","state_code":"TX"},"29240":{"city_id":"05000","neighborhood_id":"29240","neighborhood_name":"Balcones Summit","state_code":"TX"},"29241":{"city_id":"05000","neighborhood_id":"29241","neighborhood_name":"Spicewood Professional Plaza","state_code":"TX"},"29242":{"city_id":"05000","neighborhood_id":"29242","neighborhood_name":"Balcones Woods","state_code":"TX"},"29244":{"city_id":"05000","neighborhood_id":"29244","neighborhood_name":"Oak Forest Villas","state_code":"TX"},"29245":{"city_id":"05000","neighborhood_id":"29245","neighborhood_name":"Summit Oaks","state_code":"TX"},"29246":{"city_id":"05000","neighborhood_id":"29246","neighborhood_name":"Lakeside","state_code":"TX"},"29247":{"city_id":"05000","neighborhood_id":"29247","neighborhood_name":"Aqua Verde","state_code":"TX"},"29248":{"city_id":"05000","neighborhood_id":"29248","neighborhood_name":"Barton Creek Square","state_code":"TX"},"29249":{"city_id":"05000","neighborhood_id":"29249","neighborhood_name":"Barton Creek West","state_code":"TX"},"29250":{"city_id":"05000","neighborhood_id":"29250","neighborhood_name":"The Estates Above Lost Creek","state_code":"TX"},"29251":{"city_id":"05000","neighborhood_id":"29251","neighborhood_name":"Foothills Of Barton Creek","state_code":"TX"},"29256":{"city_id":"05000","neighborhood_id":"29256","neighborhood_name":"Knollwood","state_code":"TX"},"29261":{"city_id":"05000","neighborhood_id":"29261","neighborhood_name":"Belhaven","state_code":"TX"},"29263":{"city_id":"05000","neighborhood_id":"29263","neighborhood_name":"Centex Industrial","state_code":"TX"},"29269":{"city_id":"05000","neighborhood_id":"29269","neighborhood_name":"Berdoll Farms","state_code":"TX"},"29270":{"city_id":"05000","neighborhood_id":"29270","neighborhood_name":"Bergstrom East Commercial","state_code":"TX"},"29271":{"city_id":"05000","neighborhood_id":"29271","neighborhood_name":"The Hills Of Lost Creek","state_code":"TX"},"29272":{"city_id":"05000","neighborhood_id":"29272","neighborhood_name":"Acres West","state_code":"TX"},"29273":{"city_id":"05000","neighborhood_id":"29273","neighborhood_name":"Three Point Acres","state_code":"TX"},"29274":{"city_id":"05000","neighborhood_id":"29274","neighborhood_name":"Vaught Ranch","state_code":"TX"},"29275":{"city_id":"05000","neighborhood_id":"29275","neighborhood_name":"Cameron Industrial","state_code":"TX"},"29277":{"city_id":"05000","neighborhood_id":"29277","neighborhood_name":"Bluestein Shopping Center","state_code":"TX"},"29278":{"city_id":"05000","neighborhood_id":"29278","neighborhood_name":"Bluffington","state_code":"TX"},"29279":{"city_id":"05000","neighborhood_id":"29279","neighborhood_name":"Bluffs Of Lost Creek","state_code":"TX"},"29280":{"city_id":"05000","neighborhood_id":"29280","neighborhood_name":"The Bluffs At Villages Of Spicewood","state_code":"TX"},"29281":{"city_id":"05000","neighborhood_id":"29281","neighborhood_name":"Northwest Hills Village","state_code":"TX"},"29282":{"city_id":"05000","neighborhood_id":"29282","neighborhood_name":"Knollwood On The Colorado River","state_code":"TX"},"29283":{"city_id":"05000","neighborhood_id":"29283","neighborhood_name":"Phillips Ranch On Lake Austin","state_code":"TX"},"29284":{"city_id":"05000","neighborhood_id":"29284","neighborhood_name":"Manana West","state_code":"TX"},"29285":{"city_id":"05000","neighborhood_id":"29285","neighborhood_name":"Highland Oaks","state_code":"TX"},"29286":{"city_id":"05000","neighborhood_id":"29286","neighborhood_name":"The Pavilion","state_code":"TX"},"29287":{"city_id":"05000","neighborhood_id":"29287","neighborhood_name":"Canyon Creek","state_code":"TX"},"29288":{"city_id":"05000","neighborhood_id":"29288","neighborhood_name":"Werkenthin","state_code":"TX"},"29289":{"city_id":"05000","neighborhood_id":"29289","neighborhood_name":"Hardrock Canyon","state_code":"TX"},"29290":{"city_id":"05000","neighborhood_id":"29290","neighborhood_name":"Gracywoods","state_code":"TX"},"29291":{"city_id":"05000","neighborhood_id":"29291","neighborhood_name":"Quail Hollow","state_code":"TX"},"29292":{"city_id":"05000","neighborhood_id":"29292","neighborhood_name":"Bratton Lane Business Park","state_code":"TX"},"29293":{"city_id":"05000","neighborhood_id":"29293","neighborhood_name":"Vista Business","state_code":"TX"},"29295":{"city_id":"05000","neighborhood_id":"29295","neighborhood_name":"Tierra Madrones","state_code":"TX"},"29296":{"city_id":"05000","neighborhood_id":"29296","neighborhood_name":"Spicewood Summit","state_code":"TX"},"29297":{"city_id":"05000","neighborhood_id":"29297","neighborhood_name":"Stillhouse Springs","state_code":"TX"},"29298":{"city_id":"05000","neighborhood_id":"29298","neighborhood_name":"Mesa Trails","state_code":"TX"},"29299":{"city_id":"05000","neighborhood_id":"29299","neighborhood_name":"Mesa Forest","state_code":"TX"},"29300":{"city_id":"05000","neighborhood_id":"29300","neighborhood_name":"Charleston Place","state_code":"TX"},"29301":{"city_id":"05000","neighborhood_id":"29301","neighborhood_name":"Green Trails Estates","state_code":"TX"},"29303":{"city_id":"05000","neighborhood_id":"29303","neighborhood_name":"The Cliff Of Ghost Canyon","state_code":"TX"},"29309":{"city_id":"05000","neighborhood_id":"29309","neighborhood_name":"Sterling Acres","state_code":"TX"},"29314":{"city_id":"05000","neighborhood_id":"29314","neighborhood_name":"Treemont","state_code":"TX"},"29315":{"city_id":"05000","neighborhood_id":"29315","neighborhood_name":"Bee Cave Woods","state_code":"TX"},"29316":{"city_id":"05000","neighborhood_id":"29316","neighborhood_name":"Treetops West","state_code":"TX"},"29318":{"city_id":"05000","neighborhood_id":"29318","neighborhood_name":"The Echelon","state_code":"TX"},"29319":{"city_id":"05000","neighborhood_id":"29319","neighborhood_name":"Martinshore","state_code":"TX"},"29320":{"city_id":"05000","neighborhood_id":"29320","neighborhood_name":"Oak Crest","state_code":"TX"},"29321":{"city_id":"05000","neighborhood_id":"29321","neighborhood_name":"Hidden Estates","state_code":"TX"},"29322":{"city_id":"05000","neighborhood_id":"29322","neighborhood_name":"Plaza Granados","state_code":"TX"},"29323":{"city_id":"05000","neighborhood_id":"29323","neighborhood_name":"Oak Creek Plaza","state_code":"TX"},"29324":{"city_id":"05000","neighborhood_id":"29324","neighborhood_name":"Island At Mt. Bonnel Shores","state_code":"TX"},"29325":{"city_id":"05000","neighborhood_id":"29325","neighborhood_name":"Waterford Place","state_code":"TX"},"29326":{"city_id":"05000","neighborhood_id":"29326","neighborhood_name":"Wildflower","state_code":"TX"},"29327":{"city_id":"05000","neighborhood_id":"29327","neighborhood_name":"Northtown West","state_code":"TX"},"29328":{"city_id":"05000","neighborhood_id":"29328","neighborhood_name":"Travis Vista","state_code":"TX"},"29329":{"city_id":"05000","neighborhood_id":"29329","neighborhood_name":"Canyon Creek Trailhead Park","state_code":"TX"},"29330":{"city_id":"05000","neighborhood_id":"29330","neighborhood_name":"Canyon Creek West","state_code":"TX"},"29331":{"city_id":"05000","neighborhood_id":"29331","neighborhood_name":"Rock Harbour","state_code":"TX"},"29332":{"city_id":"05000","neighborhood_id":"29332","neighborhood_name":"Canyon Ridge","state_code":"TX"},"29333":{"city_id":"05000","neighborhood_id":"29333","neighborhood_name":"Twin Rock At Oak Knoll","state_code":"TX"},"29334":{"city_id":"05000","neighborhood_id":"29334","neighborhood_name":"Barrington Oaks","state_code":"TX"},"29335":{"city_id":"05000","neighborhood_id":"29335","neighborhood_name":"Oak Forest","state_code":"TX"},"29336":{"city_id":"05000","neighborhood_id":"29336","neighborhood_name":"Raintree Estates","state_code":"TX"},"29342":{"city_id":"05000","neighborhood_id":"29342","neighborhood_name":"The Plaza Townhomes At Avery Ranch","state_code":"TX"},"29343":{"city_id":"05000","neighborhood_id":"29343","neighborhood_name":"North Cat Mountain","state_code":"TX"},"29344":{"city_id":"05000","neighborhood_id":"29344","neighborhood_name":"Lakewood Village","state_code":"TX"},"29345":{"city_id":"05000","neighborhood_id":"29345","neighborhood_name":"Cat Mountain Villas","state_code":"TX"},"29346":{"city_id":"05000","neighborhood_id":"29346","neighborhood_name":"Cliff Over Lake Austin","state_code":"TX"},"29347":{"city_id":"05000","neighborhood_id":"29347","neighborhood_name":"Colorado Crossing","state_code":"TX"},"29348":{"city_id":"05000","neighborhood_id":"29348","neighborhood_name":"Stoneledge","state_code":"TX"},"29349":{"city_id":"05000","neighborhood_id":"29349","neighborhood_name":"Saratoga Point","state_code":"TX"},"29350":{"city_id":"05000","neighborhood_id":"29350","neighborhood_name":"Parmer Square","state_code":"TX"},"29351":{"city_id":"05000","neighborhood_id":"29351","neighborhood_name":"Parmer Lane Heights","state_code":"TX"},"29352":{"city_id":"05000","neighborhood_id":"29352","neighborhood_name":"North Star","state_code":"TX"},"29353":{"city_id":"05000","neighborhood_id":"29353","neighborhood_name":"Village At Walnut Creek","state_code":"TX"},"29354":{"city_id":"05000","neighborhood_id":"29354","neighborhood_name":"Tanglewild Estates","state_code":"TX"},"29356":{"city_id":"05000","neighborhood_id":"29356","neighborhood_name":"Tuscany Business Park","state_code":"TX"},"29357":{"city_id":"05000","neighborhood_id":"29357","neighborhood_name":"Park 35","state_code":"TX"},"29358":{"city_id":"05000","neighborhood_id":"29358","neighborhood_name":"North Park Estates","state_code":"TX"},"29359":{"city_id":"05000","neighborhood_id":"29359","neighborhood_name":"Kings Village","state_code":"TX"},"29360":{"city_id":"05000","neighborhood_id":"29360","neighborhood_name":"Woods Of Century Park","state_code":"TX"},"29361":{"city_id":"05000","neighborhood_id":"29361","neighborhood_name":"Champion City Park","state_code":"TX"},"29362":{"city_id":"05000","neighborhood_id":"29362","neighborhood_name":"Champions Forest","state_code":"TX"},"29363":{"city_id":"05000","neighborhood_id":"29363","neighborhood_name":"Cherry Hill Park","state_code":"TX"},"29365":{"city_id":"05000","neighborhood_id":"29365","neighborhood_name":"Greystone Center","state_code":"TX"},"29366":{"city_id":"05000","neighborhood_id":"29366","neighborhood_name":"Chimney Hill","state_code":"TX"},"29367":{"city_id":"05000","neighborhood_id":"29367","neighborhood_name":"Business Park Place","state_code":"TX"},"29369":{"city_id":"05000","neighborhood_id":"29369","neighborhood_name":"Sette Tierra","state_code":"TX"},"29370":{"city_id":"05000","neighborhood_id":"29370","neighborhood_name":"Colorado Foothills","state_code":"TX"},"29371":{"city_id":"05000","neighborhood_id":"29371","neighborhood_name":"Comanche Canyon Ranch","state_code":"TX"},"29372":{"city_id":"05000","neighborhood_id":"29372","neighborhood_name":"Comanche Point","state_code":"TX"},"29373":{"city_id":"05000","neighborhood_id":"29373","neighborhood_name":"Comanche Trail","state_code":"TX"},"29374":{"city_id":"05000","neighborhood_id":"29374","neighborhood_name":"Camelot","state_code":"TX"},"29375":{"city_id":"05000","neighborhood_id":"29375","neighborhood_name":"Las Cimas Office Park","state_code":"TX"},"29376":{"city_id":"05000","neighborhood_id":"29376","neighborhood_name":"Edinburgh Gardens","state_code":"TX"},"29377":{"city_id":"05000","neighborhood_id":"29377","neighborhood_name":"Commerce Park At Harris Branch","state_code":"TX"},"29378":{"city_id":"05000","neighborhood_id":"29378","neighborhood_name":"Anderson Mill Village South","state_code":"TX"},"29379":{"city_id":"05000","neighborhood_id":"29379","neighborhood_name":"Heritage Center Northwest","state_code":"TX"},"29380":{"city_id":"05000","neighborhood_id":"29380","neighborhood_name":"Duval Springs","state_code":"TX"},"29386":{"city_id":"05000","neighborhood_id":"29386","neighborhood_name":"Davis Spring","state_code":"TX"},"29389":{"city_id":"05000","neighborhood_id":"29389","neighborhood_name":"Colony Meadows","state_code":"TX"},"29390":{"city_id":"05000","neighborhood_id":"29390","neighborhood_name":"Comanche Village","state_code":"TX"},"29391":{"city_id":"05000","neighborhood_id":"29391","neighborhood_name":"Deer Creek","state_code":"TX"},"29392":{"city_id":"05000","neighborhood_id":"29392","neighborhood_name":"Bergstrom Village","state_code":"TX"},"29393":{"city_id":"05000","neighborhood_id":"29393","neighborhood_name":"Stoney Ridge","state_code":"TX"},"29394":{"city_id":"05000","neighborhood_id":"29394","neighborhood_name":"Five Oaks Park North","state_code":"TX"},"29395":{"city_id":"05000","neighborhood_id":"29395","neighborhood_name":"River Ranch","state_code":"TX"},"29396":{"city_id":"05000","neighborhood_id":"29396","neighborhood_name":"Parmer Park","state_code":"TX"},"29397":{"city_id":"05000","neighborhood_id":"29397","neighborhood_name":"Dessau Estates","state_code":"TX"},"29398":{"city_id":"05000","neighborhood_id":"29398","neighborhood_name":"Parker Acres","state_code":"TX"},"29400":{"city_id":"05000","neighborhood_id":"29400","neighborhood_name":"Senna Hills","state_code":"TX"},"29401":{"city_id":"05000","neighborhood_id":"29401","neighborhood_name":"The Village At Meadow Mountain","state_code":"TX"},"29402":{"city_id":"05000","neighborhood_id":"29402","neighborhood_name":"Preserve At Lost Gold Cave","state_code":"TX"},"29403":{"city_id":"05000","neighborhood_id":"29403","neighborhood_name":"Pinnacle Oaks","state_code":"TX"},"29404":{"city_id":"05000","neighborhood_id":"29404","neighborhood_name":"Westlake Crossroads","state_code":"TX"},"29405":{"city_id":"05000","neighborhood_id":"29405","neighborhood_name":"Rolling Hills West","state_code":"TX"},"29406":{"city_id":"05000","neighborhood_id":"29406","neighborhood_name":"Glenlake","state_code":"TX"},"29407":{"city_id":"05000","neighborhood_id":"29407","neighborhood_name":"Dry Creek West","state_code":"TX"},"29408":{"city_id":"05000","neighborhood_id":"29408","neighborhood_name":"Walnut Bend","state_code":"TX"},"29410":{"city_id":"05000","neighborhood_id":"29410","neighborhood_name":"Stoneridge Place","state_code":"TX"},"29411":{"city_id":"05000","neighborhood_id":"29411","neighborhood_name":"Edwards Mountain","state_code":"TX"},"29415":{"city_id":"05000","neighborhood_id":"29415","neighborhood_name":"The High Road","state_code":"TX"},"29417":{"city_id":"05000","neighborhood_id":"29417","neighborhood_name":"Bee Cliffs","state_code":"TX"},"29419":{"city_id":"05000","neighborhood_id":"29419","neighborhood_name":"Sierra Vista","state_code":"TX"},"29420":{"city_id":"05000","neighborhood_id":"29420","neighborhood_name":"Enclave At The Villages Of Spicewood","state_code":"TX"},"29421":{"city_id":"05000","neighborhood_id":"29421","neighborhood_name":"Hunter's Chase","state_code":"TX"},"29422":{"city_id":"05000","neighborhood_id":"29422","neighborhood_name":"Rockcliff Estates","state_code":"TX"},"29423":{"city_id":"05000","neighborhood_id":"29423","neighborhood_name":"The Ravine","state_code":"TX"},"29424":{"city_id":"05000","neighborhood_id":"29424","neighborhood_name":"Green Park","state_code":"TX"},"29425":{"city_id":"05000","neighborhood_id":"29425","neighborhood_name":"Venado Estates","state_code":"TX"},"29426":{"city_id":"05000","neighborhood_id":"29426","neighborhood_name":"Yucca Mountain","state_code":"TX"},"29427":{"city_id":"05000","neighborhood_id":"29427","neighborhood_name":"Registry Office Park","state_code":"TX"},"29428":{"city_id":"05000","neighborhood_id":"29428","neighborhood_name":"The Fairway At Great Hills","state_code":"TX"},"29432":{"city_id":"05000","neighborhood_id":"29432","neighborhood_name":"Field Of Honor","state_code":"TX"},"29433":{"city_id":"05000","neighborhood_id":"29433","neighborhood_name":"Painted Bunting","state_code":"TX"},"29434":{"city_id":"05000","neighborhood_id":"29434","neighborhood_name":"Lost Plains","state_code":"TX"},"29435":{"city_id":"05000","neighborhood_id":"29435","neighborhood_name":"Ridgewood Village","state_code":"TX"},"29436":{"city_id":"05000","neighborhood_id":"29436","neighborhood_name":"Wood Shadows","state_code":"TX"},"29442":{"city_id":"05000","neighborhood_id":"29442","neighborhood_name":"Spicewood Forest","state_code":"TX"},"29443":{"city_id":"05000","neighborhood_id":"29443","neighborhood_name":"Forest North Estates","state_code":"TX"},"29444":{"city_id":"05000","neighborhood_id":"29444","neighborhood_name":"Forest At The Villages Of Spicewood","state_code":"TX"},"29445":{"city_id":"05000","neighborhood_id":"29445","neighborhood_name":"3m Austin Center","state_code":"TX"},"29446":{"city_id":"05000","neighborhood_id":"29446","neighborhood_name":"Walnut Ridge","state_code":"TX"},"29447":{"city_id":"05000","neighborhood_id":"29447","neighborhood_name":"Spicewood View Office Park","state_code":"TX"},"29448":{"city_id":"05000","neighborhood_id":"29448","neighborhood_name":"Sleepy Hollow","state_code":"TX"},"29449":{"city_id":"05000","neighborhood_id":"29449","neighborhood_name":"Limestone At Wells Branch","state_code":"TX"},"29451":{"city_id":"05000","neighborhood_id":"29451","neighborhood_name":"Idyle Hour Acres","state_code":"TX"},"29453":{"city_id":"05000","neighborhood_id":"29453","neighborhood_name":"Stonelake Office Park","state_code":"TX"},"29454":{"city_id":"05000","neighborhood_id":"29454","neighborhood_name":"Vista Del Pueblo","state_code":"TX"},"29455":{"city_id":"05000","neighborhood_id":"29455","neighborhood_name":"Los Cielos","state_code":"TX"},"29457":{"city_id":"05000","neighborhood_id":"29457","neighborhood_name":"The Parke","state_code":"TX"},"29458":{"city_id":"05000","neighborhood_id":"29458","neighborhood_name":"Lakeland Commerce Center","state_code":"TX"},"29459":{"city_id":"05000","neighborhood_id":"29459","neighborhood_name":"The Bluffs Of Great Hills","state_code":"TX"},"29460":{"city_id":"05000","neighborhood_id":"29460","neighborhood_name":"Prominent Point","state_code":"TX"},"29461":{"city_id":"05000","neighborhood_id":"29461","neighborhood_name":"The Arbor At Great Hills","state_code":"TX"},"29462":{"city_id":"05000","neighborhood_id":"29462","neighborhood_name":"Adirondack","state_code":"TX"},"29463":{"city_id":"05000","neighborhood_id":"29463","neighborhood_name":"Austin Hills","state_code":"TX"},"29464":{"city_id":"05000","neighborhood_id":"29464","neighborhood_name":"Great Hills","state_code":"TX"},"29466":{"city_id":"05000","neighborhood_id":"29466","neighborhood_name":"Green Shores On Lake Austin","state_code":"TX"},"29467":{"city_id":"05000","neighborhood_id":"29467","neighborhood_name":"Oak Shores On Lake Austin","state_code":"TX"},"29468":{"city_id":"05000","neighborhood_id":"29468","neighborhood_name":"Briarpatch","state_code":"TX"},"29469":{"city_id":"05000","neighborhood_id":"29469","neighborhood_name":"Indian Oaks","state_code":"TX"},"29470":{"city_id":"05000","neighborhood_id":"29470","neighborhood_name":"Los Indios","state_code":"TX"},"29471":{"city_id":"05000","neighborhood_id":"29471","neighborhood_name":"Windy Cove","state_code":"TX"},"29474":{"city_id":"05000","neighborhood_id":"29474","neighborhood_name":"Spicewood Office Park","state_code":"TX"},"29478":{"city_id":"05000","neighborhood_id":"29478","neighborhood_name":"Harris Branch","state_code":"TX"},"29479":{"city_id":"05000","neighborhood_id":"29479","neighborhood_name":"Harris Ridge","state_code":"TX"},"29480":{"city_id":"05000","neighborhood_id":"29480","neighborhood_name":"Balcones Village","state_code":"TX"},"29481":{"city_id":"05000","neighborhood_id":"29481","neighborhood_name":"The Gardens At Balcones","state_code":"TX"},"29482":{"city_id":"05000","neighborhood_id":"29482","neighborhood_name":"The Woodlands At Anderson Village","state_code":"TX"},"29483":{"city_id":"05000","neighborhood_id":"29483","neighborhood_name":"Wells Point Commercial","state_code":"TX"},"29484":{"city_id":"05000","neighborhood_id":"29484","neighborhood_name":"Davenport Ranch","state_code":"TX"},"29485":{"city_id":"05000","neighborhood_id":"29485","neighborhood_name":"Montview Harbor","state_code":"TX"},"29486":{"city_id":"05000","neighborhood_id":"29486","neighborhood_name":"Copperfield","state_code":"TX"},"29487":{"city_id":"05000","neighborhood_id":"29487","neighborhood_name":"High Vista","state_code":"TX"},"29488":{"city_id":"05000","neighborhood_id":"29488","neighborhood_name":"Chimney Corners","state_code":"TX"},"29489":{"city_id":"05000","neighborhood_id":"29489","neighborhood_name":"Mesa Oaks","state_code":"TX"},"29490":{"city_id":"05000","neighborhood_id":"29490","neighborhood_name":"Highland Hills","state_code":"TX"},"29492":{"city_id":"05000","neighborhood_id":"29492","neighborhood_name":"Highland Park West","state_code":"TX"},"29493":{"city_id":"05000","neighborhood_id":"29493","neighborhood_name":"Ridge Oak Park","state_code":"TX"},"29494":{"city_id":"05000","neighborhood_id":"29494","neighborhood_name":"Hill Country Center","state_code":"TX"},"29497":{"city_id":"05000","neighborhood_id":"29497","neighborhood_name":"Serena Woods","state_code":"TX"},"29498":{"city_id":"05000","neighborhood_id":"29498","neighborhood_name":"Oak Knoll Estates","state_code":"TX"},"29499":{"city_id":"05000","neighborhood_id":"29499","neighborhood_name":"Windridge","state_code":"TX"},"29500":{"city_id":"05000","neighborhood_id":"29500","neighborhood_name":"Oaks Of Jollyville","state_code":"TX"},"29501":{"city_id":"05000","neighborhood_id":"29501","neighborhood_name":"Hughes Park Lake","state_code":"TX"},"29503":{"city_id":"05000","neighborhood_id":"29503","neighborhood_name":"Illakee","state_code":"TX"},"29504":{"city_id":"05000","neighborhood_id":"29504","neighborhood_name":"Island On Westlake","state_code":"TX"},"29505":{"city_id":"05000","neighborhood_id":"29505","neighborhood_name":"West Rim","state_code":"TX"},"29506":{"city_id":"05000","neighborhood_id":"29506","neighborhood_name":"Island Way","state_code":"TX"},"29507":{"city_id":"05000","neighborhood_id":"29507","neighborhood_name":"Laguna Loma","state_code":"TX"},"29511":{"city_id":"05000","neighborhood_id":"29511","neighborhood_name":"Balcones Terrace","state_code":"TX"},"29514":{"city_id":"05000","neighborhood_id":"29514","neighborhood_name":"Northview Hills","state_code":"TX"},"29515":{"city_id":"05000","neighborhood_id":"29515","neighborhood_name":"Northwest Hills Ranch","state_code":"TX"},"29516":{"city_id":"05000","neighborhood_id":"29516","neighborhood_name":"Westhill Estates","state_code":"TX"},"29518":{"city_id":"05000","neighborhood_id":"29518","neighborhood_name":"Riata Crossing","state_code":"TX"},"29519":{"city_id":"05000","neighborhood_id":"29519","neighborhood_name":"Jester Point","state_code":"TX"},"29520":{"city_id":"05000","neighborhood_id":"29520","neighborhood_name":"Walnut Creek Business Park","state_code":"TX"},"29521":{"city_id":"05000","neighborhood_id":"29521","neighborhood_name":"Park Central","state_code":"TX"},"29522":{"city_id":"05000","neighborhood_id":"29522","neighborhood_name":"Village Oaks","state_code":"TX"},"29523":{"city_id":"05000","neighborhood_id":"29523","neighborhood_name":"Timberwood","state_code":"TX"},"29524":{"city_id":"05000","neighborhood_id":"29524","neighborhood_name":"Maconda Park East","state_code":"TX"},"29525":{"city_id":"05000","neighborhood_id":"29525","neighborhood_name":"Maconda Park West","state_code":"TX"},"29526":{"city_id":"05000","neighborhood_id":"29526","neighborhood_name":"Lake Creek Shopping Center","state_code":"TX"},"29528":{"city_id":"05000","neighborhood_id":"29528","neighborhood_name":"Kercheville Estates","state_code":"TX"},"29529":{"city_id":"05000","neighborhood_id":"29529","neighborhood_name":"Wells Branch Technology Park","state_code":"TX"},"29530":{"city_id":"05000","neighborhood_id":"29530","neighborhood_name":"Koger Executive Center","state_code":"TX"},"29531":{"city_id":"05000","neighborhood_id":"29531","neighborhood_name":"Tomanet Estates","state_code":"TX"},"29532":{"city_id":"05000","neighborhood_id":"29532","neighborhood_name":"Lamplight Village","state_code":"TX"},"29533":{"city_id":"05000","neighborhood_id":"29533","neighborhood_name":"Lakeplace","state_code":"TX"},"29534":{"city_id":"05000","neighborhood_id":"29534","neighborhood_name":"Comanche Trail Estates","state_code":"TX"},"29535":{"city_id":"05000","neighborhood_id":"29535","neighborhood_name":"Village At Anderson Mill","state_code":"TX"},"29536":{"city_id":"05000","neighborhood_id":"29536","neighborhood_name":"The Parke At Anderson Mill","state_code":"TX"},"29539":{"city_id":"05000","neighborhood_id":"29539","neighborhood_name":"The Doke","state_code":"TX"},"29540":{"city_id":"05000","neighborhood_id":"29540","neighborhood_name":"Lakes At Northtown","state_code":"TX"},"29541":{"city_id":"05000","neighborhood_id":"29541","neighborhood_name":"Lakeshore Addition","state_code":"TX"},"29543":{"city_id":"05000","neighborhood_id":"29543","neighborhood_name":"Lantana Glen","state_code":"TX"},"29544":{"city_id":"05000","neighborhood_id":"29544","neighborhood_name":"Las Cimas","state_code":"TX"},"29546":{"city_id":"05000","neighborhood_id":"29546","neighborhood_name":"Hollow Canyon","state_code":"TX"},"29547":{"city_id":"05000","neighborhood_id":"29547","neighborhood_name":"Ledgestone Cliffs","state_code":"TX"},"29549":{"city_id":"05000","neighborhood_id":"29549","neighborhood_name":"North Point","state_code":"TX"},"29550":{"city_id":"05000","neighborhood_id":"29550","neighborhood_name":"Colony Park","state_code":"TX"},"29552":{"city_id":"05000","neighborhood_id":"29552","neighborhood_name":"The Lodge At Walnut Creek","state_code":"TX"},"29554":{"city_id":"05000","neighborhood_id":"29554","neighborhood_name":"Long Canyon","state_code":"TX"},"29555":{"city_id":"05000","neighborhood_id":"29555","neighborhood_name":"M And J","state_code":"TX"},"29556":{"city_id":"05000","neighborhood_id":"29556","neighborhood_name":"Market At Wells Branch","state_code":"TX"},"29558":{"city_id":"05000","neighborhood_id":"29558","neighborhood_name":"North Oaks Hillside","state_code":"TX"},"29559":{"city_id":"05000","neighborhood_id":"29559","neighborhood_name":"North Oaks","state_code":"TX"},"29560":{"city_id":"05000","neighborhood_id":"29560","neighborhood_name":"Meadows At Berdoll","state_code":"TX"},"29561":{"city_id":"05000","neighborhood_id":"29561","neighborhood_name":"Meadows At Trinity Crossing","state_code":"TX"},"29562":{"city_id":"05000","neighborhood_id":"29562","neighborhood_name":"Meadows Of Walnut Creek","state_code":"TX"},"29564":{"city_id":"05000","neighborhood_id":"29564","neighborhood_name":"Mesa Park","state_code":"TX"},"29565":{"city_id":"05000","neighborhood_id":"29565","neighborhood_name":"Mesa Village","state_code":"TX"},"29566":{"city_id":"05000","neighborhood_id":"29566","neighborhood_name":"Plaza Volente","state_code":"TX"},"29568":{"city_id":"05000","neighborhood_id":"29568","neighborhood_name":"Milwood","state_code":"TX"},"29569":{"city_id":"05000","neighborhood_id":"29569","neighborhood_name":"Northwest Estates","state_code":"TX"},"29571":{"city_id":"05000","neighborhood_id":"29571","neighborhood_name":"North Crossing","state_code":"TX"},"29572":{"city_id":"05000","neighborhood_id":"29572","neighborhood_name":"Oakview","state_code":"TX"},"29573":{"city_id":"05000","neighborhood_id":"29573","neighborhood_name":"Valleyside Place","state_code":"TX"},"29575":{"city_id":"05000","neighborhood_id":"29575","neighborhood_name":"North Loop Business Park","state_code":"TX"},"29576":{"city_id":"05000","neighborhood_id":"29576","neighborhood_name":"Park At Duval","state_code":"TX"},"29578":{"city_id":"05000","neighborhood_id":"29578","neighborhood_name":"North Shields","state_code":"TX"},"29579":{"city_id":"05000","neighborhood_id":"29579","neighborhood_name":"Parmer Point","state_code":"TX"},"29581":{"city_id":"05000","neighborhood_id":"29581","neighborhood_name":"Northridge Park","state_code":"TX"},"29583":{"city_id":"05000","neighborhood_id":"29583","neighborhood_name":"Northwest Balcones","state_code":"TX"},"29584":{"city_id":"05000","neighborhood_id":"29584","neighborhood_name":"Oak Summit","state_code":"TX"},"29585":{"city_id":"05000","neighborhood_id":"29585","neighborhood_name":"Northwest Hills","state_code":"TX"},"29586":{"city_id":"05000","neighborhood_id":"29586","neighborhood_name":"Northwest Hills Northwest Oaks","state_code":"TX"},"29587":{"city_id":"05000","neighborhood_id":"29587","neighborhood_name":"Northwood","state_code":"TX"},"29588":{"city_id":"05000","neighborhood_id":"29588","neighborhood_name":"Walden Park At Lakeline","state_code":"TX"},"29589":{"city_id":"05000","neighborhood_id":"29589","neighborhood_name":"Davis Spring Commercial","state_code":"TX"},"29591":{"city_id":"05000","neighborhood_id":"29591","neighborhood_name":"Old Tarlton Center","state_code":"TX"},"29592":{"city_id":"05000","neighborhood_id":"29592","neighborhood_name":"Overlook At Cat Mountain","state_code":"TX"},"29593":{"city_id":"05000","neighborhood_id":"29593","neighborhood_name":"Jester Estates","state_code":"TX"},"29594":{"city_id":"05000","neighborhood_id":"29594","neighborhood_name":"Pamela Heights","state_code":"TX"},"29595":{"city_id":"05000","neighborhood_id":"29595","neighborhood_name":"Panther Hollow Creek","state_code":"TX"},"29596":{"city_id":"05000","neighborhood_id":"29596","neighborhood_name":"Northtown Park","state_code":"TX"},"29597":{"city_id":"05000","neighborhood_id":"29597","neighborhood_name":"Tech Ridge Center","state_code":"TX"},"29598":{"city_id":"05000","neighborhood_id":"29598","neighborhood_name":"Parmer North","state_code":"TX"},"29599":{"city_id":"05000","neighborhood_id":"29599","neighborhood_name":"Crossing At Parmer Lane","state_code":"TX"},"29600":{"city_id":"05000","neighborhood_id":"29600","neighborhood_name":"Scofield Farms","state_code":"TX"},"29601":{"city_id":"05000","neighborhood_id":"29601","neighborhood_name":"Scofield Ranch Creekside","state_code":"TX"},"29603":{"city_id":"05000","neighborhood_id":"29603","neighborhood_name":"Pecan Park","state_code":"TX"},"29604":{"city_id":"05000","neighborhood_id":"29604","neighborhood_name":"Pioneer Crossing","state_code":"TX"},"29607":{"city_id":"05000","neighborhood_id":"29607","neighborhood_name":"The Point At Rob Roy","state_code":"TX"},"29608":{"city_id":"05000","neighborhood_id":"29608","neighborhood_name":"Rob Roy","state_code":"TX"},"29609":{"city_id":"05000","neighborhood_id":"29609","neighborhood_name":"Davenport Ranch West","state_code":"TX"},"29610":{"city_id":"05000","neighborhood_id":"29610","neighborhood_name":"Point West Of Westover Hills","state_code":"TX"},"29611":{"city_id":"05000","neighborhood_id":"29611","neighborhood_name":"Westover Hills Mountain Path","state_code":"TX"},"29613":{"city_id":"05000","neighborhood_id":"29613","neighborhood_name":"Quarry","state_code":"TX"},"29614":{"city_id":"05000","neighborhood_id":"29614","neighborhood_name":"Renaissance At Hunter's Chase","state_code":"TX"},"29615":{"city_id":"05000","neighborhood_id":"29615","neighborhood_name":"Central Commerce Business Park","state_code":"TX"},"29616":{"city_id":"05000","neighborhood_id":"29616","neighborhood_name":"Regents","state_code":"TX"},"29617":{"city_id":"05000","neighborhood_id":"29617","neighborhood_name":"Westview On Lake Austin","state_code":"TX"},"29618":{"city_id":"05000","neighborhood_id":"29618","neighborhood_name":"Leffler Commercial","state_code":"TX"},"29619":{"city_id":"05000","neighborhood_id":"29619","neighborhood_name":"Avery Ranch North","state_code":"TX"},"29620":{"city_id":"05000","neighborhood_id":"29620","neighborhood_name":"Balcones Park","state_code":"TX"},"29621":{"city_id":"05000","neighborhood_id":"29621","neighborhood_name":"Westover Hills","state_code":"TX"},"29622":{"city_id":"05000","neighborhood_id":"29622","neighborhood_name":"Vista West","state_code":"TX"},"29623":{"city_id":"05000","neighborhood_id":"29623","neighborhood_name":"Columbia Oaks","state_code":"TX"},"29625":{"city_id":"05000","neighborhood_id":"29625","neighborhood_name":"Riverfront Estates","state_code":"TX"},"29626":{"city_id":"05000","neighborhood_id":"29626","neighborhood_name":"River Dance At Steiner Ranch","state_code":"TX"},"29627":{"city_id":"05000","neighborhood_id":"29627","neighborhood_name":"River Oak Lake Estates","state_code":"TX"},"29628":{"city_id":"05000","neighborhood_id":"29628","neighborhood_name":"River Pointe","state_code":"TX"},"29629":{"city_id":"05000","neighborhood_id":"29629","neighborhood_name":"River Ridge","state_code":"TX"},"29630":{"city_id":"05000","neighborhood_id":"29630","neighborhood_name":"River Terrace","state_code":"TX"},"29631":{"city_id":"05000","neighborhood_id":"29631","neighborhood_name":"Rivercrest","state_code":"TX"},"29634":{"city_id":"05000","neighborhood_id":"29634","neighborhood_name":"Lakes At Techridge","state_code":"TX"},"29635":{"city_id":"05000","neighborhood_id":"29635","neighborhood_name":"Sarah's  Creek","state_code":"TX"},"29636":{"city_id":"05000","neighborhood_id":"29636","neighborhood_name":"Pierson Business Center","state_code":"TX"},"29637":{"city_id":"05000","neighborhood_id":"29637","neighborhood_name":"Parmer Center","state_code":"TX"},"29638":{"city_id":"05000","neighborhood_id":"29638","neighborhood_name":"Sendero Hills","state_code":"TX"},"29639":{"city_id":"05000","neighborhood_id":"29639","neighborhood_name":"Wood Creek","state_code":"TX"},"29643":{"city_id":"05000","neighborhood_id":"29643","neighborhood_name":"Sierra Oaks","state_code":"TX"},"29644":{"city_id":"05000","neighborhood_id":"29644","neighborhood_name":"Oakledge","state_code":"TX"},"29646":{"city_id":"05000","neighborhood_id":"29646","neighborhood_name":"Speyside","state_code":"TX"},"29647":{"city_id":"05000","neighborhood_id":"29647","neighborhood_name":"Spicewood At Bullcreek","state_code":"TX"},"29648":{"city_id":"05000","neighborhood_id":"29648","neighborhood_name":"Spicewood Estates","state_code":"TX"},"29649":{"city_id":"05000","neighborhood_id":"29649","neighborhood_name":"Spicewood Point","state_code":"TX"},"29650":{"city_id":"05000","neighborhood_id":"29650","neighborhood_name":"Spring Willow Creek","state_code":"TX"},"29651":{"city_id":"05000","neighborhood_id":"29651","neighborhood_name":"St. Tropez","state_code":"TX"},"29652":{"city_id":"05000","neighborhood_id":"29652","neighborhood_name":"Summit At West Rim On Mount Larson","state_code":"TX"},"29653":{"city_id":"05000","neighborhood_id":"29653","neighborhood_name":"Springwoods","state_code":"TX"},"29654":{"city_id":"05000","neighborhood_id":"29654","neighborhood_name":"Robinson Ranch","state_code":"TX"},"29655":{"city_id":"05000","neighborhood_id":"29655","neighborhood_name":"Steiner Ranch","state_code":"TX"},"29657":{"city_id":"05000","neighborhood_id":"29657","neighborhood_name":"Stratford Hills","state_code":"TX"},"29658":{"city_id":"05000","neighborhood_id":"29658","neighborhood_name":"Stratford Place","state_code":"TX"},"29659":{"city_id":"05000","neighborhood_id":"29659","neighborhood_name":"Summerwood","state_code":"TX"},"29660":{"city_id":"05000","neighborhood_id":"29660","neighborhood_name":"Riata Corporate Park","state_code":"TX"},"29661":{"city_id":"05000","neighborhood_id":"29661","neighborhood_name":"Wells Branch","state_code":"TX"},"29662":{"city_id":"05000","neighborhood_id":"29662","neighborhood_name":"Cima Serrena Village","state_code":"TX"},"29663":{"city_id":"05000","neighborhood_id":"29663","neighborhood_name":"Tanglewood Estates","state_code":"TX"},"29667":{"city_id":"05000","neighborhood_id":"29667","neighborhood_name":"The Park At Spicewood Springs","state_code":"TX"},"29668":{"city_id":"05000","neighborhood_id":"29668","neighborhood_name":"Avery Ranch","state_code":"TX"},"29672":{"city_id":"05000","neighborhood_id":"29672","neighborhood_name":"The Woods Of Greenshores","state_code":"TX"},"29673":{"city_id":"05000","neighborhood_id":"29673","neighborhood_name":"Timber Creek","state_code":"TX"},"29674":{"city_id":"05000","neighborhood_id":"29674","neighborhood_name":"Treetops","state_code":"TX"},"29675":{"city_id":"05000","neighborhood_id":"29675","neighborhood_name":"Twenty Two Twenty Two Business Park","state_code":"TX"},"29676":{"city_id":"05000","neighborhood_id":"29676","neighborhood_name":"Twin Mesa","state_code":"TX"},"29677":{"city_id":"05000","neighborhood_id":"29677","neighborhood_name":"Village At River Oaks","state_code":"TX"},"29678":{"city_id":"05000","neighborhood_id":"29678","neighborhood_name":"Vista North","state_code":"TX"},"29679":{"city_id":"05000","neighborhood_id":"29679","neighborhood_name":"The Woods Of Westlake Hilltop","state_code":"TX"},"29680":{"city_id":"05000","neighborhood_id":"29680","neighborhood_name":"Lakewood Park","state_code":"TX"},"29681":{"city_id":"05000","neighborhood_id":"29681","neighborhood_name":"Walnut Crossing","state_code":"TX"},"29682":{"city_id":"05000","neighborhood_id":"29682","neighborhood_name":"Watersedge","state_code":"TX"},"29683":{"city_id":"05000","neighborhood_id":"29683","neighborhood_name":"Grandview Hills","state_code":"TX"},"29684":{"city_id":"05000","neighborhood_id":"29684","neighborhood_name":"Westcliff","state_code":"TX"},"29685":{"city_id":"05000","neighborhood_id":"29685","neighborhood_name":"Westlake Highlands","state_code":"TX"},"29686":{"city_id":"05000","neighborhood_id":"29686","neighborhood_name":"Westminster Glen","state_code":"TX"},"29688":{"city_id":"05000","neighborhood_id":"29688","neighborhood_name":"Lakeline Mall","state_code":"TX"},"29689":{"city_id":"05000","neighborhood_id":"29689","neighborhood_name":"Woodcliff","state_code":"TX"},"29690":{"city_id":"05000","neighborhood_id":"29690","neighborhood_name":"The Woods Of Anderson Mill","state_code":"TX"},"29691":{"city_id":"05000","neighborhood_id":"29691","neighborhood_name":"The Woodlands","state_code":"TX"},"29692":{"city_id":"05000","neighborhood_id":"29692","neighborhood_name":"Woods Of Westlake Heights","state_code":"TX"},"29693":{"city_id":"05000","neighborhood_id":"29693","neighborhood_name":"Rob Roy On The Lake","state_code":"TX"},"29701":{"city_id":"05000","neighborhood_id":"29701","neighborhood_name":"Hollow At Slaughter Creek","state_code":"TX"},"29702":{"city_id":"05000","neighborhood_id":"29702","neighborhood_name":"Cypress Banks","state_code":"TX"},"29705":{"city_id":"05000","neighborhood_id":"29705","neighborhood_name":"Acre Tract","state_code":"TX"},"29706":{"city_id":"05000","neighborhood_id":"29706","neighborhood_name":"William Cannon Joint Venture","state_code":"TX"},"29707":{"city_id":"05000","neighborhood_id":"29707","neighborhood_name":"Austin South Point Village","state_code":"TX"},"29708":{"city_id":"05000","neighborhood_id":"29708","neighborhood_name":"Bluff Springs Center","state_code":"TX"},"29709":{"city_id":"05000","neighborhood_id":"29709","neighborhood_name":"Bluff Springs Commercial","state_code":"TX"},"29710":{"city_id":"05000","neighborhood_id":"29710","neighborhood_name":"Cannon Oaks","state_code":"TX"},"29711":{"city_id":"05000","neighborhood_id":"29711","neighborhood_name":"Century South","state_code":"TX"},"29712":{"city_id":"05000","neighborhood_id":"29712","neighborhood_name":"Chappell Hill","state_code":"TX"},"29713":{"city_id":"05000","neighborhood_id":"29713","neighborhood_name":"Chateau At Onion Creek","state_code":"TX"},"29714":{"city_id":"05000","neighborhood_id":"29714","neighborhood_name":"Cherry Meadows","state_code":"TX"},"29715":{"city_id":"05000","neighborhood_id":"29715","neighborhood_name":"Cooper's Hill","state_code":"TX"},"29716":{"city_id":"05000","neighborhood_id":"29716","neighborhood_name":"Cypress Ridge","state_code":"TX"},"29717":{"city_id":"05000","neighborhood_id":"29717","neighborhood_name":"Dittmar Crossing","state_code":"TX"},"29718":{"city_id":"05000","neighborhood_id":"29718","neighborhood_name":"Elmwood Park","state_code":"TX"},"29719":{"city_id":"05000","neighborhood_id":"29719","neighborhood_name":"Enclave At Westgate","state_code":"TX"},"29720":{"city_id":"05000","neighborhood_id":"29720","neighborhood_name":"Escarpment Village","state_code":"TX"},"29721":{"city_id":"05000","neighborhood_id":"29721","neighborhood_name":"Estates Of Bauerle Ranch","state_code":"TX"},"29722":{"city_id":"05000","neighborhood_id":"29722","neighborhood_name":"Forest Hills","state_code":"TX"},"29723":{"city_id":"05000","neighborhood_id":"29723","neighborhood_name":"Forum","state_code":"TX"},"29724":{"city_id":"05000","neighborhood_id":"29724","neighborhood_name":"Greenslopes","state_code":"TX"},"29725":{"city_id":"05000","neighborhood_id":"29725","neighborhood_name":"Heights At Loma Vista","state_code":"TX"},"29726":{"city_id":"05000","neighborhood_id":"29726","neighborhood_name":"Hillside Oaks","state_code":"TX"},"29727":{"city_id":"05000","neighborhood_id":"29727","neighborhood_name":"Lincoln Ridge","state_code":"TX"},"29728":{"city_id":"05000","neighborhood_id":"29728","neighborhood_name":"Manchaca Commercial Park","state_code":"TX"},"29729":{"city_id":"05000","neighborhood_id":"29729","neighborhood_name":"Matthews Park","state_code":"TX"},"29730":{"city_id":"05000","neighborhood_id":"29730","neighborhood_name":"Meadowcreek","state_code":"TX"},"29731":{"city_id":"05000","neighborhood_id":"29731","neighborhood_name":"Meadows At Bluff Springs","state_code":"TX"},"29732":{"city_id":"05000","neighborhood_id":"29732","neighborhood_name":"Mooreland","state_code":"TX"},"29733":{"city_id":"05000","neighborhood_id":"29733","neighborhood_name":"Morningside","state_code":"TX"},"29734":{"city_id":"05000","neighborhood_id":"29734","neighborhood_name":"Oconomowoc West","state_code":"TX"},"29735":{"city_id":"05000","neighborhood_id":"29735","neighborhood_name":"Onion Creek Plantations","state_code":"TX"},"29736":{"city_id":"05000","neighborhood_id":"29736","neighborhood_name":"Park Ridge","state_code":"TX"},"29737":{"city_id":"05000","neighborhood_id":"29737","neighborhood_name":"Ronald Heights","state_code":"TX"},"29738":{"city_id":"05000","neighborhood_id":"29738","neighborhood_name":"Slaughter Creek Commercial Park","state_code":"TX"},"29739":{"city_id":"05000","neighborhood_id":"29739","neighborhood_name":"Slaughter Lane Commercial Park","state_code":"TX"},"29740":{"city_id":"05000","neighborhood_id":"29740","neighborhood_name":"Somerset Estates","state_code":"TX"},"29741":{"city_id":"05000","neighborhood_id":"29741","neighborhood_name":"Stonecreek","state_code":"TX"},"29746":{"city_id":"05000","neighborhood_id":"29746","neighborhood_name":"Taylor Estates","state_code":"TX"},"29747":{"city_id":"05000","neighborhood_id":"29747","neighborhood_name":"The Sidney","state_code":"TX"},"29748":{"city_id":"05000","neighborhood_id":"29748","neighborhood_name":"The Waters At Bluff Springs","state_code":"TX"},"29749":{"city_id":"05000","neighborhood_id":"29749","neighborhood_name":"Towne Square Center","state_code":"TX"},"29751":{"city_id":"05000","neighborhood_id":"29751","neighborhood_name":"Waterloo","state_code":"TX"},"29752":{"city_id":"05000","neighborhood_id":"29752","neighborhood_name":"Waterstone At Slaughter Lane","state_code":"TX"},"29753":{"city_id":"05000","neighborhood_id":"29753","neighborhood_name":"West Branch","state_code":"TX"},"29754":{"city_id":"05000","neighborhood_id":"29754","neighborhood_name":"Westwood Heights","state_code":"TX"},"29755":{"city_id":"05000","neighborhood_id":"29755","neighborhood_name":"Woodgreen Acres","state_code":"TX"},"29756":{"city_id":"05000","neighborhood_id":"29756","neighborhood_name":"Yarrabee Bend South","state_code":"TX"},"29757":{"city_id":"05000","neighborhood_id":"29757","neighborhood_name":"Alta Mira","state_code":"TX"},"29758":{"city_id":"05000","neighborhood_id":"29758","neighborhood_name":"Autumn Wood","state_code":"TX"},"29759":{"city_id":"05000","neighborhood_id":"29759","neighborhood_name":"Beckett Meadows","state_code":"TX"},"29760":{"city_id":"05000","neighborhood_id":"29760","neighborhood_name":"Bridges At Bear Creek","state_code":"TX"},"29761":{"city_id":"05000","neighborhood_id":"29761","neighborhood_name":"Brodie","state_code":"TX"},"29762":{"city_id":"05000","neighborhood_id":"29762","neighborhood_name":"Brodie Springs","state_code":"TX"},"29763":{"city_id":"05000","neighborhood_id":"29763","neighborhood_name":"Buckingham Ridge","state_code":"TX"},"29764":{"city_id":"05000","neighborhood_id":"29764","neighborhood_name":"Carrell Oaks","state_code":"TX"},"29765":{"city_id":"05000","neighborhood_id":"29765","neighborhood_name":"Castlewood Forest","state_code":"TX"},"29766":{"city_id":"05000","neighborhood_id":"29766","neighborhood_name":"Cherry Creek Commercial","state_code":"TX"},"29767":{"city_id":"05000","neighborhood_id":"29767","neighborhood_name":"Dan Jean Oaks","state_code":"TX"},"29768":{"city_id":"05000","neighborhood_id":"29768","neighborhood_name":"Davis Hill Estates","state_code":"TX"},"29769":{"city_id":"05000","neighborhood_id":"29769","neighborhood_name":"Esquel","state_code":"TX"},"29770":{"city_id":"05000","neighborhood_id":"29770","neighborhood_name":"Greenleaf Estates","state_code":"TX"},"29771":{"city_id":"05000","neighborhood_id":"29771","neighborhood_name":"Indian Hills","state_code":"TX"},"29772":{"city_id":"05000","neighborhood_id":"29772","neighborhood_name":"Keesee","state_code":"TX"},"29773":{"city_id":"05000","neighborhood_id":"29773","neighborhood_name":"Kincheon","state_code":"TX"},"29774":{"city_id":"05000","neighborhood_id":"29774","neighborhood_name":"La Crosse","state_code":"TX"},"29775":{"city_id":"05000","neighborhood_id":"29775","neighborhood_name":"Laurelwood Commercial","state_code":"TX"},"29776":{"city_id":"05000","neighborhood_id":"29776","neighborhood_name":"Laurelwood Estates","state_code":"TX"},"29777":{"city_id":"05000","neighborhood_id":"29777","neighborhood_name":"Laurelwood","state_code":"TX"},"29778":{"city_id":"05000","neighborhood_id":"29778","neighborhood_name":"Legend Oaks","state_code":"TX"},"29779":{"city_id":"05000","neighborhood_id":"29779","neighborhood_name":"Lenox Industrial Park","state_code":"TX"},"29780":{"city_id":"05000","neighborhood_id":"29780","neighborhood_name":"Maple Run","state_code":"TX"},"29781":{"city_id":"05000","neighborhood_id":"29781","neighborhood_name":"Mckinney Park East","state_code":"TX"},"29782":{"city_id":"05000","neighborhood_id":"29782","neighborhood_name":"Meadows Lake","state_code":"TX"},"29783":{"city_id":"05000","neighborhood_id":"29783","neighborhood_name":"Meadows At Double Creek","state_code":"TX"},"29785":{"city_id":"05000","neighborhood_id":"29785","neighborhood_name":"Meridian","state_code":"TX"},"29786":{"city_id":"05000","neighborhood_id":"29786","neighborhood_name":"Mimosa Manor","state_code":"TX"},"29787":{"city_id":"05000","neighborhood_id":"29787","neighborhood_name":"Mrs Rosa J Spillmann Estates","state_code":"TX"},"29788":{"city_id":"05000","neighborhood_id":"29788","neighborhood_name":"Mueller Acres","state_code":"TX"},"29789":{"city_id":"05000","neighborhood_id":"29789","neighborhood_name":"Oak Park Estates","state_code":"TX"},"29790":{"city_id":"05000","neighborhood_id":"29790","neighborhood_name":"Olympic Heights","state_code":"TX"},"29791":{"city_id":"05000","neighborhood_id":"29791","neighborhood_name":"Parkside At Slaughter Creek","state_code":"TX"},"29792":{"city_id":"05000","neighborhood_id":"29792","neighborhood_name":"Pheasant Run","state_code":"TX"},"29793":{"city_id":"05000","neighborhood_id":"29793","neighborhood_name":"Rancho Alto","state_code":"TX"},"29794":{"city_id":"05000","neighborhood_id":"29794","neighborhood_name":"Slaughter/lh-35 Commercial","state_code":"TX"},"29795":{"city_id":"05000","neighborhood_id":"29795","neighborhood_name":"Slaughter South","state_code":"TX"},"29796":{"city_id":"05000","neighborhood_id":"29796","neighborhood_name":"South Brook Center","state_code":"TX"},"29797":{"city_id":"05000","neighborhood_id":"29797","neighborhood_name":"South Creek","state_code":"TX"},"29798":{"city_id":"05000","neighborhood_id":"29798","neighborhood_name":"South Creek South","state_code":"TX"},"29799":{"city_id":"05000","neighborhood_id":"29799","neighborhood_name":"Southampton","state_code":"TX"},"29800":{"city_id":"05000","neighborhood_id":"29800","neighborhood_name":"Southwest Oaks","state_code":"TX"},"29801":{"city_id":"05000","neighborhood_id":"29801","neighborhood_name":"Stablewood At Slaughter Creek","state_code":"TX"},"29802":{"city_id":"05000","neighborhood_id":"29802","neighborhood_name":"Yarrabee Bend","state_code":"TX"},"29803":{"city_id":"05000","neighborhood_id":"29803","neighborhood_name":"Wyldwood","state_code":"TX"},"29804":{"city_id":"05000","neighborhood_id":"29804","neighborhood_name":"Woodstone Village","state_code":"TX"},"29805":{"city_id":"05000","neighborhood_id":"29805","neighborhood_name":"Whispering Oaks","state_code":"TX"},"29806":{"city_id":"05000","neighborhood_id":"29806","neighborhood_name":"Timber Village","state_code":"TX"},"29807":{"city_id":"05000","neighborhood_id":"29807","neighborhood_name":"The Oak At Twin Creeks","state_code":"TX"},"29808":{"city_id":"05000","neighborhood_id":"29808","neighborhood_name":"The Bend At Nuckols Crossing","state_code":"TX"},"29809":{"city_id":"05000","neighborhood_id":"29809","neighborhood_name":"Tanglewood Forest","state_code":"TX"},"29810":{"city_id":"05000","neighborhood_id":"29810","neighborhood_name":"Tanglewood Village","state_code":"TX"},"29811":{"city_id":"05000","neighborhood_id":"29811","neighborhood_name":"Swanson's Ranchettes","state_code":"TX"},"29812":{"city_id":"05000","neighborhood_id":"29812","neighborhood_name":"Sunset","state_code":"TX"},"29813":{"city_id":"05000","neighborhood_id":"29813","neighborhood_name":"Sunridge South","state_code":"TX"},"29814":{"city_id":"05000","neighborhood_id":"29814","neighborhood_name":"Southwest Mediplex","state_code":"TX"},"29815":{"city_id":"05000","neighborhood_id":"29815","neighborhood_name":"Southcross Plaza","state_code":"TX"},"29816":{"city_id":"05000","neighborhood_id":"29816","neighborhood_name":"Silverstone","state_code":"TX"},"29817":{"city_id":"05000","neighborhood_id":"29817","neighborhood_name":"Saddlewood Estates","state_code":"TX"},"29818":{"city_id":"05000","neighborhood_id":"29818","neighborhood_name":"San Antonio Road","state_code":"TX"},"29819":{"city_id":"05000","neighborhood_id":"29819","neighborhood_name":"Shady Hollow Estates","state_code":"TX"},"29820":{"city_id":"05000","neighborhood_id":"29820","neighborhood_name":"Grand Oaks","state_code":"TX"},"29821":{"city_id":"05000","neighborhood_id":"29821","neighborhood_name":"William Cannon Drive","state_code":"TX"},"29822":{"city_id":"05000","neighborhood_id":"29822","neighborhood_name":"Stone Creek Ranch","state_code":"TX"},"29823":{"city_id":"05000","neighborhood_id":"29823","neighborhood_name":"Oak At Twin Creeks","state_code":"TX"},"29824":{"city_id":"05000","neighborhood_id":"29824","neighborhood_name":"Retail","state_code":"TX"},"29825":{"city_id":"05000","neighborhood_id":"29825","neighborhood_name":"Park West At Circle","state_code":"TX"},"29826":{"city_id":"05000","neighborhood_id":"29826","neighborhood_name":"Circle C Golf West Estates","state_code":"TX"},"29827":{"city_id":"05000","neighborhood_id":"29827","neighborhood_name":"Golf Club Estates","state_code":"TX"},"29828":{"city_id":"05000","neighborhood_id":"29828","neighborhood_name":"Deer Park At Maple Run","state_code":"TX"},"29829":{"city_id":"05000","neighborhood_id":"29829","neighborhood_name":"Sendera","state_code":"TX"},"29830":{"city_id":"05000","neighborhood_id":"29830","neighborhood_name":"Akin","state_code":"TX"},"29831":{"city_id":"05000","neighborhood_id":"29831","neighborhood_name":"Mission Bethany","state_code":"TX"},"29832":{"city_id":"05000","neighborhood_id":"29832","neighborhood_name":"Ccr","state_code":"TX"},"29833":{"city_id":"05000","neighborhood_id":"29833","neighborhood_name":"Southland Oaks","state_code":"TX"},"29834":{"city_id":"05000","neighborhood_id":"29834","neighborhood_name":"Saddle Creek","state_code":"TX"},"29835":{"city_id":"05000","neighborhood_id":"29835","neighborhood_name":"Comal Bluff","state_code":"TX"},"29836":{"city_id":"05000","neighborhood_id":"29836","neighborhood_name":"Windcrest Crossing","state_code":"TX"},"29837":{"city_id":"05000","neighborhood_id":"29837","neighborhood_name":"Onion Creek Forest","state_code":"TX"},"29838":{"city_id":"05000","neighborhood_id":"29838","neighborhood_name":"Circle C Ranch","state_code":"TX"},"29839":{"city_id":"05000","neighborhood_id":"29839","neighborhood_name":"The Hielscher","state_code":"TX"},"29840":{"city_id":"05000","neighborhood_id":"29840","neighborhood_name":"Parkwood","state_code":"TX"},"29841":{"city_id":"05000","neighborhood_id":"29841","neighborhood_name":"Bauerle Ranch","state_code":"TX"},"29842":{"city_id":"05000","neighborhood_id":"29842","neighborhood_name":"The Hollow At Slaughter Creek","state_code":"TX"},"29843":{"city_id":"05000","neighborhood_id":"29843","neighborhood_name":"Nuckles Crossing","state_code":"TX"},"29844":{"city_id":"05000","neighborhood_id":"29844","neighborhood_name":"Blue Hills Estates","state_code":"TX"},"29845":{"city_id":"05000","neighborhood_id":"29845","neighborhood_name":"Cherry Creek","state_code":"TX"},"29846":{"city_id":"05000","neighborhood_id":"29846","neighborhood_name":"Nelms","state_code":"TX"},"29847":{"city_id":"05000","neighborhood_id":"29847","neighborhood_name":"Oak Creek Parke","state_code":"TX"},"29848":{"city_id":"05000","neighborhood_id":"29848","neighborhood_name":"Onion Creek","state_code":"TX"},"29849":{"city_id":"05000","neighborhood_id":"29849","neighborhood_name":"Shiloh","state_code":"TX"},"29850":{"city_id":"05000","neighborhood_id":"29850","neighborhood_name":"South Bend","state_code":"TX"},"29851":{"city_id":"05000","neighborhood_id":"29851","neighborhood_name":"Max Keilbar","state_code":"TX"},"29852":{"city_id":"05000","neighborhood_id":"29852","neighborhood_name":"Harris Ranch","state_code":"TX"},"29853":{"city_id":"05000","neighborhood_id":"29853","neighborhood_name":"Elm Wood Estates","state_code":"TX"},"29854":{"city_id":"05000","neighborhood_id":"29854","neighborhood_name":"Davis Lane Improvement","state_code":"TX"},"29855":{"city_id":"05000","neighborhood_id":"29855","neighborhood_name":"Village At Western Oaks","state_code":"TX"},"29856":{"city_id":"05000","neighborhood_id":"29856","neighborhood_name":"The Shops At Slaughter Creek North","state_code":"TX"},"29857":{"city_id":"05000","neighborhood_id":"29857","neighborhood_name":"Shops At Slaughter Creek South","state_code":"TX"},"29858":{"city_id":"05000","neighborhood_id":"29858","neighborhood_name":"Barker Ranch At Shady Hollow","state_code":"TX"},"29859":{"city_id":"05000","neighborhood_id":"29859","neighborhood_name":"The Ridge At Thomas Springs","state_code":"TX"},"29860":{"city_id":"05000","neighborhood_id":"29860","neighborhood_name":"Deer Haven","state_code":"TX"},"29861":{"city_id":"05000","neighborhood_id":"29861","neighborhood_name":"Sendera South","state_code":"TX"},"29862":{"city_id":"05000","neighborhood_id":"29862","neighborhood_name":"Ford Oaks","state_code":"TX"},"29863":{"city_id":"05000","neighborhood_id":"29863","neighborhood_name":"Sandahl","state_code":"TX"},"29864":{"city_id":"05000","neighborhood_id":"29864","neighborhood_name":"Crossing At Onion Creeek","state_code":"TX"},"29865":{"city_id":"05000","neighborhood_id":"29865","neighborhood_name":"Dittmar At Copper","state_code":"TX"},"29866":{"city_id":"05000","neighborhood_id":"29866","neighborhood_name":"Circle C","state_code":"TX"},"29867":{"city_id":"05000","neighborhood_id":"29867","neighborhood_name":"Beaconridge West","state_code":"TX"},"29868":{"city_id":"05000","neighborhood_id":"29868","neighborhood_name":"South Congress","state_code":"TX"},"29869":{"city_id":"05000","neighborhood_id":"29869","neighborhood_name":"Oakvalley Park","state_code":"TX"},"29870":{"city_id":"05000","neighborhood_id":"29870","neighborhood_name":"Centennial Park","state_code":"TX"},"29871":{"city_id":"05000","neighborhood_id":"29871","neighborhood_name":"Buckingham Estates","state_code":"TX"},"29872":{"city_id":"05000","neighborhood_id":"29872","neighborhood_name":"Shady Hollow","state_code":"TX"},"29873":{"city_id":"05000","neighborhood_id":"29873","neighborhood_name":"Palamino Park","state_code":"TX"},"29874":{"city_id":"05000","neighborhood_id":"29874","neighborhood_name":"Great Oaks At Slaughter Creek","state_code":"TX"},"29875":{"city_id":"05000","neighborhood_id":"29875","neighborhood_name":"Hillcrest","state_code":"TX"},"29876":{"city_id":"05000","neighborhood_id":"29876","neighborhood_name":"Southhampton Hills","state_code":"TX"},"29877":{"city_id":"05000","neighborhood_id":"29877","neighborhood_name":"Springfield At Thaxton Road","state_code":"TX"},"29879":{"city_id":"05000","neighborhood_id":"29879","neighborhood_name":"Bannockburn","state_code":"TX"},"29880":{"city_id":"05000","neighborhood_id":"29880","neighborhood_name":"Canterbury Trails","state_code":"TX"},"29881":{"city_id":"05000","neighborhood_id":"29881","neighborhood_name":"Blackhawk","state_code":"TX"},"29882":{"city_id":"05000","neighborhood_id":"29882","neighborhood_name":"Riddle Road Duplexes","state_code":"TX"},"29883":{"city_id":"05000","neighborhood_id":"29883","neighborhood_name":"Sage Meadow","state_code":"TX"},"29884":{"city_id":"05000","neighborhood_id":"29884","neighborhood_name":"Southpark Meadows","state_code":"TX"},"29885":{"city_id":"05000","neighborhood_id":"29885","neighborhood_name":"Plaza At Slaughter Creek","state_code":"TX"},"29886":{"city_id":"05000","neighborhood_id":"29886","neighborhood_name":"Circle S Ridge","state_code":"TX"},"29887":{"city_id":"05000","neighborhood_id":"29887","neighborhood_name":"The Reserve At Slaughter Creek","state_code":"TX"},"29888":{"city_id":"05000","neighborhood_id":"29888","neighborhood_name":"Deerfield At Brodie","state_code":"TX"},"29889":{"city_id":"05000","neighborhood_id":"29889","neighborhood_name":"Cooper Lane","state_code":"TX"},"29890":{"city_id":"05000","neighborhood_id":"29890","neighborhood_name":"Damon","state_code":"TX"},"29891":{"city_id":"05000","neighborhood_id":"29891","neighborhood_name":"Beacon Ridge","state_code":"TX"},"29892":{"city_id":"05000","neighborhood_id":"29892","neighborhood_name":"Parkridge Gardens","state_code":"TX"},"29893":{"city_id":"05000","neighborhood_id":"29893","neighborhood_name":"Woodhaven","state_code":"TX"},"33690":{"city_id":"05000","neighborhood_id":"33690","neighborhood_name":"North Park","state_code":"TX"},"6090":{"city_id":"05000","neighborhood_id":"6090","neighborhood_name":"Allandale","state_code":"TX"},"6091":{"city_id":"05000","neighborhood_id":"6091","neighborhood_name":"Barton Hills","state_code":"TX"},"6092":{"city_id":"05000","neighborhood_id":"6092","neighborhood_name":"Bouldin","state_code":"TX"},"6093":{"city_id":"05000","neighborhood_id":"6093","neighborhood_name":"Brentwood","state_code":"TX"},"6094":{"city_id":"05000","neighborhood_id":"6094","neighborhood_name":"Central East Austin","state_code":"TX"},"6095":{"city_id":"05000","neighborhood_id":"6095","neighborhood_name":"Chestnut","state_code":"TX"},"6096":{"city_id":"05000","neighborhood_id":"6096","neighborhood_name":"Coronado Hills","state_code":"TX"},"6097":{"city_id":"05000","neighborhood_id":"6097","neighborhood_name":"Crestview","state_code":"TX"},"6098":{"city_id":"05000","neighborhood_id":"6098","neighborhood_name":"Dawson","state_code":"TX"},"6099":{"city_id":"05000","neighborhood_id":"6099","neighborhood_name":"Downtown","state_code":"TX"},"6100":{"city_id":"05000","neighborhood_id":"6100","neighborhood_name":"East Cesar Chavez","state_code":"TX"},"6101":{"city_id":"05000","neighborhood_id":"6101","neighborhood_name":"East Congress","state_code":"TX"},"6102":{"city_id":"05000","neighborhood_id":"6102","neighborhood_name":"East Oak Hill","state_code":"TX"},"6103":{"city_id":"05000","neighborhood_id":"6103","neighborhood_name":"Franklin Park","state_code":"TX"},"6104":{"city_id":"05000","neighborhood_id":"6104","neighborhood_name":"Galindo","state_code":"TX"},"6105":{"city_id":"05000","neighborhood_id":"6105","neighborhood_name":"Garrison Park","state_code":"TX"},"6106":{"city_id":"05000","neighborhood_id":"6106","neighborhood_name":"Gateway","state_code":"TX"},"6107":{"city_id":"05000","neighborhood_id":"6107","neighborhood_name":"Georgian Acres","state_code":"TX"},"6108":{"city_id":"05000","neighborhood_id":"6108","neighborhood_name":"Govalle","state_code":"TX"},"6109":{"city_id":"05000","neighborhood_id":"6109","neighborhood_name":"Hancock","state_code":"TX"},"6110":{"city_id":"05000","neighborhood_id":"6110","neighborhood_name":"Heritage Hills","state_code":"TX"},"6111":{"city_id":"05000","neighborhood_id":"6111","neighborhood_name":"Highland","state_code":"TX"},"6112":{"city_id":"05000","neighborhood_id":"6112","neighborhood_name":"Holly","state_code":"TX"},"6113":{"city_id":"05000","neighborhood_id":"6113","neighborhood_name":"Hyde Park","state_code":"TX"},"6114":{"city_id":"05000","neighborhood_id":"6114","neighborhood_name":"Johnston Terrace","state_code":"TX"},"6115":{"city_id":"05000","neighborhood_id":"6115","neighborhood_name":"McKinney","state_code":"TX"},"6116":{"city_id":"05000","neighborhood_id":"6116","neighborhood_name":"MLK","state_code":"TX"},"6117":{"city_id":"05000","neighborhood_id":"6117","neighborhood_name":"MLK-183","state_code":"TX"},"6118":{"city_id":"05000","neighborhood_id":"6118","neighborhood_name":"Montropolis","state_code":"TX"},"6119":{"city_id":"05000","neighborhood_id":"6119","neighborhood_name":"North Austin Civic Association","state_code":"TX"},"6120":{"city_id":"05000","neighborhood_id":"6120","neighborhood_name":"North Burnet","state_code":"TX"},"6121":{"city_id":"05000","neighborhood_id":"6121","neighborhood_name":"North Lamar","state_code":"TX"},"6122":{"city_id":"05000","neighborhood_id":"6122","neighborhood_name":"North Loop","state_code":"TX"},"6123":{"city_id":"05000","neighborhood_id":"6123","neighborhood_name":"North Shoal Creek","state_code":"TX"},"6124":{"city_id":"05000","neighborhood_id":"6124","neighborhood_name":"North University","state_code":"TX"},"6125":{"city_id":"05000","neighborhood_id":"6125","neighborhood_name":"Old West Austin","state_code":"TX"},"6126":{"city_id":"05000","neighborhood_id":"6126","neighborhood_name":"Parker Lane","state_code":"TX"},"6127":{"city_id":"05000","neighborhood_id":"6127","neighborhood_name":"Pecan Springs Springdale","state_code":"TX"},"6128":{"city_id":"05000","neighborhood_id":"6128","neighborhood_name":"Pleasant Valley","state_code":"TX"},"6129":{"city_id":"05000","neighborhood_id":"6129","neighborhood_name":"Riverside","state_code":"TX"},"6130":{"city_id":"05000","neighborhood_id":"6130","neighborhood_name":"RMMA","state_code":"TX"},"6131":{"city_id":"05000","neighborhood_id":"6131","neighborhood_name":"Rosedale","state_code":"TX"},"6132":{"city_id":"05000","neighborhood_id":"6132","neighborhood_name":"Rosewood","state_code":"TX"},"6133":{"city_id":"05000","neighborhood_id":"6133","neighborhood_name":"South Lamar","state_code":"TX"},"6134":{"city_id":"05000","neighborhood_id":"6134","neighborhood_name":"South Manchaca","state_code":"TX"},"6135":{"city_id":"05000","neighborhood_id":"6135","neighborhood_name":"South River City","state_code":"TX"},"6136":{"city_id":"05000","neighborhood_id":"6136","neighborhood_name":"Southeast","state_code":"TX"},"6137":{"city_id":"05000","neighborhood_id":"6137","neighborhood_name":"St. Edwards","state_code":"TX"},"6138":{"city_id":"05000","neighborhood_id":"6138","neighborhood_name":"St. Johns","state_code":"TX"},"6139":{"city_id":"05000","neighborhood_id":"6139","neighborhood_name":"Sweetbriar","state_code":"TX"},"6140":{"city_id":"05000","neighborhood_id":"6140","neighborhood_name":"Triangle State","state_code":"TX"},"6141":{"city_id":"05000","neighborhood_id":"6141","neighborhood_name":"University Hills","state_code":"TX"},"6142":{"city_id":"05000","neighborhood_id":"6142","neighborhood_name":"University of Texas - Austin","state_code":"TX"},"6143":{"city_id":"05000","neighborhood_id":"6143","neighborhood_name":"Upper Boggy Creek","state_code":"TX"},"6144":{"city_id":"05000","neighborhood_id":"6144","neighborhood_name":"West Congress","state_code":"TX"},"6145":{"city_id":"05000","neighborhood_id":"6145","neighborhood_name":"West Oak Hill","state_code":"TX"},"6146":{"city_id":"05000","neighborhood_id":"6146","neighborhood_name":"West University","state_code":"TX"},"6147":{"city_id":"05000","neighborhood_id":"6147","neighborhood_name":"Westgate","state_code":"TX"},"6148":{"city_id":"05000","neighborhood_id":"6148","neighborhood_name":"Windsor Hills","state_code":"TX"},"6149":{"city_id":"05000","neighborhood_id":"6149","neighborhood_name":"Windsor Park","state_code":"TX"},"6150":{"city_id":"05000","neighborhood_id":"6150","neighborhood_name":"Windsor Road","state_code":"TX"},"6151":{"city_id":"05000","neighborhood_id":"6151","neighborhood_name":"Wooten","state_code":"TX"},"6152":{"city_id":"05000","neighborhood_id":"6152","neighborhood_name":"Zilker","state_code":"TX"}},"stats":{"48":{"avg_listing_price":"1008492","city_id":"05000","id":48,"med_listing_price":"482866","num_properties":"1497","property_type":"All Properties","week_of":"2016-03-12"},"49":{"avg_listing_price":"380986","city_id":"05000","id":49,"med_listing_price":"297693","num_properties":"28","property_type":"1 Bedroom Properties","week_of":"2016-03-12"},"50":{"avg_listing_price":"451373","city_id":"05000","id":50,"med_listing_price":"383435","num_properties":"100","property_type":"2 Bedroom Properties","week_of":"2016-03-12"},"51":{"avg_listing_price":"589139","city_id":"05000","id":51,"med_listing_price":"403899","num_properties":"481","property_type":"3 Bedroom Properties","week_of":"2016-03-12"},"52":{"avg_listing_price":"842246","city_id":"05000","id":52,"med_listing_price":"460005","num_properties":"596","property_type":"4 Bedroom Properties","week_of":"2016-03-12"},"53":{"avg_listing_price":"1524909","city_id":"05000","id":53,"med_listing_price":"967686","num_properties":"212","property_type":"5 Bedroom Properties","week_of":"2016-03-12"},"54":{"avg_listing_price":"4682337","city_id":"05000","id":54,"med_listing_price":"3147143","num_properties":"35","property_type":"6 Bedroom Properties","week_of":"2016-03-12"},"55":{"avg_listing_price":"7125791","city_id":"05000","id":55,"med_listing_price":"4478571","num_properties":"13","property_type":"7 Bedroom Properties","week_of":"2016-03-12"},"56":{"avg_listing_price":"9999000","city_id":"05000","id":56,"med_listing_price":"9999000","num_properties":"2","property_type":"8 Bedroom Properties","week_of":"2016-03-12"},"57":{"avg_listing_price":"4839286","city_id":"05000","id":57,"med_listing_price":"4839286","num_properties":"2","property_type":"9 Bedroom Properties","week_of":"2016-03-12"},"58":{"avg_listing_price":"1121668","city_id":"05000","id":58,"med_listing_price":"514670","num_properties":"1064","property_type":"All Properties","week_of":"2016-03-19"},"59":{"avg_listing_price":"367443","city_id":"05000","id":59,"med_listing_price":"250000","num_properties":"19","property_type":"1 Bedroom Properties","week_of":"2016-03-19"},"60":{"avg_listing_price":"522402","city_id":"05000","id":60,"med_listing_price":"395600","num_properties":"53","property_type":"2 Bedroom Properties","week_of":"2016-03-19"},"61":{"avg_listing_price":"640076","city_id":"05000","id":61,"med_listing_price":"435888","num_properties":"324","property_type":"3 Bedroom Properties","week_of":"2016-03-19"},"62":{"avg_listing_price":"910047","city_id":"05000","id":62,"med_listing_price":"462995","num_properties":"436","property_type":"4 Bedroom Properties","week_of":"2016-03-19"},"63":{"avg_listing_price":"1592174","city_id":"05000","id":63,"med_listing_price":"1148248","num_properties":"168","property_type":"5 Bedroom Properties","week_of":"2016-03-19"},"64":{"avg_listing_price":"4448251","city_id":"05000","id":64,"med_listing_price":"3396250","num_properties":"31","property_type":"6 Bedroom Properties","week_of":"2016-03-19"},"65":{"avg_listing_price":"7480129","city_id":"05000","id":65,"med_listing_price":"6506000","num_properties":"12","property_type":"7 Bedroom Properties","week_of":"2016-03-19"},"66":{"avg_listing_price":"3500000","city_id":"05000","id":66,"med_listing_price":"3500000","num_properties":"2","property_type":"9 Bedroom Properties","week_of":"2016-03-19"}}};
    //initializing function: make API call, then parse data;
    var init = function() {
      dataService.callAPI().then(function(data){buildData(data);setupPagination();}, function(data) {alert(data);buildData(test_object);setupPagination();});
    };
    init();
  }]);

  app.controller('neighborhoodModelController',['$scope', '$routeParams', 'dataService', '$sce', function($scope, $routeParams, dataService, $sce){
    $scope.data = {};
    //current week shown
    $scope.week = null;
    //array of possible weeks, based on API response; used for select;
    $scope.weeks = [];
    //thinking ahead; can tie to radio buttons, to filter via ng-show
    $scope.filterOptions = {};
    //accepts data from API call to states (via dataService); parses into $scope.data for use by state_model page
    var buildData = function(data) {
      //reset
      $scope.data = {};
      $scope.week = null;
      $scope.weeks = [];
      $scope.filterOptions = {};
      //used for getting weeks: keys are a set;
      var temp = {};
      //initialize data subcategories
      //key different vs state model ('cityId' vs 'stateCode') [sill primary key]
      $scope.data['neighborhoodId'] = $routeParams['neighborhoodId'];
      $scope.data['neighborhoodName'] = $scope.neighborhoodIdToName[$routeParams['neighborhoodId']];
      $scope.data['propertyStats'] = [];
      $scope.data['neighborhoods'] = [];
      //go through stats; can compress into fewer vars
      //identical to state model
      for (var key in data['stats']) {
        var newRow = {};
        var weekOf = data['stats'][key]['week_of'];
        var propertyType = data['stats'][key]['property_type'];
        var avg = data['stats'][key]['avg_listing_price'];
        var med = data['stats'][key]['med_listing_price'];
        var num = data['stats'][key]['num_properties'];
        temp[weekOf] = true;
        newRow['week'] = weekOf;
        newRow['type'] = propertyType;
        newRow['average'] = Number(avg);
        newRow['median'] = Number(med);
        newRow['numProps'] = Number(num);
        //append to array for use in stats table
        $scope.data['propertyStats'].push(newRow);
      };
      //key different vs city/state model (none vs 'neighborhoods' vs 'cities')
      // for (var key in data['neighborhoods']) {
      //   //append to array for use by cities table
      //   $scope.data['neighborhoods'].push(data['neighborhoods'][key]['neighborhood_name']);
      //   $scope.data['stateCode'] = data['neighborhoods'][key]['state_code'];
      // };
      //go through keys of stats for filter radio
      for(var key in $scope.data['propertyStats'][0]) {
        $scope.filterOptions[key] = true;
      };
      //go through temp keys (set), push to array;
      for(var key in temp) {
        $scope.weeks.push(key);
      };
      //set current week to last pushed; should be most recent, based on API
      $scope.week = $scope.weeks[$scope.weeks.length - 1];
    };
    //print data to console for review
    this.printData = function(){
      console.log($scope.data);
      console.log($scope.filterOptions);
      console.log($scope.week);
    };
    //FROM HERE ########################
    $scope.sort = {
      by: 'type',
      descending: false
    };
    this.showRow = function(row) {
      // console.log(row);
      return $scope.week === row['week'];
    };
    //used to update/set sort values
    this.sortBy = function(col) {
      if ($scope.sort['by'] === col) {
        $scope.sort['descending'] = !$scope.sort['descending'];
      } else {
        $scope.sort['by'] = col;
        $scope.sort['descending'] = false;
      }
    };
    //used by ng-show, for chevron on column
    this.sortedBy = function(col) {
      return $scope.sort['by'] === col;
    };
    //used by ng-class, for chevron direction
    this.isDescending = function() {
      return $scope.sort['descending'];
    };
    //TO HERE ########################## is VERY repetitive code (copy-paste, with minor changes)
    //for map
    //query is unique, but the rest is identical
    this.setNeighborhoodMapUrl = function() {
      var embedKey = "AIzaSyC5xVHl08OeT9jM4q_lwfY30IYPf3Jd3B0"
      var q = $scope.data['neighborhoodName'] + ',+' + $scope.data['cityName'] + ',+' + $scope.data['stateCode'];
      var src = "https://www.google.com/maps/embed/v1/place?key="
      src += embedKey;
      src += "&q=";
      src += q;
      console.log(src);
      // var x ="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6509713.084021231!2d-123.77347912442343!3d37.1866687017569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb9fe5f285e3d%3A0x8b5109a227086f55!2sCalifornia!5e0!3m2!1sen!2sus!4v1458871633347"
      return $sce.trustAsResourceUrl(src);
    };

  //test object, for when api call fails
  var test_object = {};
  //initializing function: make API call, then parse data;
  var init = function() {
    dataService.callAPI().then(function(data){buildData(data);}, function(data) {alert(data);buildData(test_object);});
  };
  init();
}]);

  //control states table page
  app.controller('statesController',['$scope', 'dataService', function($scope, dataService){
    //used to control table sorting through orderBy
    $scope.sort = {
      by: 'name',
      descending: false
    };
    //used to update/set sort values
    this.sortBy = function(col) {
      if ($scope.sort['by'] === col) {
        $scope.sort['descending'] = !$scope.sort['descending'];
      } else {
        $scope.sort['by'] = col;
        $scope.sort['descending'] = false;
      }
    };
    //used by ng-show, for chevron on column
    this.sortedBy = function(col) {
      return $scope.sort['by'] === col;
    };
    //used by ng-class, for chevron direction
    this.isDescending = function() {
      return $scope.sort['descending'];
    };
    //initializing function. sets scope data after resolving promise
    var buildRows = function(data) {
      $scope.rows = [];
      for (var key in data) {
        var row = {};
        row['name'] = data[key]['state_name'];
        row['stateCode'] = data[key]['state_code'];
        $scope.rows.push(row);
      };
    };
    var init = function() {
      dataService.callAPI().then(function(data){buildRows(data);},function(data){alert(data);});
    };
    init();
  }]);

  //controller for the citites page
  app.controller('citiesController',['$scope', 'dataService', function($scope, dataService){
    //used to control table sorting through orderBy
    $scope.sort = {
      by: 'name',
      descending: false
    };
    //used to update/set sort values
    this.sortBy = function(col) {
      if ($scope.sort['by'] === col) {
        $scope.sort['descending'] = !$scope.sort['descending'];
      } else {
        $scope.sort['by'] = col;
        $scope.sort['descending'] = false;
      }
    };
    //used by ng-show, for chevron on column
    this.sortedBy = function(col) {
      return $scope.sort['by'] === col;
    };
    //used by ng-class, for chevron direction
    this.isDescending = function() {
      return $scope.sort['descending'];
    };
    var buildRows = function(data) {
      $scope.rows = [];
      for (var key in data) {
        var row = {};
        row['cityId'] = data[key]['city_id'];
        row['name'] = data[key]['city_name'];
        row['stateCode'] = data[key]['state_code'];
        $scope.rows.push(row);
      };
    };
    //initializing function. sets scope data after resolving promise
    var init = function() {
      dataService.callAPI().then(function(data){buildRows(data);},function(data){alert(data);});
    }
    init();
  }]);

  app.controller('neighborhoodsController',['$scope', 'dataService', function($scope, dataService){
    //used to control table sorting through orderBy
    $scope.sort = {
      by: 'name',
      descending: false
    };
    //used to update/set sort values
    this.sortBy = function(col) {
      if ($scope.sort['by'] === col) {
        $scope.sort['descending'] = !$scope.sort['descending'];
      } else {
        $scope.sort['by'] = col;
        $scope.sort['descending'] = false;
      }
    };
    //used by ng-show, for chevron on column
    this.sortedBy = function(col) {
      return $scope.sort['by'] === col;
    };
    //used by ng-class, for chevron direction
    this.isDescending = function() {
      return $scope.sort['descending'];
    };
    //PAGINATION START
    $scope.pagination = {};
    var setupPagination = function(){
      $scope.pagination = {};
      $scope.pagination['numPerPage'] = 20;
      $scope.pagination['currentPage'] = 0;
      $scope.pagination['array'] = new Array(Math.ceil($scope.rows.length/$scope.pagination.numPerPage));
      console.log($scope.pagination);
    };
    this.setPage = function(num){
      if(num >= 0 && num < $scope.pagination['array'].length) {
        $scope.pagination['currentPage'] = Number(num);
      };
      console.log($scope.pagination['currentPage']);
    };
    this.showIndex = function(index) {
      var base = ($scope.pagination['currentPage']*$scope.pagination['numPerPage']);
      return base <= index && index < (base + $scope.pagination['numPerPage']);
    };
    //PAGINATION END
    $scope.rows = [];
    // var rowsHelper = function(data) {
    //   for (var row in data['neighborhoods']) {
    //     var newRow = data['neighborhoods'][row];
    //     newRow['cityName'] = $scope.cityIdToName[data['neighborhoods'][row]['city']];
    //     // console.log(newRow);
    //     $scope.rows.push(newRow);
    //   };
    //   console.log($scope.rows);
    // };
    var buildRows = function(data) {
      $scope.rows = [];
      for (var key in data) {
        var row = {};
        row['id'] = data[key]['neighborhood_id'];
        row['name'] = data[key]['neighborhood_name'];
        row['cityId'] = data[key]['city_id'];
        row['stateCode'] = data[key]['state_code'];
        $scope.rows.push(row);
      };
    };
    //initializing function. sets scope data after resolving promise
    var init = function() {
      dataService.callAPI().then(function(data){buildRows(data);setupPagination();},function(data){alert(data);});
    }
    init();
  }]);

  // app.service('searchService',['$q','$http', '$routeParams', function($q,$http,$routeParams){
  //
  // }]);

  //service to actually call API and manage the data
  //following example at http://tylermcginnis.com/angularjs-factory-vs-service-vs-provider/ for design
  app.service('dataService', ['$q','$http', '$location', '$sce', function($q,$http,$location,$sce){
    // var baseUrl = 'http://192.168.99.100';
    var baseUrl = '';
    var apiExtension = '/api';
    // var apiExtension = '/json_data';
    var jsonUrl = '';
    var makeJsonUrl = function() {
      jsonUrl = baseUrl + apiExtension + $location.path();
      // jsonUrl = baseUrl + apiExtension + $location.path() + '.json';
      return jsonUrl;
    };
    this.data = {};
    this.callAPI = function(){
      makeJsonUrl();
      var deferred = $q.defer();
      console.log("calling API at: " + jsonUrl);
      $http.get(jsonUrl).then(
        //success
        function(response){
          console.log(response);
          console.log(response.data);
          this.data = response.data;
          deferred.resolve(response.data);
        }
        , //failure
        function(response){
          console.log("api call failed on: " + jsonUrl);
          console.log(response);
          deferred.reject("api call failed on: " + jsonUrl);
        }
      );
      return deferred.promise;
    };
  }]);
  //used for mapping IDs to names, for table readability
  app.service('idMappingService',['$q','$http', '$location', '$rootScope', function($q,$http,$location,$rootScope){
    var dataGetHelper = function(url) {
      var deferred = $q.defer();
      $http.get(url).then(
      // $http.get('/json_data/cities.json').then(
        //success
        function(response){
          this.data = response.data;
          deferred.resolve(response.data);
        }
        , //failure
        function(response){
          deferred.reject("api call failed on: " + jsonUrl);
        }
      )
      return deferred.promise;
    };
    //attached to rootScope, so all views can use it.
    $rootScope.neighborhoodIdToName = {};
    $rootScope.cityIdToName = {};
    $rootScope.stateIdToName = {};
    var idToName = function(topLevelName, idTag, nameTag){
      this.cityIdToName = {};
      //update this later
      dataGetHelper('/json_data/'+topLevelName+'.json').then(
        function(data){
          // console.log(data);
          for (var i = 0; i < data[topLevelName].length; i += 1 ) {
            // console.log(data[topLevelName][i][idTag]);
            var id = data[topLevelName][i][idTag];
            // console.log(data[topLevelName][i][nameTag]);
            var name = data[topLevelName][i][nameTag];
            if(topLevelName === "states") $rootScope.stateIdToName[id] = name;
            if(topLevelName === "cities") $rootScope.cityIdToName[id] = name;
            if(topLevelName === "neighborhoods") $rootScope.neighborhoodIdToName[id] = name;
          };

        }, function(data){
          alert(data)
        });
    };
    idToName('cities','cityId','name');
    idToName('neighborhoods','id','name');
    idToName('states','stateCode','name');
    // console.log($rootScope.cityIdToName);
  }]);
})();
