module.exports = class {

    initMap(settings){
        return new Promise((resolve, reject) => ymaps.ready(resolve))
            .then(()=>{
                this.map = new ymaps.Map('map', settings);
                this.clusster = new ymaps.Clusterer({
                    clusterDisableClickZoom: true,
                    clusterBalloonContentLayout: 'cluster#balloonCarousel'
                });

                return this.map
            })
    };
    async getMapPosition(e) {
        const coords = e.get('coords');
        const geocode = await ymaps.geocode(coords);
        const address = geocode.geoObjects.get(0).properties.get('text');

        return {
            coords,
            address
        }
    };
    async createBalloon(customCoords, options) {
        const BalloonLayout = await ymaps.templateLayoutFactory.createClass(
            '<div class="pupup">'+
            '<div class="popup__inner">'+
            '<div class="popup__header">'+
            '<div class="popup__address">{{ address }}</div>'+
            '<div class="popup__close">'+
            '<button class="popup__close">x</button>'+
            '</div>'+
            '</div>'+
            '<div class="popup__reviews reviews">'+
            '{% for review in reviews %}' +
            '<div class="reviews__item">'+
            '<div class="reviews__header">'+
            '<span class="reviews__author">{{review.name}}</span>'+
            '<span class="reviews__spot">{{review.spot}}</span>'+
            '<span class="reviews__data">13.12.2019</span>'+
            '</div>'+
            '<div class="reviews__text">{{review.comment}}</div>'+
            '</div>'+
            '{% endfor %}' +
            '<div class="reviews__body">'+
            '<form class="reviews__form form">'+
            '<div class="form__title">Ваш отзыв</div>'+
            '<input type="hidden" class="input form__coords" value="{{ coords }}">'+
            '<input type="text" class="input form__name" name="name" placeholder="Ваше имя">'+
            '<input type="text" class="input form__spot" name="spot" placeholder="Укажите место">'+
            '<textarea name="comment" id="" cols="30" rows="10" class="textarea form__comment"></textarea>'+
            '<div class="form__action">'+
            '<button class="button form__button" type="button">Добавить</button>'+
            '</div>'+
            '</form>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>'



        );

        const balloon = new ymaps.Balloon(this.map, {
            layout: BalloonLayout,
            //closeButton: false
        });

        await balloon.options.setParent(this.map.options);
        await balloon.open(customCoords, options);

        await this.map.setCenter(customCoords);

        return balloon;
    };

    async createCluster(points, data){

        const clusterer = new ymaps.Clusterer({
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        });


        const BalloonLayout = await ymaps.templateLayoutFactory.createClass(
            '<div class="popup">'+
            '<div class="popup__inner">'+
            '<div class="popup__header">'+
            '<div class="popup__address">{{ properties.address }} </div>'+

            '<a class="popup__close" href="#">&times;</a>' +

            '</div>'+
            '<div class="popup__reviews reviews">'+
            '<div class="reviews__list">'+

            '{% for review in properties.reviews %}' +
            '<div class="reviews__item">'+
            '<div class="reviews__header">'+
            '<span class="reviews__author">{{review.name}}</span>'+
            '<span class="reviews__spot">{{review.spot}}</span>'+
            '<span class="reviews__data">13.12.2019</span>'+
            '</div>'+
            '<div class="reviews__text">{{review.comment}}</div>'+
            '</div>'+
            '{% endfor %}' +

            '</div>'+
            '<div class="reviews__body">'+
            '<form class="reviews__form form">'+
            '<div class="form__title">Ваш отзыв</div>'+
            '<input type="hidden" class="input form__coords" value="{{ coords }}">'+
            '<input type="text" class="input form__name" name="name" placeholder="Ваше имя">'+
            '<input type="text" class="input form__spot" name="spot" placeholder="Укажите место">'+
            '<textarea name="comment" id="" cols="30" rows="10" class="textarea form__comment"></textarea>'+
            '<div class="form__action">'+
            '<button class="button form__button" type="button">Добавить</button>'+
            '</div>'+
            '</form>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>',{
                build: function () {
                    this.constructor.superclass.build.call(this);
                    this._$element = $('.popup', this.getParentElement());
                    this._$element.find('.popup__close').on('click', $.proxy(this.onCloseClick, this));
                }

            }

        );


        let geoObjects = [];

        for( let i = 0, len = points.length; i < len; i++) {
            // geoObjects[i] = new ymaps.Placemark(points[i], data[i], {balloonContentLayout: BalloonLayout});
            data[i]['iconContent']= data[i].reviews.length;
            geoObjects[i] = new ymaps.Placemark(points[i], data[i], {balloonContentLayout: BalloonLayout});
        }

        clusterer.options.set({
            gridSize: 80,
            clusterDisableClickZoom: true

        });

        clusterer.add(geoObjects);

        this.map.geoObjects.add(clusterer);

    };

    async creatrMark(option){
        this.map
    };
}