const tg = window.Telegram.WebApp

export function useTelegram () {
    return {
        tg,
        query_id: tg.initDataUnsafe.query_id,
        user_id: tg.initDataUnsafe.user.id,
        first_name: tg.initDataUnsafe.user.first_name,
        // user_id: 638484379,/
        // user_id: '2125428302',
        // user_id: 652065848,
        // first_name: 'Srg',
        // user_id: '1234567',
        // first_name: 'Super'
    }
}

// const user_id = '652065848'
// const user_id = '222'