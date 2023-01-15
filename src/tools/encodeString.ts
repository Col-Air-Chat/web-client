import pako from 'pako'
import { Base64 } from 'js-base64'

export class encodeString {
    constructor() { }

    /**
     * gzip压缩字符串
     * gzip string
     * @param {string} str
     * @returns {string} gziped string
     */
    encode(str: string): string {
        const base64Str = Base64.encode(str)
        const gzipedStr = pako.gzip(base64Str) as any as string
        const value = gzipedStr.length < base64Str.length ? gzipedStr : base64Str
        const type = gzipedStr.length < base64Str.length ? 'gzip' : 'base64'
        return [type, value].join(':')
    }

    /**
     * gzip解压字符串
     * gzip decode string
     * @param {string} str
     * @returns {string} decoded string
     * @throws {Error} The string is not gziped or base64
     */
    decode(str: string): string {
        const [type, value] = str.split(':')
        if (type === 'gzip') {
            const gzipedUnit = value.split(',').map((item: string) => parseInt(item)) as any as Uint8Array
            const base64Str = pako.ungzip(gzipedUnit, { to: 'string' })
            return Base64.decode(base64Str)
        } else if (type === 'base64') {
            return Base64.decode(value)
        } else {
            throw new Error('The string is not gziped or base64')
        }
    }
}