const Map = require('../modules/api.yandex')
export default class {
    constructor(){
        this.myApiMap = new Map();
        this.init();
    }
    async init(){
        this.yandexApi = await this.myApiMap.initMap({
            center: [50, 36.24],
            zoom: 12,
            controls: []
        });
        this.yandexApi.events.add('click', async e => {
            this.point = await this.myApiMap.getMapPosition(e);
            const coords = await this.myApiMap.createPoint(this.point.coords);
            this.yandexApi.geoObjects.add(coords);

        });


        //this.test = await this.myApiMap.createPoint([50, 36.28]);

        //await this.yandexApi.geoObjects.add(this.test);
        // console.log(this.test);



       // this.Balloon = await this.myApiMap.createBalloon(this.position);




    }
}