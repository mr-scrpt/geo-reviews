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


        const points = await this.sm.parseStorage();

        for(let point of points){
            let reviews = point.reviews;
            reviews.forEach(async review=>{
                await this.createCluster(point.coords, this.yandexApi, this.cluster);
            });

        }


        this.yandexApi.events.add('click', async e => {
            this.point = await this.myApiMap.getMapPosition(e);
            const pointCoords = this.point.coords;
            const pointAddress = this.point.address;
            console.log(pointAddress);
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

        this.cluster.events.add('click', async e => {
            this.point = await this.myApiMap.getMapPosition(e);
            const pointCoords = this.point.coords;
            const pointAround =  pointCoords.map( coord => parseFloat(coord).toFixed(2));
            //const pointAddress = await this.point.address;
            const data = await localStorage.getItem(pointAround);



            if (this.balloon) {
                this.balloon.balloon.close();
            }
            const object = e.get('target');
            // Тут заберем данные из локалсторедж и поло
            if (!object.getGeoObjects) {

                this.balloon = await this.myApiMap.createBalloon(object.geometry._coordinates, JSON.parse(data))

            }

        });




        document.body.addEventListener('click', async e => {
            if (e.target.classList.contains('button')){
                e.preventDefault();
                const address = document.querySelector('.popup__address').innerText;
                const coords = document.querySelector('.form__coords').value.split(',');
                const name = document.querySelector('.form__name').value;
                const spot = document.querySelector('.form__spot').value;
                const comment = document.querySelector('.form__comment').value;
                const reviewsList = document.querySelector('.reviews__list');
                const reviewsEmpty = document.querySelector('.reviews__empty');

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
                    const dataComment = new Date();
                    const dataOptions = {
                        year: 'numeric',
                        month: 'numeric',
                        weekday: 'long',
                        timezone: 'UTC',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric'
                    };
                    console.log(coords);
                    const pointAround =  coords.map( coord => parseFloat(coord).toFixed(2));

                    const data = {
                        'pointAround': pointAround,
                        'coords': coords,
                        'address': address,
                        'reviews': [
                            {
                                'name': name,
                                'spot': spot,
                                'comment': comment,
                                'data': dataComment.toLocaleString("ru", dataOptions)
                            }
                        ],
                        'yandexMapPointsObject': true,

                    };

                    //reviewsList.innerHTML = this.sm.newComment(data.reviews);
                    reviewsList.appendChild(this.sm.newComment(data.reviews));
                    if(reviewsEmpty){
                        reviewsEmpty.parentNode.removeChild(reviewsEmpty);
                    }

                    await this.sm.commentAdd(pointAround, data);
                    await this.createCluster(data.coords, this.yandexApi, this.cluster);

                }
            }


        })

    }

    async createCluster(coords, map, cluster) {
        const placemark = new ymaps.Placemark(coords);
        cluster.add(placemark);
        map.geoObjects.add(this.cluster);
    }
}