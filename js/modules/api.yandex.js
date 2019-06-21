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
        console.log(options);

        const BalloonLayout = await ymaps.templateLayoutFactory.createClass(
            '<li>{{ properties.address }}</li>'

        );

        this.myPlacemark = new ymaps.Placemark(customCoords,
            options
        , {
            balloonContentLayout: BalloonLayout
        });
        this.map.geoObjects.add(this.myPlacemark)


    }
}