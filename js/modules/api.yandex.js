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
    async createBalloon(options, customCoords) {

        var BalloonLayout = await ymaps.templateLayoutFactory.createClass(
            '<div> {ddjdjdj}</div>'
        )
    }
    async createPoint (coords) {
        return new ymaps.GeoObject({
            // Описание геометрии.
            geometry: {
                type: "Point",
                coordinates: coords
            },
            // Свойства.
            properties: {
                // Контент метки.
                iconContent: 'Я тащусь',
                hintContent: 'Ну давай уже тащи'
            }
        }, {
            // Опции.
            // Иконка метки будет растягиваться под размер ее содержимого.
            //preset: 'islands#blackStretchyIcon',
            // Метку можно перемещать.
            //draggable: true
        })
    }
}