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
            let reviews = point.reviews.reverse();
            reviews.forEach(async (review, i) =>{
                await this.createCluster(point.coords, this.yandexApi, this.cluster, point, i);
            });

        }


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
            if (this.cluster) {
                this.cluster.balloon.close();
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



            //console.log(e.originalEvent.currentTarget.balloon);
            //console.log(e);
            const object = e.get('target');

            //console.log('test here');


            if (!object.getGeoObjects) {
                this.cluster.balloon.close();
                this.balloon = await this.myApiMap.createBalloon(object.geometry._coordinates, JSON.parse(data))

            }

            // console.log(this.cluster.balloon);
            // console.log(e.originalEvent.currentTarget.balloon);
            // if (this.cluster.balloon !== e.originalEvent.currentTarget.balloon) {
            //     this.cluster.balloon.close()
            // }

        });




        document.body.addEventListener('click', async e => {
            const target = e.target;
            if (target.classList.contains('button')){
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


                    reviewsList.appendChild(this.sm.newComment(data.reviews));
                    if(reviewsEmpty){
                        reviewsEmpty.parentNode.removeChild(reviewsEmpty);
                    }

                    await this.sm.commentAdd(pointAround, data);


                    await this.createCluster(data.coords, this.yandexApi, this.cluster, data);



                }
            }
            if (target.classList.contains('ballon__header-address')){
                e.preventDefault();
                const coords = [...target.dataset.coord.split(',')];

                const pointAround =  coords.map( coord => parseFloat(coord).toFixed(2));
                const data = await localStorage.getItem(pointAround);


                if (this.cluster) {
                    this.cluster.balloon.close();
                }
                this.balloon = await this.myApiMap.createBalloon(coords, JSON.parse(data))





            }

        })

    }

    async createCluster(coords, map, cluster, data, i = 0) {

        var copy = Object.assign({}, data);

        copy.reviews = data.reviews[i];

        const placemark = await new ymaps.Placemark(coords, copy);
        await cluster.add(placemark);

        map.geoObjects.add(this.cluster);
    }
}