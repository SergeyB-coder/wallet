const tg = window.Telegram.WebApp

export function useTelegram () {
    return {
        tg,
        query_id: tg.initDataUnsafe.query_id,
        user_id: tg.initDataUnsafe.user.id
    }
}