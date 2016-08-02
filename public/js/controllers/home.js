angular.module('app.controllers')

.controller('HomeCtrl', function($rootScope, $state, $scope, $timeout, items, AnalyticsService){
    $timeout(function(){
        $scope.$apply(function(){
            $scope.items = items;
            AnalyticsService.track('load', {page: 'home', eventLength: items.length, ids: items.map(function(e){return e.objectId;})});
        });
    });

    $('#slider').slick();

    $timeout(function(){
        $rootScope.$apply(function(){
            $rootScope.hideSidebar = false;
        });
    });
})

.controller('HmoCtrl', function($rootScope, $scope, $state, $timeout, AnalyticsService){
    $scope.norte = [
        {
            name: 'Bugambilia',
            thumbnail: '/img/hoteles/hotel-bugambilia.png',
            address: 'Blvd. Eusebio Kino, colonia Country Club',
            phone_number: ['(662)289-1600','01-800 -623-3300'],
            www: 'http://www.hotelbugambilia.com.mx/'
        },
        {
            name: 'Fiesta Inn',
            thumbnail: '/img/hoteles/fiesta-inn.png',
            address: 'Blvd. Eusebio Kino no. 375, colonia Lomas Pitic',
            phone_number: ['(662)289-2200','01-800- 504-5000'],
            www: 'http://www.fiestainn.com/es/web/fiesta-inn-hermosillo?gclid=Cj0KEQjwmKG5BRDv4YaE5t6oqf0BEiQAwqDNfPKSas59eeB3xXwP3CdbPcYDXoXtUj5jNCqa3SCRNakaArfo8P8HAQ'
        },
        {
            name: 'Fiesta Americana',
            thumbnail: '/img/hoteles/fiesta-americana.jpg',
            address: 'Blvd. Eusebio Kino no. 369, colonia Lomas Pitic',
            phone_number: ['(662)259-6000','01-800- 504-5000'],
            www: 'http://www.fiestamericana.com/es/home'
        }
    ];

    $scope.centro = [
        {
            name: 'City Express',
            thumbnail: '/img/hoteles/hotel-city-express.jpg',
            address: 'Blvd. Río Sonora Norte no. 96, colonia Vado Del Río',
            phone_number: ['(662)108-2870'],
            www: 'http://www.cityexpress.com.mx/'
        },
        {
            name: 'Ibis',
            thumbnail: '/img/hoteles/hotel-ibis.jpg',
            address: 'Av. Cultura no. 48 esquina con Galeana, colonia Proyecto Río Sonora',
            phone_number: ['(662)208-4700'],
            www: 'http://www.ibis.com/es/mexico/index.shtml'
        },
        {
            name: 'Lucerna',
            thumbnail: '/img/hoteles/lucerna.jpg',
            address: 'Blvd. Paseo Río Sonora norte no. 98, colonia Proyecto Río Sonora',
            phone_number: ['(662)259-5200'],
            www: 'http://www.hoteleslucerna.com/'
        }
    ];

    $scope.sur = [
        {
            name: 'Plaza Las Quintas',
            thumbnail: '/img/hoteles/plaza-las-quintas.jpg',
            address: 'Blvd. Manuel J. Clouthier no. 19, colonia Y Griega',
            phone_number: ['(662)108-0540'],
            www: 'http://www.hotelplazalasquintas.com/'
        },
        {
            name: 'San Sebastián',
            thumbnail: '/img/hoteles/san-sebastian.jpg',
            address: 'Periférico Sur, colonia Y Griega',
            phone_number: ['(662)259-9550'],
            www: 'http://www.hotelsansebastian.com.mx/'
        }
    ];

    $scope.aeropuerto = [
        {
            name: 'Santiago Plaza',
            thumbnail: '/img/hoteles/santiago-plaza.jpg',
            address: 'Luis Encinas Jonhson, colonia Olivares',
            phone_number: ['(662)289-8990'],
            www: 'http://www.hotelsantiagoplaza.com/'
        },
        {
            name: 'Royal Palace',
            thumbnail: '/img/hoteles/royal-palace.jpg',
            address: 'Blvd. García Morales no. 306 esquina con Calzada de los Ángeles, colonia El Llano',
            phone_number: ['(662)236-3300'],
            www: 'http://www.hotelroyalpalace.com.mx/'
        },
        {
            name: 'San Ángel',
            thumbnail: '/img/hoteles/hotel-san-angel.jpg',
            address: 'Blvd. Jesús García Morales no. 104, colonia El Llano',
            phone_number: ['(662)289-9850'],
            www: 'http://hotelsanangel.com/'
        }
    ];

    AnalyticsService.track('load', {page: 'hermosillo'});

    $timeout(function(){
        $rootScope.$apply(function(){
            $rootScope.hideSidebar = false;
        });
    });
})

.controller('HistoryCtrl', function($rootScope, $state, $timeout, AnalyticsService){
    AnalyticsService.track('load', {page: 'history'});

    $timeout(function(){
        $rootScope.$apply(function(){
            $rootScope.hideSidebar = false;
        });
    });
})

.controller('ArtistsCtrl', function($rootScope, $state, $scope, $timeout, items, AnalyticsService, VALID_FILTERS){
    $timeout(function(){
        $scope.$apply(function(){
            var featured = items.filter(function(e){
                if(e.featured) return e;
            });

            var allOthers = items.filter(function(e){
                if(!e.featured) return e;
            });

            $scope.items = _.chain(featured.concat(allOthers)).uniqBy(function(e){
                return e.title.toLowerCase();
            }).map(function(e){
                if(!e.file){
                    e.bannerUrl = '/img/default.jpg';
                }

                return e;
            }).value();
            //This is what we show in the page
            $scope.showItems = $scope.items;
            $scope.allFilters = VALID_FILTERS;
            $scope.filteredItems = [];

            $scope.filters = _.chain($scope.items).map(function(e){
                var f = e.title[0].toUpperCase();

                if(VALID_FILTERS.indexOf(f) === -1){
                    f = 'Otros';
                }

                if($scope.filteredItems[f]){
                    $scope.filteredItems[f].push(e);
                }else{
                    $scope.filteredItems[f] = [e];
                }

                return f;
            }).uniq().sort().value();

            AnalyticsService.track('load', {page: 'artists', items: $scope.items.map(function(e){return e.objectId;}), itemsLength: $scope.items.length});
        });
    });

    $timeout(function(){
        $rootScope.$apply(function(){
            $rootScope.hideSidebar = true;
        });
    });

    $scope.filter = function(f){
        if(!f){
            $timeout(function(){
                $scope.$apply(function(){
                    $scope.showItems = $scope.items;
                });
            });
        }else if($scope.filteredItems[f]){
            $timeout(function(){
                $scope.$apply(function(){
                    $scope.showItems = $scope.filteredItems[f];
                });
            });
        }
    };
})

.controller('ArtistCtrl', function($rootScope, $state, $scope, $timeout, item){

    if(!item.file){
        item.bannerUrl = '/img/splash-small.jpg';
    }

    $scope.item = item;

    $timeout(function(){
        $rootScope.$apply(function(){
            $rootScope.hideSidebar = false;
        });
    });
})

.controller('FIPCtrl', function($rootScope, $state){
    $rootScope.hideSidebar = false;
})

.controller('MapCtrl', function($rootScope, $scope, $timeout, GOOGLE_MAPS_API_URL, DEFAULT_CENTER, VenueService, NgMap, AnalyticsService){
    $scope.googleMapsUrl = GOOGLE_MAPS_API_URL;
    $scope.items = [];
    $scope.map = {
        center: DEFAULT_CENTER,
        zoom: 13
    };

    NgMap.getMap({id: 'map-map'}).then(function(map) {
        $scope.m = map;
    });

    $scope.showDetail = function(e, venue) {
        $scope.venue = venue;
        $scope.m.showInfoWindow('map-infowindow', this);
    };

    VenueService
        .fetch()
        .then(function(response){
            $timeout(function(){
                $scope.$apply(function(){
                    $scope.items = response.results;
                    AnalyticsService.track('load', {page: 'map', items: $scope.items.map(function(m){return m.objectId;}), itemsLength: $scope.items.length});
                });
            });
        }, function(e){
            $scope.error = e;
            AnalyticsService.track('error', {page: 'map', error: e});
        });

    AnalyticsService.track('load', {page: 'map'});

    $timeout(function(){
        $rootScope.$apply(function(){
            $rootScope.hideSidebar = true;
        });
    });
})

.controller('GalleryCtrl', function($rootScope, $scope, $timeout, items, AnalyticsService){
    $timeout(function(){
        $scope.$apply(function(){
            $scope.instagram = items.find(function(i){return i.type === 'instagram'});
            $scope.flickr = items.find(function(i){return i.type === 'flickr'});
            $scope.videos = items.find(function(i){return i.type === 'youtube'});
        });
    });

    AnalyticsService.track('load', {page: 'multimedia'});

    $timeout(function(){
        $rootScope.$apply(function(){
            $rootScope.hideSidebar = true;
        });
    });
})

.controller('PressCtrl', function($rootScope, $scope, $timeout, AnalyticsService){
    $scope.items = [
        {
            title: ' Reconocen carrera artística de Gilberto “El Sahuaripa” Valenzuela',
            thumbnail: '/pdf/CP045/thumbnail.jpg',
            text: 'Hermosillo, Sonora; Junio 01 de 2016.- Con más de 6 décadas de carrera artística y de poner en alto el nombre del Estado de Sonora con su música vernácula, Gilberto "El Sahuaripa" Valenzuela recibió un reconocimiento del Presidente Municipal, Manuel Ignacio Maloro Acosta, en el escenario de la Plaza Hidalgo del Festival del Pitic 2016.',
            link: '/pdf/CP045/COMUNICADO DE PRENSA 045 - Reconocen carrera artística de Gilberto _El Sahuaripa_ Valenzuela.pdf',
            subtitle: 'El homenajeado ha destacado por más de 60 años en la música vernácula',
            id: ''
        },
        {
            title: 'Tiene Festival Internacional del Pitic 2016 intenso final',
            thumbnail: '/pdf/CP044/thumbnail.jpg',
            text: 'Hermosillo, Sonora; Junio 01 de 2016.- Grandes éxitos del rock and roll se escucharon en el Parque Francisco I. Madero durante el concierto de clausura del Festival Internacional del Pitic 2016 (FIP) que estuvo a cargo de Gilby Clarke.',
            link: '/pdf/CP044/COMUNICADO DE PRENSA 044 - Tiene Festival Internacional del Pitic intenso final.pdf',
            subtitle: 'Gilby Clarke puso a rockear a Hermosillo durante el concierto de clausura',
            id: ''
        },
        {
            title: 'Ana Moura obsequia romántica noche a Hermosillo',
            thumbnail: '/pdf/CP043/thumbnail.jpg',
            text: 'Hermosillo, Sonora; Mayo 30 de 2016.- Ana Moura, una de las mejores intérpretes de fado a nivel internacional cantó a Hermosillo en el marco del Festival Internacional del Pitic 2016 (FIP).',
            link: '/pdf/CP043/COMUNICADO DE PRENSA 043 - Ana Moura obsequia romántica noche a Hermosillo.pdf',
            subtitle: 'La cantante de fado ofreció armónico concierto en la clausura del Foro Principal del Festival Internacional del Pitic 2016',
            id: ''
        },
        {
            title: 'Entrega Maloro Acosta el XIV Premio Nacional de Poesía Alonso Vidal 2015',
            thumbnail: '/pdf/CP042/thumbnail.jpg',
            text: 'Hermosillo, Sonora; Mayo 30 de 2016.- En el marco de las actividades del Festival Internacional del Pitic 2016, el Presidente Municipal, Manuel Ignacio Maloro Acosta, entregó el XIV Premio Nacional de Poesía Alonso Vidal 2015 al autor tijuanense Gabriel Ledón.',
            link: '/pdf/CP042/COMUNICADO DE PRENSA 042 - Entrega Maloro Acosta el XIV Premio Nacional de Poesía Alonso Vidal 2015.pdf',
            subtitle: 'Le correspondió al tijuanense Gabriel Ledón creador del poemario “El Dron de Nonaka” bajo el seudónimo “Liebre Ártica”',
            id: ''
        },
        {
            title: 'Paté de Fuá celebra en Hermosillo 10 años de carrera',
            thumbnail: '/pdf/CP041/thumbnail.jpg',
            text: 'Hermosillo, Sonora; Mayo 30 de 2016.- Entusiasmados y muy alegres llegaron los integrantes de Paté de Fuá al Foro Juvenil del Festival Internacional del Pitic 2016 donde realizaron un concierto con el que celebran 10 años de carrera artística.',
            link: '/pdf/CP041/COMUNICADO DE PRENSA 041 - Paté de Fuá celebra en Hermosillo 10 años de carrera.pdf',
            subtitle: 'a agrupación realizó un concierto en la Ciudad de Sol dentro del Festival Internacional del Pitic 2016',
            id: ''
        },
        {
            title: 'Paquito D’Rivera Sextet protagoniza noche de Latin Jazz',
            thumbnail: '/pdf/CP040/thumbnail.jpg',
            text: 'Hermosillo, Sonora; Mayo 30 de 2016.- Paquito D’Rivera Sextet llegó a Hermosillo con lo mejor del Latin Jazz en un cálido y ameno concierto que demostró la calidad musical que caracteriza al músico cubano, considerado uno de los mejores intérpretes de Jazz en el mundo.',
            link: '/pdf/CP040/COMUNICADO DE PRENSA 040 - Paquito D\'Rivera protagoniza noche de Latin Jazz.pdf',
            subtitle: ' músico cubano interpretó piezas de grandes compositores clásicos con toque latino en el Festival Internacional del Pitic 2016',
            id: ''
        },
        {
            title: 'Hermosillo baila con la Única Internacional Sonora Santanera',
            thumbnail: '/pdf/CP039/thumbnail.jpg',
            text: 'Las actividades de la Plaza Alonso Vidal continuarán este martes 31 con Ana Moura a las 21:00 horas. Conoce nuestro programa completo en el www.festivaldelpitic.com.',
            link: '/pdf/CP039/COMUNICADO DE PRENSA 039 - Hermosillo baila con la Única Internacional Sonora Santanera.pdf',
            subtitle: 'a agrupación mexicana celebró 61 años de carrera en el Festival Internacional del Pitic 2016',
            id: ''
        },
        {
            title: 'Boogarins ofrece a Hermosillo noche de psicodelia y rock',
            thumbnail: '/pdf/CP038/thumbnail.jpg',
            text: 'Hermosillo, Sonora; Mayo 28 de 2016.- Desde Brasil llegó la energía y vitalidad de Boogarins al Festival Internacional del Pitic 2016, agrupación juvenil que presentó lo más reciente de su segundo material discográfico en el Parque Francisco I. Madero.',
            link: '/pdf/CP038/COMUNICADO DE PRENSA 038 - Boogarins ofrece a Hermosillo noche de psicodelia y rock.pdf',
            subtitle: 'La agrupación brasileña presentó su propuesta musical en el Foro Juvenil del Festival Internacional del Pitic 2016',
            id: ''
        },
        {
            title: 'Hermosillo vive la experiencia Earth, Wind and Fire  ',
            thumbnail: '/pdf/CP037/thumbnail.jpg',
            text: 'Hermosillo, Sonora; Mayo 29 de 2016.- La Plaza Alonso Vidal vibró al ritmo de la fusión de música disco, funk, blues y soul con el espectacular concierto que ofreció The Earth, Wind and Fire Experience ft. The Al McKay Allstars el pasado sábado durante el Festival Internacional del Pitic 2016.',
            link: '/pdf/CP037/COMUNICADO DE PRENSA 037 - Hermosillo vive la experiencia Earth, Wind and Fire.pdf',
            subtitle: 'La banda dirigida por el guitarrista Al McKay ofrecio concierto en el foto principal del Festival Internacional del Pitic 2016',
            id: ''
        },
        {
            title: 'The Villanovas sorprende a hermosillenses con eufórico concierto',
            thumbnail: '/pdf/CP036/thumbnail.jpg',
            text: 'Hermosillo, Sonora, Mayo 28 de 2016.- El grupo británico The Villanovas ofreció este viernes un concierto en el Foro Juvenil del Festival Internacional del Pitic 2016 que impresionó a todos los asistentes.',
            link: '/pdf/CP036/COMUNICADO DE PRENSA 036 - The Villanovas sorprende a hermosillenses.pdf',
            subtitle: 'La banda inglesa se presentó en el Parque Madero como parte del Festival Internacional del Pitic 2016',
            id: ''
        },
        {
            title: 'Dhoad, gitanos de Rajastán por primera vez en México',
            thumbnail: '/pdf/CP035/thumbnail.jpg',
            text: 'Hermosillo, Sonora; Mayo 28 de 2016.- Las tradiciones orales y artísticas de la India llegaron al Festival Internacional del Pitic 2016 con el espectáculo de Dhoad, gitanos de Rajastán el pasado viernes en la Plaza Alonso Vidal.',
            link: '/pdf/CP035/COMUNICADO DE PRENSA 035 - Dhoad, gitanos de Rajastán por primera vez en México.pdf',
            subtitle: 'La agrupación indú se presentó durante el Festival Internacional del Pitic 2016',
            id: ''
        },
        {
            title: 'elo Torres y Los Toscos ofrecieron concierto con gran ritmo y sabor latino',
            thumbnail: '/pdf/CP034/thumbnail.jpg',
            text: 'Hermosillo, Sonora; Mayo 27 de 2016.- El Foro Juvenil del Festival Internacional del Pitic 2016 se llenó de gran ritmo y alegría durante el primer día de conciertos con el original repertorio presentado por Carmelo Torres y Los Toscos.',
            link: '/pdf/CP034/COMUNICADO DE PRENSA 034 - Carmelo Torres y Los Toscos ofrecieron concierto con gran ritmo y sabor latino.pdf',
            subtitle: 'La agrupación colombiana se presentó en el Festival Internacional del Pitic 2016',
            id: ''
        },
        {
            title: 'José Carreras deleita a Sonora con espectacular concierto',
            thumbnail: '/pdf/CP033/thumbnail.jpg',
            text: 'Hermosillo, Sonora; Mayo 27 de 2016.- El Festival Internacional del Pitic, en su catorceava edición, ofreció un espectacular concierto con una de las más grandes voces de nuestros tiempos: José Carreras.',
            link: '/pdf/CP033/COMUNICADO DE PRENSA 033 - José Carreras deleita a Sonora con espectacular concierto.pdf',
            subtitle: 'El Festival Internacional del Pitic 2016 arrancó con la presentación del tenor español',
            id: ''
        },
        {
            title: 'Tiene Festival Internacional del Pitic inicio majestuoso',
            thumbnail: '/pdf/CP032/thumbnail.jpg',
            text: 'Hermosillo, Sonora; Mayo 27 de 2016.- “Honraremos a todos los que a lo largo de 316 años han dejado huella y han dejado una semilla para que Hermosillo tenga ese valor y ese carácter que lo identifica, pero sobre todo para que recupere la grandeza que tanto deseamos” manifestó Manuel Ignacio Maloro Acosta, al asistir junto con la Gobernadora Claudia Pavlovich al concierto de gala del tenor José Carreras, que dio arranque formal al Festival Internacional del Pitic 2016 Hermosillo con su Gente.',
            link: '/pdf/CP032/COMUNICADO DE PRENSA 032 - Tiene Festival Internacional del Pitic inicio majestuoso.pdf',
            subtitle: 'Inauguran Maloro y la Gobernadora Claudia Pavlovich la tradicional festividad hermosillense',
            id: ''
        },{
            title: 'Inauguran exposición “Pinocho” de Francisco Toledo',
            thumbnail: '/pdf/CP031/thumbnail.jpg',
            text: 'Hermosillo, Sonora; Mayo 26 de 2016.- Como parte del Festival Internacional del Pitic 2016, se inauguró la exposición Pinocho, del artista oaxaqueño Francisco Toledo, que podrá ser apreciada en el Museo de Arte de Sonora MUSAS desde el jueves 26 de mayo hasta el 30 de julio.',
            link: '/pdf/CP031/COMUNICADO DE PRENSA 031 - Inauguran exposición _Pinocho_ de Francisco Toledo.pdf',
            subtitle: 'Forma parte de las actividades del Festival Internacional del Pitic 2016 "Hermosillo con su Gente"',
            id: ''
        }
    ];

    AnalyticsService.track('load', {page: 'press'});

    $timeout(function(){
        $rootScope.$apply(function(){
            $rootScope.hideSidebar = true;
        });
    });
});
