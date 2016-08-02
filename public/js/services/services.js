angular.module('app.services')

.factory('VenueService', function($q, $http, $rootScope, API_URL, DEFAULT_CENTER, DEFAULT_RANGE, CATEGOTY_ID){
    'use strict';

    var _current = [];

    var fetch = function(){
        var defer = $q.defer();

        if(!_.isEmpty(_current)){
            defer.resolve(_current)
        }else{
            var params = 'lat=' + DEFAULT_CENTER.latitude + '&lng=' + DEFAULT_CENTER.longitude + '&radius=' + DEFAULT_RANGE + '&category=' + CATEGOTY_ID;

            $http
                .get(API_URL + '/search?' + params)
                .then(function(c){
                    if(!_.isEmpty(c)){
                        _current = c.data;
                        defer.resolve(_current);
                    }else{
                        defer.reject({message: 'No venues found', code: 404});
                    }
                }, function(e){
                    defer.reject(e);
                });
        }

        return defer.promise;
    };

    return {
        fetch: fetch
    };
})

.factory('ArtistService', function($q, $http, API_URL, $sce){
    var _current = [];
    var _featured = [];
    var _currentArtist = {};

    var CONFIG = [
        {id: "HJ9azrzrpW", name: "Auditorio Civico Del Estado"},
        {id: "RbtC3AFvih", name: "Blvd. Hidalgo"},
        {id: "e9At6lPDjG", name: "Callejón Literario"},
        {id: "dEJUxeEjkS", name: "Casa De La Cultura"},
        {id: "FdfiJfMxaq", name: "Casa Madrid"},
        {id: "03sBjd5EPy", name: "Galería Bicentenario"},
        {id: "XNR0TppZkH", name: "Instituto Sonorense De Cultura"},
        {id: "E24oS3Va9O", name: "Musas"},
        {id: "VGTPtVBYGO", name: "Museo De Culturas Populares E Indígenas De Sonora"},
        {id: "8jqXcW7uL2", name: "Palacio De Gobierno"},
        {id: "KmxlQxBOtG", name: "Palacio Municipal"},
        {id: "8omw5BlFUS", name: "Parque Madero"},
        {id: "Gsou10y94X", name: "Plaza Alonso Vidal"},
        {id: "6ueF8ABoEA", name: "Plaza Bicentenario"},
        {id: "iBoFxtFnJz", name: "Plaza Del Mezquite"},
        {id: "39azDnH1MM", name: "Plaza Hidalgo"},
        {id: "RF1WHJFB0u", name: "Plaza Zaragoza"},
        {id: "LRPttDfG1V", name: "Quinta De Anza"},
        {id: "FpXMBKFgZk", name: "Sociedad Sonorense De Historia"},
        {id: "iNuobEKK04", name: "Teatro De La Ciudad"},
        {id: "x3ndGA2e9g", name: "Teatro Emiliana De Zubeldia"},
        {id: "crZiyvsEGX", name: "Casa Andamios"}
    ];

    var fetch = function(featured){
        var defer = $q.defer();
        var params = '';

        if(featured && !_.isEmpty(_featured)){
            defer.resolve(_featured);
        }else if(!_.isEmpty(_current) && !featured){
            defer.resolve(_current);
        }else{
            if(featured){
                params = '?featured=true';
            }

            var ids = CONFIG.map(function(c){return c.id}).join(',');

            $http
                .get(API_URL + '/venue/' + ids + '/events' + params)
                .then(function(c){
                    if(!_.isEmpty(c)){
                        var r = [];

                        if(c.data && c.data.results){
                            r = c.data.results.map(function(e){
                                var isoDate = new Date(e.eventDay.iso);

                                e.about = $sce.trustAsHtml(e.about);
                                e.slug = s.slugify(e.title);

                                e.eventDay = moment(isoDate).format('DD MMM YYYY hh:mm a');



                                return e;
                            });
                        }

                        if(featured){
                            _featured = r;
                            defer.resolve(_featured);
                        }else{
                            _current = r;
                            defer.resolve(_current);
                        }
                    }else{
                        defer.reject({message: 'No venues found', code: 404});
                    }
                }, function(e){
                    defer.reject(e);
                });
        }

        return defer.promise;
    };

    var getById = function(id){
        var defer = $q.defer();

            $http
                .get(API_URL + '/events/' + id)
                .then(function(c){
                    if(c && c.data){
                        c.data.eventDay = (new Date(c.data.eventDay.iso)).toLocaleString();
                        c.data.about = $sce.trustAsHtml(c.data.about);
                        c.data.slug = s.slugify(c.data.title);
                    }

                    defer.resolve(c.data);
                }, function(e){
                    defer.reject(e);
                });

        return defer.promise;
    };

    return {
        fetch: fetch,
        getById: getById
    };
})

.factory('SocialService', function($q, $http, API_URL, YOUTUBE_CHANNEL, FLICKR_ID, INSTAGRAM_ID){
    var get = function(id){
        var defer = $q.defer();

            $http
                .get(API_URL + '/channel/flickr:' + FLICKR_ID + ',youtube:' + YOUTUBE_CHANNEL + ',instagram:' + INSTAGRAM_ID + '/mix')
                .then(function(c){
                    defer.resolve(c.data);
                }, function(e){
                    defer.reject(e);
                });

        return defer.promise;
    };

    return {get: get};
})

.factory('AnalyticsService', function($q, $http, API_URL){
    function getDeviceData(e){
        var d = {
            web: true,
            client: 'br-fip'
        };

        if('navigator' in window){
            d.ua = navigator.userAgent;
            d.codeName = navigator.appCodeName;
            d.name = navigator.appName;
            d.lang = navigator.language;
            d.platform = navigator.platform;
        }

        if(_.isObject(e)){
            d = angular.extend(d, e);
        }

        return d;
    };

    var global = {
        track: function(type, e){
            var deviceData = getDeviceData(e);
            var data = angular.extend({}, deviceData, {
                timestamp: new Date()*1,
                event: type
            });

            $http.post(API_URL + '/analytics', {data: data});
        }
    };

    return global;
});
