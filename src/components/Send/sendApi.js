import { url } from "../../const/urls";

export function sendTo(pars, callback) {
    fetch(url + '/sendto', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pars)
        })
        .then((response) => response.json())
        .then((data) => {
            // console.log('data sendto', data)
            
            return callback(data)
        });
}

export function balanceTransfer(pars, callback) {
    fetch(url + '/balancetransfer', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pars)
        })
        .then((response) => response.json())
        .then((data) => {
            // console.log('data balancetransfer', data)
            
            return callback(data)
        });
}