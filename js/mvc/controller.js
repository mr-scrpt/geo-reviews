const Map = require('../modules/api.yandex');
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
            if (this.balloon) {
                this.balloon.close();
            }

            this.point = await this.myApiMap.getMapPosition(e);
            const pointCoords = this.point.coords;
            const pointAddress = this.point.address;
            const data = {
                address: pointAddress,
                reviews: []
            };
            this.balloon = await this.myApiMap.createBalloon(pointCoords, data);





        });




       //this.Balloon = await this.myApiMap.createBalloon(this.position);




    }
}