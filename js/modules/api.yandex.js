module.exports = class {

    initMap(settings){
        return new Promise((resolve, reject) => ymaps.ready(resolve))
            .then(()=>{
                this.map = new ymaps.Map('map', settings);

                var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
                    // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.

                    '<h2 class="ballon__header-spot">{{ properties.spot }} {{properties.index}} Спот</h2>' +
                    '<a class="ballon__header-address" href="#" data-coord="">{{ properties.address}} Адрес</a>' +

                    '<div class="ballon__comment">{{ properties.reviews.comment }}</div>'+
                    '<div class="ballon__data">{{ properties.address}}</div>'

                );

                this.cluster = new ymaps.Clusterer({
                    clusterDisableClickZoom: true,
                    clusterBalloonContentLayout: 'cluster#balloonCarousel',
                    clusterBalloonItemContentLayout: customItemContentLayout,
                });


                return [this.map, this.cluster];
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
        const clusterNew = this.cluster;
        const mapName = this.map;

        const BalloonLayout = await ymaps.templateLayoutFactory.createClass(
            '<div class="popup">'+
            '<div class="popup__inner">'+
            '<div class="popup__header">'+
            '<div class="popup__address">{{ address }} </div>'+
            '<button class="popup__close" id="popup__close">x</button>'+
            '</div>'+
            '<div class="popup__reviews reviews">'+
            '<div class="reviews__list">'+
                '{% if !reviews.length %}' +
                '<div class="reviews__empty">Отзывов нет!</div>'+
                '{% endif %}'+
            '{% for review in reviews %}' +
            '<div class="reviews__item">'+
            '<div class="reviews__header">'+
            '<span class="reviews__author">{{review.name}}</span>'+
            '<span class="reviews__spot">{{review.spot}}</span>'+
            '<span class="reviews__data">{{review.data}}</span>'+
            '</div>'+
            '<div class="reviews__text">{{review.comment}}</div>'+
            '</div>'+
            '{% endfor %}' +
            '</div>'+
            '<div class="reviews__body">'+
            '<form class="reviews__form form">'+
            '<input type="hidden" class="input form__coords" value="{{ coords }}">'+
            '<input type="text" class="input form__name" name="name" placeholder="Ваше имя">'+
            '<input type="text" class="input form__spot" name="spot" placeholder="Укажите место">'+
            '<textarea name="comment" id="" cols="30" rows="10" class="textarea form__comment"></textarea>'+
            '<div class="form__action">'+
            '<button class="button form__button" id="addReview" type="button">Добавить</button>'+
            '</div>'+
            '</form>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>', {
                build() {
                    BalloonLayout.superclass.build.call(this);
                    const buttonAdd = document.getElementById("addReview");
                    const buttonClose = document.querySelector(".popup__close");


                    buttonClose.addEventListener('click', e => {
                        e.preventDefault();
                        this.events.fire('userclose');
                    });


                    document.addEventListener('click', function (e) {
                        e.preventDefault();

                    });

                    buttonAdd.addEventListener('click', e => {
                        e.preventDefault();

                        //this.addPlacemark(customCoords, options);

                    });

                    clusterNew.events.add('click', (e)=>{
                        this.events.fire('userclose');
                    });

                },
                async addPlacemark (coords = customCoords) {
                    const that = this;

                    const myPlacemark = new ymaps.Placemark(
                        coords
                    );

                    clusterNew.add(myPlacemark);
                    mapName.geoObjects.add(clusterNew);

                    return [myPlacemark, clusterNew];
                }


            }
        );



        let balloon = await new ymaps.Balloon(this.map, {
            layout: BalloonLayout
        });
        await balloon.options.setParent(this.map.options);



        await balloon.open(customCoords, options);
        return {
            balloon,
            clusterNew
        };


    };

};