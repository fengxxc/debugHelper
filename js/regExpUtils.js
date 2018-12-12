
class RegExpUtils {
    constructor() {
        
    }

    static getMatchIndex(regExp, str) {
        let rs = []
        let re = null
        while (re = regExp.exec(str)) {
            const start = re.index
            // console.log(start)
            // console.log(regExp.lastIndex)
            rs.push([start, regExp.lastIndex-1])
        }
        return rs
    }

    static getMatchWarpHtml(regExp, str, warpHtml, warpHtmlEnd) {
        const rs = RegExpUtils.getMatchIndex(regExp, str)
        const strArr = str.split('')
        for (let i = 0; i < rs.length; i++) {
            const r = rs[i];
            strArr[r[0]] = warpHtml + strArr[r[0]]
            strArr[r[1]] = strArr[r[1]] + warpHtmlEnd
        }
        return strArr
    }
}