import { url } from "../../../const/urls";

export function getDealMessages(pars, callback) {
    fetch(url + '/getdealmessages', {
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
            // console.log('data getdealmessages', data)
            
            return callback(data)
        });
}