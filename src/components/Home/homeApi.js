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


export function getBalance(pars, callback) {
    fetch(url + '/getbalance', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pars)
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('data getbalance', data)
            
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

export function getWalletTRX(pars, callback) {
    fetch(url + '/getwallettrx', {
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
            console.log('data getwallettrx', data)
            
            return callback(data)
        });
}



export function getUserDeals(pars, callback) {
    fetch(url + '/getuserdeals', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pars)
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('data getUserDeals', data)
            
            return callback(data)
        });
}

export function getTransactions(pars, callback) {
    fetch(url + '/gettransactions', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pars)
    })
    .then((response) => response.json())
    .then((data) => {
        console.log('data gettransactions', data)
        
        return callback(data)
    });
}


export function getUserSumOrders(pars, callback) {
    fetch(url + '/getusersumorders', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pars)
    })
    .then((response) => response.json())
    .then((data) => {
        console.log('data getusersumorders', data)
        
        return callback(data)
    });
}

export function getUserSumBlocks(pars, callback) {
    fetch(url + '/getusersumblocks', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pars)
    })
    .then((response) => response.json())
    .then((data) => {
        console.log('data getusersumblocks', data)
        
        return callback(data)
    });
}






export function applyRef(pars, callback) {
    fetch(url + '/applyref', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pars)
    })
    .then((response) => response.json())
    .then((data) => {
        console.log('data applyref', data)
        
        return callback(data)
    });
}