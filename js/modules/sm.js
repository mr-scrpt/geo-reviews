module.exports = class {
    parseStorage(){
        let arrData =[];
        const storage = localStorage;

        for (let i = 0; i < storage.length; i++){
            let name = storage.key(i);
            let value = storage.getItem(name);

            if (value.match(/yandexMapPointsObject/i )) {
                value = JSON.parse(value);
                arrData.push(value);
            }
        }
        return arrData;

    }

    newComment(data){
        let [review] = data;
        const reviewsItem = document.createElement('div');
        reviewsItem.classList.add('reviews__item');
        reviewsItem.innerHTML = `            
                <div class="reviews__header">
                <span class="reviews__author">${review.name}</span>
                <span class="reviews__spot">${review.spot}</span>
                <span class="reviews__data">${review.data}</span>
                </div>
                <div class="reviews__text">${review.comment}</div>          
        `;

        return reviewsItem;

    }

    getPoints(){
        let data = this.parseStorage();
        let points = [];

        data.forEach(item => points.push(item.coords.split(',')));

        return points;
    }


    commentAdd(name, data){
        let spot = localStorage[name];
        // Если место еще не добавлено в localstorage, то добавляем ему отзыв
        if(!spot){
            console.log('новый адрес!');
            localStorage.setItem(name, JSON.stringify(data));

        }else { // Если место существует в localstorage, то добавляем к уде имеющимся отзывам - новый

            let reviews = JSON.parse(spot);
            let allComment = reviews.reviews;
            //data.reviews = data.reviews.concat(allComment);
            data.reviews = [ ...data.reviews, ...allComment];

            localStorage.setItem(name, JSON.stringify(data))
        }
    }

}