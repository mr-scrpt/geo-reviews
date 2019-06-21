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
            '<li>{{ address }}</li>'
        );

        let balloon = new ymaps.Balloon(this.map, {
            layout: BalloonLayout,
            closeButton: false
        });

        await balloon.options.setParent(this.map.options);
        await balloon.open(customCoords, options);


    }
    async createMark(coords){

    }
}