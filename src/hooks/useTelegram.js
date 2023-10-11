const tg = window.Telegram.WebApp

export function useTelegram () {
    return {
        tg,
        query_id: tg.initDataUnsafe.query_id,

        
        user_id: tg.initDataUnsafe.user.id,
        first_name: tg.initDataUnsafe.user.first_name,
        init_data: tg.initData,
        language_code: tg.initDataUnsafe.user.language_code


        // user_id: 638484379,
        // first_name: 'Sash',
        
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

    }
}


// const user_id = '652065848'
// const user_id = '222'