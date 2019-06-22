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
    }
    async getMapPosition(e) {
        const coords = e.get('coords');
        const geocode = await ymaps.geocode(coords);
        const address = geocode.geoObjects.get(0).properties.get('text');

        return {
            coords,
            address
        }
    }
    async createBalloon(customCoords, options) {
        const BalloonLayout = await ymaps.templateLayoutFactory.createClass(

            '<li>{{ address }}</li>' +

            '<div class="pupup">'+
                '<div class="popup__inner">'+
                    '<div class="popup__header">'+
                        '<div class="popup__address"></div>'+
                        '<div class="popup__close">'+
                            '<button class="popup__close">x</button>'+
                        '</div>'+
                    '</div>'+
                    '<div class="popup__reviews reviews">'+
                        '<div class="reviews__list">'+
                            '<div class="reviews__item">'+
                                '<div class="reviews__header">'+
                                    '<span class="reviews__author">'+
                                        '<span class="reviews__author-name">Светлана</span>'+
                                        '<span class="reviews__author-last-name">Тутут</span>'+
                                    '</span>'+
                                    '<div class="reviews__data">13.12.2019</div>'+
                                '</div>'+
                                '<div class="reviews__author">Отличное место! Всем советую</div>'+
                            '</div>'+
                        '</div>'+
                        '<div class="reviews__body">'+
                            '<form class="reviews__form form">'+
                                '<div class="form__title">Ваш отзыв</div>'+
                                '<input type="text" class="input form__name" name="name" placeholder="Ваше имя">'+
                                '<input type="text" class="input form__spot" name="spot" placeholder="Укажите место">'+
                                '<textarea name="comment" id="" cols="30" rows="10" class="textarea form__comment"></textarea>'+
                                '<div class="form__action">'+
                                    '<button class="button form__button">'+
                                        '<span class="button__text">Добавить</span>'+
                                    ' </button>'+
                                '</div>'+
                            '</form>'+
                        '</div>'+
                        '</div>'+
                '</div>'+
            '</div>'



        );

        let balloon = new ymaps.Balloon(this.map, {
            layout: BalloonLayout,
            closeButton: false
        });

        await balloon.options.setParent(this.map.options);
        await balloon.open(customCoords, options);

        return balloon;
    }

    async closeBalloon(){
        await this.map.balloon.close();
    }
}