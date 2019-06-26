module.exports = class {

    initMap(settings){
        return new Promise((resolve, reject) => ymaps.ready(resolve))
            .then(()=>{
                this.map = new ymaps.Map('map', settings);
                this.clusster = new ymaps.Clusterer({
                    clusterDisableClickZoom: true,
                    clusterBalloonContentLayout: 'cluster#balloonCarousel'
                });

                this.clusster.events.add('click', async e => {
                    var object = e.get('target');
                    if (!object.getGeoObjects) {
                        this.createBalloon(object.geometry._coordinates)
                    }

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
    async createBalloon(customCoords, coords, options) {
        const clusterNew = this.clusster;
        const mapName = this.map;
        const BalloonLayout = await ymaps.templateLayoutFactory.createClass(
            '<div class="popup">'+
            '<div class="popup__inner">'+
            '<div class="popup__header">'+
            '<div class="popup__address">{{ address }}</div>'+
            '<button class="popup__close" id="popup__close">x</button>'+
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
            '<button class="button form__button" id="addReview" type="button">Добавить</button>'+
            '</div>'+
            '</form>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>', {
                build: function () {
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
                        this.addPlacemark();
                    });

                    clusterNew.events.add('click', (e)=>{

                    });

                },
                addPlacemark: function (coords = customCoords) {
                    const that = this;


                    var myPlacemark = new ymaps.Placemark(
                        customCoords, {
                            balloonContentHeader: ``,
                            balloonContentBody: ``,
                            balloonContentFooter:``
                        }, {
                            layout: BalloonLayout,
                            balloonPanelMaxMapArea: 0,
                            hasBalloon: false,


                        }
                    );

                    clusterNew.add(myPlacemark);
                    mapName.geoObjects.add(clusterNew);

                    return [myPlacemark, clusterNew];
                }


            }
        );


        let balloon = await new ymaps.Balloon(this.map, {
            layout: BalloonLayout,

        });
        await balloon.options.setParent(this.map.options);

        await balloon.open(customCoords);
        return {
            balloon,
            clusterNew
        };


    };

}