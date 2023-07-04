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


export function getMyOrders(pars, callback) {
    fetch(url + '/getmyorders', {
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


export function getOrderDeals(pars, callback) {
    fetch(url + '/getorderdeals', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            //   mode: 'no-cors',
            body: JSON.stringify(pars)
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('data', data)
            
            return callback(data)
        });
}


export function getOrderMethods(pars, callback) {
    fetch(url + '/getordermethods', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            //   mode: 'no-cors',
            body: JSON.stringify(pars)
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('getordermethods data', data)
            
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
            body: JSON.stringify(pars)
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('data', data)
            
            return callback(data)
        });
}

export function sendAcceptDeal(pars, callback) {
    fetch(url + '/acceptdeal', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            //   mode: 'no-cors',
            body: JSON.stringify(pars)
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('data acceptdeal', data)
            
            return callback(data)
        });
}

export function sendEndDeal(pars, callback) {
    fetch(url + '/enddeal', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            //   mode: 'no-cors',
            body: JSON.stringify(pars)
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('data enddeal', data)
            
            return callback(data)
        });
}

export function sendCancelDeal(pars, callback) {
    fetch(url + '/canceldeal', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            //   mode: 'no-cors',
            body: JSON.stringify(pars)
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('data canceldeal', data)
            
            return callback(data)
        });
}

export function getDealInfo(pars, callback) {
    fetch(url + '/getdealinfo', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            //   mode: 'no-cors',
            body: JSON.stringify(pars)
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('data', data)
            
            return callback(data)
        });
}

export function sendConfirm(pars, callback) {
    fetch(url + '/confirm', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            //   mode: 'no-cors',
            body: JSON.stringify(pars)
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('data', data)
            
            return callback(data)
        });
}


export function setEndDeal(pars, callback) {
    fetch(url + '/enddealn', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pars)
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('data', data)
            
            return callback(data)
        });
}

export function newAppilate(pars, callback) {
    fetch(url + '/newappilate', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pars)
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('data', data)
            
            return callback(data)
        });
}