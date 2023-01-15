/**
 * @file date formatter
 * @description date formatter
 * @author Okysu
 * @date 2022-12-25
 */

/**
 * datestamp2date
 * @param timestamp timestamp
 * @param formats formats
 * @returns {string} date
 */
export const dateFormat = function (timestamp: number, formats: FormatsEnums = FormatsEnums.YMD): string {
    formats = formats || 'Y-m-d'

    const zero = function (value: number): string | number {
        if (value < 10) {
            return '0' + value
        }
        return value
    }

    const myDate = timestamp ? new Date(timestamp) : new Date()

    const year = myDate.getFullYear()
    const month = zero(myDate.getMonth() + 1)
    const day = zero(myDate.getDate())

    const hour = zero(myDate.getHours())
    const minite = zero(myDate.getMinutes())
    const second = zero(myDate.getSeconds())

    return formats.replace(/Y|m|d|H|i|s/ig, function (matches: string): any {
        return ({
            Y: year,
            m: month,
            d: day,
            H: hour,
            i: minite,
            s: second
        })[matches]
    })
}
/**
 * date2datestamp
 * @enum {string} formats
 */
export enum FormatsEnums {
    YMD = 'Y-m-d',
    YMDHIS = 'Y-m-d H:i:s',
    _YMD = 'Y年m月d日',
    _YMDHIS = 'Y年m月d日 H时i分s秒',
    HI = 'H:i',
}