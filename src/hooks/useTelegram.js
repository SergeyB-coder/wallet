const tg = window.Telegram.WebApp

export function useTelegram () {
    return {
        tg,
        query_id: tg.initDataUnsafe.query_id,

        
        user_id: tg.initDataUnsafe.user.id,
        first_name: tg.initDataUnsafe.user.first_name,
        init_data: tg.initData,
        language_code: tg.initDataUnsafe.user.language_code,


        
        // user_id: 164441883,
        // first_name: 'Klepa Qeqi',
        // language_code: 'ru'


        // user_id: 638484379,
        // first_name: 'Sash',
        // language_code: 'en'
        
        // user_id: 745921856,
        // first_name: 'Alex', 

        
        
        // init_data: 'tg',
        // user_id: '1610258157',
        // user_id: 652065848,
        // first_name: 'Srg',
        // user_id: '1234567',
        // first_name: 'Srg',
        // user_id: 671690853,
        // first_name: 'Tradeex'
        // user_id: '2125428302',

        // user_id: '184934838',
        
        // first_name: 'GF',
        // language_code: 'ru'

    }
}


// const user_id = '652065848'
// const user_id = '222'