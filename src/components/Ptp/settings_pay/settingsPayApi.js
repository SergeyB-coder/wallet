import { url } from "../../../const/urls";

export function getUserMethodsPay(pars, callback) {
    fetch(url + '/getusermethodspay', {
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

export function newMethodPay(pars, callback) {
    fetch(url + '/newmethodpay', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pars)
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('newmethodpay data', data)
            return callback(data)
        });
}

export function getMethodInfo(pars, callback) {
    fetch(url + '/methodinfo', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pars)
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('methodinfo data', data)
            return callback(data)
        });
}

export function getCompaniesPay(pars, callback) {
    fetch(url + '/companiespay', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pars)
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('methodinfo data', data)
            return callback(data)
        });
}

export function updateMethodPay(pars, callback) {
    fetch(url + '/updatemethod', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pars)
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('updatemethod data', data)
            return callback(data)
        });
}