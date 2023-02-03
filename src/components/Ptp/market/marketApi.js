import { url } from "../../../const/urls";

export function getOrders(pars, callback) {
    fetch(url + '/getorders', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            //   mode: 'no-cors',
            body: JSON.stringify({
                user_id: pars.user_id
            })
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('data', data)
            
            return callback(data)
        });
}

export function sendBuy(pars, callback) {
    fetch(url + '/sendbuy', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            //   mode: 'no-cors',
            body: JSON.stringify({
                user_id: pars.user_id,
                order_id: pars.order_id 
            })
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('data', data)
            
            return callback(data)
        });
}