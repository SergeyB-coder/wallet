import { url } from "../../const/urls";

export function getUserData(pars, callback) {
    fetch(url + '/getuserdata', {
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

export function getWallet(pars, callback) {
    fetch(url + '/getwallet', {
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
            console.log('data getwallet', data)
            
            return callback(data)
        });
}