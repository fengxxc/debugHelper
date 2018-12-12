const testStr = `
SELECT
    (SELECT UUID() from dual) AS 'id'
    ,es.o_ksh AS 'ksh'
    ,es.o_csny AS 'csny'
    ,(SELECT b1 FROM bb WhERE b = '1') AS 'b1'
    ,m.name
FROM enroll_student es, (select f FROM ff) ff
left join major m ON m.code = es.zydm
WHERE 1=1
    AND es.o_xm = 'qwer'
    OR es.year = '2018'
group by es.o_csny, m.name
having 2 = 2 AND 1=1
order by es.o_ksh DESC, es.o_csny ASC
LIMIT 0, 100
`


class SelectSqlMod {
    constructor(dJson) {
        this.oSelectJsonArr = dJson
        // || {
        //     _SELECT: [],
        //     _FROM: [],
        //     _WHERE: [],
        //     _GROUP BY: [],
        //     _HAVING: [],
        //     _ORDER BY: [],
        //     _LIMIT: []
        // }
    }

    isNull() {
        return this.oSelectJsonArr ? false : true;
    }

    formatHTML() {
        let html = []
        console.log(this.oSelectJsonArr)
        this._formatHTML(this.oSelectJsonArr, html, 0)
        return html.join('')
    }

    _formatHTML(sqlModO, html, level) {
        const subLevel = level + 1
        const indent = SelectSqlMod._getSpanHTML(level) // 本块缩进
        const subindent = (level == 0) ? SelectSqlMod._getSpanHTML(1) : SelectSqlMod._getSpanHTML(subLevel) // 下级块缩进
        // select
        const selects = sqlModO['_SELECT']
        if (selects && selects.length != 0) {
            if (level != 0) html.push(`<br>`)
            html.push(`${indent}<span class="kword">SELECT</span>`)
            for (let i = 0; i < selects.length; i++) {
                html.push(`<br>${subindent}`)
                // if (i != 0) html.push(`, `)
                const select = selects[i];
                // 一个select条件
                for (let j = 0; j < select.length; j++) {
                    const _s = select[j];
                    if (typeof _s == 'string') {
                        if (j != 0 && !_s.match(/^,|\(/))  // 非第一个、非逗号、非括号
                            html.push(` `)
                        html.push(`${SqlModUtil.formatKeywordInSql(_s, m=>'<span class="kword">'+m.toUpperCase()+'</span>')}`)
                    } else { // 括号包裹的函数 // 或子查询
                        html.push(`(`)
                        this._formatHTML(_s, html, subLevel + 1)
                        if (_s['_SELECT'] && _s['_SELECT'].length == 0)
                            html.push(`)`)
                        else
                            html.push(`<br>${subindent})`)
                    }

                }
            }
            // html.push(`<br>${indent}`)
        }
        // from
        const froms = sqlModO['_FROM']
        if (froms && froms.length != 0) {
            html.push(`<br>${indent}<span class="kword">FROM</span>`)
            for (let i = 0; i < froms.length; i++) {
                html.push(`<br>${subindent}`)
                // if (i != 0) html.push(`, `)
                const from = froms[i];
                // 一个from条件
                for (let j = 0; j < from.length; j++) {
                    const _s = from[j];
                    if (typeof _s == 'string') {
                        if (j != 0 && !_s.match(/^,|\(/))  // 非第一个、非逗号、非括号
                            html.push(` `)
                        html.push(`${SqlModUtil.formatKeywordInSql(_s, m=>'<span class="kword">'+m.toUpperCase()+'</span>')}`)
                    } else { // 括号包裹的函数 // 或子查询
                        html.push(`(`)
                        this._formatHTML(_s, html, subLevel + 1)
                        if (_s['_SELECT'] && _s['_SELECT'].length == 0)
                            html.push(`)`)
                        else
                            html.push(`<br>${subindent})`)
                    }

                }
            }
            // html.push(`<br>${indent}`)
        }
        // where
        const wheres = sqlModO['_WHERE']
        if (wheres && wheres.length != 0) {
            html.push(`<br>${indent}<span class="kword">WHERE</span>`)
            for (let i = 0; i < wheres.length; i++) {
                html.push(`<br>${subindent}`)
                // if (i != 0) html.push(`, `)
                const where = wheres[i];
                // 一个where条件
                for (let j = 0; j < where.length; j++) {
                    const _s = where[j];
                    if (typeof _s == 'string') {
                        if (j != 0 && !_s.match(/^,|\(/))  // 非第一个、非逗号、非括号
                            html.push(` `)
                        html.push(`${SqlModUtil.formatKeywordInSql(_s, m=>'<span class="kword">'+m.toUpperCase()+'</span>')}`)
                    } else { // 括号包裹的函数 // 或子查询
                        html.push(`(`)
                        this._formatHTML(_s, html, subLevel + 1)
                        if (_s['_SELECT'] && _s['_SELECT'].length == 0)
                            html.push(`)`)
                        else
                            html.push(`<br>${subindent})`)
                    }

                }
            }
        }
        // group by
        const groups = sqlModO['_GROUP BY']
        if (groups && groups.length != 0) {
            html.push(`<br>${indent}<span class="kword">GROUP BY</span>`)
            for (let i = 0; i < groups.length; i++) {
                html.push(`<br>${subindent}`)
                // if (i != 0) html.push(`, `)
                const group = groups[i];
                // 一个group条件
                for (let j = 0; j < group.length; j++) {
                    const _s = group[j];
                    if (typeof _s == 'string') {
                        if (j != 0 && !_s.match(/^,|\(/))  // 非第一个、非逗号、非括号
                            html.push(` `)
                        html.push(`${SqlModUtil.formatKeywordInSql(_s, m=>'<span class="kword">'+m.toUpperCase()+'</span>')}`)
                    } else {
                        html.push(`(`)
                        this._formatHTML(_s, html, subLevel + 1)
                        if (_s['_SELECT'] && _s['_SELECT'].length == 0)
                            html.push(`)`)
                        else
                            html.push(`<br>${subindent})`)
                    }

                }
            }
            // html.push(`<br>${indent}`)
        }
        // having
        const havings = sqlModO['_HAVING']
        if (havings && havings.length != 0) {
            html.push(`<br>${indent}<span class="kword">HAVING</span>`)
            for (let i = 0; i < havings.length; i++) {
                html.push(`<br>${subindent}`)
                // if (i != 0) html.push(`, `)
                const having = havings[i];
                // 一个having条件
                for (let j = 0; j < having.length; j++) {
                    const _s = having[j];
                    if (typeof _s == 'string') {
                        if (j != 0 && !_s.match(/^,|\(/))  // 非第一个、非逗号、非括号
                            html.push(` `)
                        html.push(`${SqlModUtil.formatKeywordInSql(_s, m=>'<span class="kword">'+m.toUpperCase()+'</span>')}`)
                    } else { // 括号包裹的函数 // 或子查询
                        html.push(`(`)
                        this._formatHTML(_s, html, subLevel + 1)
                        if (_s['_SELECT'] && _s['_SELECT'].length == 0)
                            html.push(`)`)
                        else
                            html.push(`<br>${subindent})`)
                    }

                }
            }
        }
        // order by
        const orders = sqlModO['_ORDER BY']
        if (orders && orders.length != 0) {
            html.push(`<br>${indent}<span class="kword">ORDER BY</span>`)
            for (let i = 0; i < orders.length; i++) {
                html.push(`<br>${subindent}`)
                // if (i != 0) html.push(`, `)
                const order = orders[i];
                // 一个order条件
                for (let j = 0; j < order.length; j++) {
                    const _s = order[j];
                    if (typeof _s == 'string') {
                        if (j != 0 && !_s.match(/^,|\(/))  // 非第一个、非逗号、非括号
                            html.push(` `)
                        html.push(`${SqlModUtil.formatKeywordInSql(_s, m=>'<span class="kword">'+m.toUpperCase()+'</span>')}`)
                    } else {
                        html.push(`(`)
                        this._formatHTML(_s, html, subLevel + 1)
                        if (_s['_SELECT'] && _s['_SELECT'].length == 0)
                            html.push(`)`)
                        else
                            html.push(`<br>${subindent})`)
                    }

                }
            }
            // html.push(`<br>${indent}`)
        }
        // limit
        const limit = sqlModO['_LIMIT']
        if (limit && limit.length != 0) {
            html.push(`<br>${indent}<span class="kword">LIMIT</span>`)
            html.push(' ' + limit.join())
        }
        // return html.join('')
    }


    static _getSpanHTML(count) {
        let h = []
        // for (let i = 0; i < count; i++) h.push('&nbsp;&nbsp;')
        // for (let i = 0; i < count; i++) h.push('&#9;')
        for (let i = 0; i < count; i++) 
            h.push('<span style="mso-tab-count:1; width: 1.5rem; display: inline-block;">&#9;</span>')
        return h.join('')
    }
}

class SqlModUtil {
    static parse(sql) {
        // const SPL_KEY = '^v^'
        // 字符串预处理
        sql = sql.replace(/^\s\s*/, '').replace(/\s\s*$/, '') // 去掉首尾空格
        sql = sql.replace(/(\s+|\n+)/g, " ") // 多个空格或换行，替换成一个空格
        console.log(sql)
        const keyWordReg = `(SELECT
            |\\s+FROM
            |\\s+INNER\\s+JOIN
            |\\s+LEFT\\s+JOIN
            |\\s+RIGHT\\s+JOIN
            |\\s+WHERE
            |\\s+GROUP\\s+BY
            |\\s+HAVING
            |\\s+ORDER\\s+BY
            |\\s+LIMIT\\s+
            |\\(
            |\\)
            |,
            |\\s+DESC
            |\\s+ASC
            |\\s+AND
            |\\s+OR
            |\\s+AS
            |\\s+ON
        )`.replace(/(\s+|\n+)/g, '')
        let sqlarr = sql.split(new RegExp(keyWordReg, 'i'))
            .filter(s => !(s == null || s == '' || s == ' '))
            .map(s => s.trim())
        console.log(sqlarr)
        const sqlM = SqlModUtil._parse(sqlarr)
        return new SelectSqlMod(sqlM)
    }

    static _parse(sqlarr) {
        if (!sqlarr || sqlarr.length == 0) return {}
        switch (sqlarr[0].toUpperCase()) {
            case 'SELECT':
                return SqlModUtil._parseSelect(sqlarr)
            case 'UPDATE': 
                // TODO...
            default: // 函数、表达式
                return `(${sqlarr.join(' ')})`
        }

        
    }

    static _parseSelect(sqlarr) {
        let sqlM = {
            '_SELECT': [],
            '_FROM': [],
            '_WHERE': [],
            '_GROUP BY': [],
            '_HAVING': [],
            '_ORDER BY': [],
            '_LIMIT': []
        }
        let curProp = null
        const complateProp = (prop) => {
            switch (prop) {
                case '_SELECT':
                case '_GROUP BY':
                case '_ORDER BY':
                    sqlM[prop] = SqlModUtil.arraySplit(sqlM[prop], ',', 'right')
                    break;
                case '_FROM':
                    sqlM[prop] = SqlModUtil.arraySplit(sqlM[prop], /(,|INNER\s+JOIN|LEFT\sJOIN|RIGHT\s+JOIN)/i, 'right')
                    break;
                case '_WHERE':
                case '_HAVING':
                    sqlM[prop] = SqlModUtil.arraySplit(sqlM[prop], /(AND|OR)/i, 'right')
                    break;
                case '_LIMIT':
                    sqlM[prop] = SqlModUtil.arraySplit(sqlM[prop], ',', 'remove')
                    break;
            }
        }
        for (let i = 0; i < sqlarr.length; i++) {
            const s = sqlarr[i]
            switch (s.toUpperCase()) {
                case 'SELECT':
                case 'FROM':
                case 'WHERE':
                case 'GROUP BY':
                case 'HAVING':
                case 'ORDER BY':
                case 'LIMIT':
                    if (curProp)
                        complateProp(curProp)
                    curProp = '_' + s.toUpperCase()
                    break
                case '(':
                    if (i == sqlarr.length - 1) return sqlM
                    let j = i + 1
                    for (let braCount = 1; j < sqlarr.length; j++) { // braCount 括号嵌套层数
                        const s2 = sqlarr[j]
                        if (s2.toUpperCase() == '(') braCount++
                        if (s2.toUpperCase() == ')') braCount--
                        if (braCount == 0) break
                    }
                    
                    sqlM[curProp].push(SqlModUtil._parse(sqlarr.slice(i + 1, j)))
                    i = j
                    break
                default:
                    try {
                        sqlM[curProp].push(s)
                    } catch (error) {
                        debugger
                    }
                    break
            }
        }
        if (curProp)
            complateProp(curProp)
        return sqlM
    }

    /**
     * whereSepar 分隔符在结果中处于什么位置: 
     * 'left':上一个元素末尾 | 'right':下一个元素开头 | 'own':自己单独一个数组 | 'remove':移除
     */
    static arraySplit(arr, separ, whereSepar = 'remove') {
        // arr = ['ab', 'cd', ',', 'ef', 'gh', ',', 'ij']
        if (arr.length == 0) {
            return arr
        }
        let start = 0
        let res = []
        for (let i = 0; i < arr.length; i++) {
            const e = arr[i];
            // if (e == separ) {
            if (typeof e == 'string' && e.search(separ) != -1) {
                res.push(arr.slice(start, i))
                if (i == arr.length - 1) {
                    break
                }
                switch (whereSepar) {
                    case 'left':
                        res[res.length - 1].push(e)
                        start = i + 1
                        break;
                    case 'right':
                        start = i
                        break;
                    case 'own':
                        res.push([e])
                        start = i + 1
                        break;
                    case 'remove':
                        start = i + 1
                        break;
                    default:
                        start = i + 1
                        break;
                }

            }
        }
        res.push(arr.slice(start))
        return res
    }

    static formatKeywordInSql(sql, fun) {
        const r = new RegExp(SqlModUtil.getTopKeyWordReg(), 'ig')
        const ms = sql.replace(r, word => SqlModUtil.formatWord(word, fun))
        return ms
    }

    static formatWord(keyword, fun) {
        if (fun && typeof fun == 'function')
            return fun(keyword)
        return keyword
    }

    static isKey(word) {
        const keys = {
            'INNER JOIN': true,
            'LEFT JOIN': true,
            'RIGHT JOIN': true,
            'AND': true,
            'OR': true,
            'LIKE': true,
            'IS': true
        }
        return keys[word.toUpperCase()] ? true : false
    }
    static getTopKeyWordReg() {
        return `(
            INNER\\s+JOIN
            |LEFT\\s+JOIN
            |RIGHT\\s+JOIN
            |(\\s+DESC|^DESC)
            |(\\s+ASC|^ASC)
            |(\\s+AND|^AND)
            |(\\s+OR|^OR)
            |(\\s+AS|^AS)
            |(\\s+ON|^ON)
            |(\\s+LIKE|^LIKE)
            |(\\s+SUM|^SUM)
            |(\\s+COUNT|^COUNT)
            |(\\s+AVG|^AVG)
            |(\\s+CASE|^CASE)
            |(\\s+IF|^IF)
            |(\\s+ELSE|^ELSE)
            |(\\s+THEN|^THEN)
            |(\\s+WHEN|^WHEN)
            |(\\s+BETWEEN|^BETWEEN)
            |(\\s+END|^END)
        )`.replace(/(\s+|\n+)/g, '')
    }
}

// const sm = SqlModUtil.parse(testStr)
// console.log(sm)
// console.log(JSON.stringify(sm))
// const smf = sm.formatHTML()
// console.log(smf)
// document.write(smf)

class Column {
    constructor() {
        this.feild = null
        this.column = null
        this.alias = null
    }
    feild(val) {
        if (val != null) {
            this.feild = val
            return this
        }
        return this.feild
    }
    column(val) {
        if (val != null) {
            this.column = val
            return this
        }
        return this.column
    }
    alias(val) {
        if (val != null) {
            this.alias = val
            return this
        }
        return this.alias
    }

}