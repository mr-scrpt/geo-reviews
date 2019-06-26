const Map = require('../modules/api.yandex');
const Sm = require('../modules/sm');

export default class {
    constructor(){
        this.myApiMap = new Map();
        this.sm = new Sm();
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
            const data = {
                address: pointAddress,
                coords: pointCoords,
                reviews: []
            };
            if (this.balloon) {
                this.balloon.balloon.close();
            }

            this.balloon = await this.myApiMap.createBalloon(pointCoords, data);





        });


        //this.myApiMap.createCluster(this.sm.getPoints(), this.sm.parseStorage());

        document.body.addEventListener('click', e => {



        })

    }
}