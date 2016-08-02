angular.module('app.controllers', [/*'ngMap'*/]);
angular.module('app.services', []);
angular.module('app.directives', []);

angular.module('app', ['ui.router', 'ngSanitize', 'app.controllers', 'app.services', 'ngMap', 'ui.bootstrap', 'ngLoadingSpinner', 'bootstrapLightbox'])

.constant('API_URL', 'https://api.jound.mx')
//.constant('API_URL', 'http://localhost:4000')
.constant('APP_ID', '23495f01-e732-4fdf-bf13-ae569874ea2e')
.constant('JS_KEY', '5bfd0836-0ed7-4f6f-a44f-3cc6d0d0ce51')
.constant('GOOGLE_MAPS_API_URL', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBLxDjNxa5ofqWGp23ph0o_MRZCfwB4kZc&libraries=places')
.constant('DEFAULT_CENTER', { latitude: 29.07697928382566, longitude: -110.95651744374997 })
.constant('DEFAULT_RANGE', 2000)
.constant('YOUTUBE_CHANNEL', 'UCD2u-K-_qLCl_1L2wc5dVyw')//
.constant('FLICKR_ID', '142505054@N08')//
.constant('INSTAGRAM_ID', '3132274205')
.constant('TWITTER_NAME', '@festivalpitic')
.constant('VALID_FILTERS', 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789')
.constant('GEO_DEFAULT_SETTINGS', {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
})
.constant('CATEGOTY_ID', 'iRngPfNMuL')
.run(function($http, APP_ID, JS_KEY, $templateCache, $rootScope, $window, $timeout) {
    $http.defaults.headers.common['X-Parse-Application-Id'] = APP_ID;
    $http.defaults.headers.common['X-Parse-Javascript-Key'] = JS_KEY;

    $templateCache.put('lightbox.html',
      "<div class=modal-body ng-swipe-left=Lightbox.nextImage() ng-swipe-right=Lightbox.prevImage()><div class=lightbox-nav><button class=close aria-hidden=true ng-click=$dismiss()>×</button><div class=btn-group ng-if=\"Lightbox.images.length > 1\"><a class=\"btn btn-xs btn-default\" ng-click=Lightbox.prevImage()>‹ Anterior</a> <a ng-href={{Lightbox.imageUrl}} target=_blank class=\"btn btn-xs btn-default\" title=\"Open in new tab\">Ver imagén en una pestaña nueva</a> <a class=\"btn btn-xs btn-default\" ng-click=Lightbox.nextImage()>Siguiente ›</a></div></div><div class=lightbox-image-container><div class=lightbox-image-caption><span>{{Lightbox.imageCaption}}</span></div><img ng-if=!Lightbox.isVideo(Lightbox.image) lightbox-src={{Lightbox.imageUrl}}><div ng-if=Lightbox.isVideo(Lightbox.image) class=\"embed-responsive embed-responsive-16by9\"><video ng-if=!Lightbox.isSharedVideo(Lightbox.image) lightbox-src={{Lightbox.imageUrl}} controls autoplay></video><embed-video ng-if=Lightbox.isSharedVideo(Lightbox.image) lightbox-src={{Lightbox.imageUrl}} ng-href={{Lightbox.imageUrl}} iframe-id=lightbox-video class=embed-responsive-item><a ng-href={{Lightbox.imageUrl}}>Watch video</a></embed-video></div></div></div>"
    );

    $rootScope.LAYOUT = window.LAYOUT;

    $rootScope.$on("$stateChangeStart", function (event, currentState, previousState) {
        $timeout(function(){
            $rootScope.$apply(function(){
                $rootScope.spinnerActive = true;
            });
        });
    });

    $rootScope.$on("$stateChangeSuccess", function (event, currentState, previousState) {
        $timeout(function(){
            $rootScope.$apply(function(){
                $window.scrollTo(0, 0);
                $rootScope.spinnerActive = false;
            });
        });
    });
})

.factory('$localStorage', ['$window', function($window) {
    return {
        set: function(key, value) {
            $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key) {
            return JSON.parse($window.localStorage[key] || '{}');
        },
        removeItem: function(item){
            $window.localStorage.removeItem(item);
        }
    }
}])


.config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
    $stateProvider

        .state('app', {
            url: '',
            abstract: true,
            controller: 'AppCtrl',
            views: {
                'menu': {
                    templateUrl: 'templates/menu.html'
                },
                'footer': {
                    templateUrl: 'templates/footer.html'
                }
            }
        })

        .state('app.home', {
            url: '/home',
            views: {
                'mainContent@': {
                    templateUrl: 'templates/home.html',
                    controller: 'HomeCtrl'
                },
                'heading@': {
                    templateUrl: 'templates/video.html'
                }
            },
            resolve: {
                items: function(ArtistService, AnalyticsService){
                    return ArtistService
                        .fetch(true)
                        .then(function(r){
                            AnalyticsService.track('fetch', {collection: 'Event', query: {featured: true}});
                            return r;
                        }, function(e){
                            AnalyticsService.track('error', {collection: 'Event', query: {featured: true}, error: e});
                            return e;
                        });
                }
            }
        })

        .state('app.history', {
            url: '/historia',
            views: {
                'mainContent@': {
                    templateUrl: 'templates/history.html',
                    controller: 'HistoryCtrl'
                }
            }
        })

        .state('app.hmo', {
            url: '/hmo',
            views: {
                'mainContent@': {
                    templateUrl: 'templates/hermosillo.html',
                    controller: 'HmoCtrl'
                }
            }
        })

        .state('app.fip', {
            url: '/festival',
            views: {
                'mainContent@': {
                    templateUrl: 'templates/fip.html',
                    controller: 'FIPCtrl'
                }
            }
        })

        .state('app.artists', {
            url: '/artistas',
            views: {
                'mainContent@': {
                    templateUrl: 'templates/artists.html',
                    controller: 'ArtistsCtrl'
                }
            },
            resolve: {
                items: function(ArtistService, AnalyticsService){
                    return ArtistService
                        .fetch()
                        .then(function(r){
                            AnalyticsService.track('fetch', {collection: 'Event'});
                            return r;
                        }, function(e){
                            AnalyticsService.track('error', {collection: 'Event', error: e});
                            return e;
                        });
                }
            }
        })

        .state('app.artist', {
            url: '/artistas/:slug-:id',
            views: {
                'mainContent@': {
                    templateUrl: 'templates/artist.html',
                    controller: 'ArtistCtrl'
                }
            },
            resolve: {
                item: function(ArtistService, AnalyticsService, $stateParams){
                    return ArtistService
                        .getById($stateParams.id)
                        .then(function(e){
                            AnalyticsService.track('fetch', {collection: 'Event', query: {_id: $stateParams.id}});
                            return e;
                        }, function(e){
                            AnalyticsService.track('error', {collection: 'Event', error: e});
                            return e;
                        })
                }
            }
        })

        .state('app.map', {
            url: '/mapa',
            views: {
                'mainContent@': {
                    templateUrl: 'templates/map.html',
                    controller: 'MapCtrl'
                }
            }
        })

        .state('app.gallery', {
            url: '/galeria',
            views: {
                'mainContent@': {
                    templateUrl: 'templates/gallery.html',
                    controller: 'GalleryCtrl'
                }
            },
            resolve: {
                items: function(SocialService, AnalyticsService){
                    return SocialService
                        .get()
                        .then(function(r){
                            AnalyticsService.track('channel');
                            return r;
                        }, function(e){
                            AnalyticsService.track('error', e);
                            return e;
                        });
                }
            }
        })

        .state('app.press', {
            url: '/prensa',
            views: {
                'mainContent@': {
                    templateUrl: 'templates/press.html',
                    controller: 'PressCtrl'
                }
            }
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/home');
    //$locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
})

.controller('AppCtrl', function(AnalyticsService, $scope, $timeout){
    AnalyticsService.track('load');

    $scope.isMenuVisible = false;
    $scope.hideBanner = false;

    $scope.toggleMenu = function(){
        $timeout(function(){
            $scope.$apply(function(){
                $scope.isMenuVisible = !$scope.isMenuVisible;
            });
        });
    };
});
