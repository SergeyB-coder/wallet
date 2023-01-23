const tg = window.Telegram.WebApp

export function useTelegram () {
    return {
        tg,
        query_id: tg.initDataUnsafe.query_id
    }
}