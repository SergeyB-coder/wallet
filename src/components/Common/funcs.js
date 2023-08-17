export function dateConvert (s) {
    const month = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
    const date = s.slice(8, 10) + ' ' + month[parseInt(s.slice(5, 7))-1] + ' ' + s.slice(0, 4) + ', ' + s.slice(11, 13) + ':' + s.slice(14, 16)
    return date
}