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

        //console.log(arrData);
        return arrData;

    }
    getPoints(){
        let data = this.parseStorage();
        let points = [];

        data.forEach(item => points.push(item.coords.split(',')));

        return points;
    }




}