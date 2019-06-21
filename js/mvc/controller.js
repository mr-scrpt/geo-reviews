const Map = require('../modules/api.yandex')
export default class {
    constructor(){
        this.myApiMap = new Map();
        this.init();
    }
    async init(){
        this.yandexApi = await this.myApiMap.initMap({
            center: [50, 36.24],
            zoom: 15,
            controls: []
        });
        this.yandexApi.events.add('click', async e => {
            this.point = await this.myApiMap.getMapPosition(e);
            const pointCoords = this.point.coords;
            const pointAddress = this.point.address;
            await this.myApiMap.createBalloon(pointCoords, {address: pointAddress});

        });




       //this.Balloon = await this.myApiMap.createBalloon(this.position);




    }
}