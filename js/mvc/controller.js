const Map = require('../modules/api.yandex');
const Sm = require('../modules/sm');

export default class {
    constructor(){
        this.myApiMap = new Map();
        this.sm = new Sm();
        this.init();
    }
    async init(){
        [this.yandexApi, this.cluster] = await this.myApiMap.initMap({
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
                console.log('балун карты');
            }


            this.balloon = await this.myApiMap.createBalloon(pointCoords, data);


        });

        this.cluster.events.add('click', async e => {
            if (this.balloon) {
                console.log(this.balloon);
                this.balloon.balloon.close();

            }

            var object = e.get('target');
            // Тут заберем данные из локалсторедж и поло
            if (!object.getGeoObjects) {
                this.balloon = await this.myApiMap.createBalloon(object.geometry._coordinates, {address: '22222222'})

            }

        });

        //this.myApiMap.createCluster(this.sm.getPoints(), this.sm.parseStorage());

        document.body.addEventListener('click', async e => {
            if (e.target.classList.contains('button')){
                e.preventDefault();
                const address = document.querySelector('.popup__address').innerText;
                const coords = document.querySelector('.form__coords').value;
                const name = document.querySelector('.form__name').value;
                const spot = document.querySelector('.form__spot').value;
                const comment = document.querySelector('.form__comment').value;

                const form = document.querySelector('.form');

                const line = form.elements;


                let isEmpty = false;
                Array.from(line).forEach(item => {
                    if(item.tagName === 'INPUT' || item.tagName === 'TEXTAREA'){
                        if(item.value === ""){
                            item.classList.add('empty');
                            isEmpty = true;
                        }else{
                            if (item.classList.contains('empty')){
                                item.classList.remove('empty');
                            }
                        }
                    }
                });

                if (!isEmpty){
                    const data = {
                        'coords': coords,
                        'address': address,
                        'reviews': [
                            {
                                'name': name,
                                'spot': spot,
                                'comment': comment
                            }
                        ],
                        'yandexMapPointsObject': true,

                    };
                    //localStorage.setItem(data.address, JSON.stringify(data));
                    this.sm.commentAdd(data.address, data);
                    //this.balloon = await this.myApiMap.createBalloon(data.coords, data);
                    // console.log(data.coords, data);
                    //this.myApiMap.createCluster(this.sm.getPoints(), this.sm.parseStorage());
                }
            }


        })

    }
}