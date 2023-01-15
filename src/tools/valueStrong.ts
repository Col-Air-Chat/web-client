/**
 * @file valueStrong.ts
 * @description Rate the complexity of the text
 */

export class valueStrong {
    constructor() { }

    /**
     * Rate the complexity of the text
     * @param {string} text
     * @returns {number} value
     */
    rate(text: string): number {
        const specialChars = '!@#$%^&*()_+{}|:"<>?[];\',./~`'
        const length = text?.length
        if (!length) return 0
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,32}$/.test(text)) return 0
        let value = 0
        let repeatChar = ''
        let repeatCharCount = 0
        let repeatCharValue = 0
        let weight = length / 20;
        let single = 12 - (40 / length)

        for (let i = 0; i < length; i++) {
            const char = text[i]

            if (specialChars.includes(char)) {
                value += single * (weight + 0.1 > 1 ? 1 : weight + 0.1)
            } else if (/[0-9]/.test(char)) {
                value += single / 1.15 * (weight + 0.1 > 1 ? 1 : weight + 0.1)
            } else if (/[a-zA-Z]/.test(char)) {
                value += single / 1.15 * (weight + 0.1 > 1 ? 1 : weight + 0.1)
            }

            if (char === repeatChar) {
                repeatCharCount++
            } else {
                repeatChar = char
                repeatCharCount = 1
            }

            repeatCharValue = repeatCharCount * 1.05
        }
        value -= repeatCharValue * (0.75 + (1 - weight) * 0.25)

        value *= 1.15

        if (value > 100)
            value = 100
        if (value < 0)
            value = 0

        return Math.round(value)
    }
}
