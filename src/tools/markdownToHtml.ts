/**
 * @fileoverview Converts markdown to html
 */

export class markdownToHtml {
    constructor() { }

    /**
     * convert markdown to html
     * @param {string} markdown
     * @returns {string} html
     */
    convert(markdown: string): string {
        let html = markdown
        // handle headers syntax (h1, h2, h3, h4, h5, h6)
        // h6 first, because h6 is the most common
        html = html.replace(/^######+\s+(.+)/gm, '<h6>$1</h6>')
        html = html.replace(/^#####+\s+(.+)/gm, '<h5>$1</h5>')
        html = html.replace(/^####+\s+(.+)/gm, '<h4>$1</h4>')
        html = html.replace(/^###+\s+(.+)/gm, '<h3>$1</h3>')
        html = html.replace(/^##+\s+(.+)/gm, '<h2>$1</h2>')
        html = html.replace(/^#+\s+(.+)/gm, '<h1>$1</h1>')

        // handle list syntax (unordered and ordered)
        html = html.replace(/^\*\s+(.+)/gm, '<li>$1</li>')
        html = html.replace(/^-\s+(.+)/gm, '<li>$1</li>')
        html = html.replace(/^\d+\.\s+(.+)/gm, '<li>$1</li>')

        // handle emphasis syntax (bold and italic)
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        html = html.replace(/__(.+?)__/g, '<strong>$1</strong>')
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
        html = html.replace(/_(.+?)_/g, '<em>$1</em>')

        // handle a and img syntax (a and img)
        html = html.replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1">')
        html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')

        // handle blockquote syntax (blockquote)
        html = html.replace(/^>\s+(.+)/gm, '<blockquote>$1</blockquote>')

        // handle code syntax (code and pre)
        html = html.replace(/```\n([\s\S]+?)\n```/g, '<pre><code>$1</code></pre>')
        html = html.replace(/`(.+?)`/g, '<code>$1</code>')

        // handle br syntax (br)
        html = html.replace(/\n/g, '<br>')
        return html
    }

    /**
     * convert markdown to html(container)
     * @param {HTMLElement} container
     */
    convertContainer(container: HTMLElement): void {
        const markdown = container.innerText
        container.innerHTML = this.convert(markdown)
    }

    /**
     * cut html
     * @param {string} html
     * @param {number} length
     * @returns {string} cut html
     */
    cutHtml(html: string, length: number): string {
        let result = ''
        let count = 0
        let tag = ''
        let isTag = false
        for (let i = 0; i < html.length; i++) {
            if (count >= length) {
                break
            }
            if (html[i] === '<') {
                isTag = true
            }
            if (html[i] === '>') {
                isTag = false
                result += tag + '>'
                tag = ''
                continue
            }
            if (isTag) {
                tag += html[i]
                continue
            }
            result += html[i]
            count++
        }
        return result + '...'
    }
}