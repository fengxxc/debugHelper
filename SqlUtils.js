const isKeyL = (str) => typeof str === 'string' && (
    str.toLowerCase() == SqlKey.SELECT 
    || str.toLowerCase() == SqlKey.FROM 
    || str.toLowerCase() == SqlKey.LEFT_JOIN 
    || str.toLowerCase() == SqlKey.RIGHT_JOIN 
    || str.toLowerCase() == SqlKey.INNER_JOIN 
    || str.toLowerCase() == SqlKey.WHERE 
    || str.toLowerCase() == SqlKey.GROUP_BY 
    || str.toLowerCase() == SqlKey.ORDER_BY 
    || str.toLowerCase() == SqlKey.BRA_L 
    || str.toLowerCase() == SqlKey.UPDATE 
    || str.toLowerCase() == SqlKey.SET 
    || str.toLowerCase() == SqlKey.LIMIT
);
const isKeyC = (str) => typeof str === 'string' && (
    str.toLowerCase() == SqlKey.OR 
    || str.toLowerCase() == SqlKey.AND 
    || str.toLowerCase() == SqlKey.ON 
    || str.toLowerCase() == SqlKey.LIKE 
    || str.toLowerCase() == SqlKey.ASC 
    || str.toLowerCase() == SqlKey.DESC
    || str.toLowerCase() == SqlKey.AS
)
const isKeyR = (str) => str == SqlKey.BRA_R;
const isKeyStart = (str) => typeof str === 'string' && (
    str.toLowerCase() == SqlKey.SELECT 
    || str.toLowerCase() == SqlKey.UPDATE
);
const isKey = (str) => isKeyL(str) || isKeyC(str) || isKeyR(str);

const SqlKey = {
    SELECT: 'select',
    CREATE: 'create',
    TABLE: 'table',
    UPDATE: 'update',
    DELETE: 'delete',
    FROM: 'from',
    WHERE: 'where',
    GROUP_BY: 'group by',
    ORDER_BY: 'order by',
    ORDER: 'order',
    GROUP: 'group',
    BY: 'by',
    HAVING: 'having',
    INNER_JOIN: 'inner join',
    LEFT_JOIN: 'left join',
    RIGHT_JOIN: 'right join',
    LEFT: 'left',
    RIGHT: 'right',
    INNER: 'inner',
    JOIN: 'join',
    ON: 'on',
    IN: 'in',
    AND: 'and',
    OR: 'or',
    NOT: 'not',
    EXITS: 'exits',
    LIKE: 'like',
    IS: 'is',
    NULL: 'null',
    BRA_L: '(',
    BRA_R: ')',
    SET: 'set',
    LIMIT: 'limit',
    LIKE: 'like',
    ASC: 'asc',
    DESC: 'desc',
    AS: 'as'
}

class SqlTree {
    constructor(sql) {
        this.jsonTree = {};
        // this.TAB = '&nbsp;&nbsp;';
        if (sql)
            this.init(sql);
    }
    // 预处理
    static _pretreatment(sql) {
        // sql = sql.replace(/\(|\)/g, " $& "); // 括号两侧加空格
        // sql = sql.replace(/join/ig, '_$&');
        sql = sql.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); // 去掉首尾空格
        sql = sql.replace(/\((\s*|\n*)select/ig, " select ").replace(/\)/g, " $& ");
        return sql;
    }
    // 分词，转成数组
    static _toWordArr(sql) {
        let arr = sql.split(/\s+|\n+/);
        if (arr < 1) return [];
        for (let i = 1; i < arr.length; i++) {
            if (arr[i].toLowerCase() == SqlKey.JOIN) {
                switch (arr[i - 1].toLowerCase()) {
                    case SqlKey.LEFT:
                    case SqlKey.RIGHT:
                    case SqlKey.INNER:
                        arr[i - 1] = arr[i - 1] + ' ' + arr[i];
                        arr[i] = ''; // 待优化
                        break;
                    default:
                        break;
                }
            } else if (arr[i].toLowerCase() == SqlKey.BY) {
                switch (arr[i - 1].toLowerCase()) {
                    case SqlKey.GROUP:
                    case SqlKey.ORDER:
                        arr[i - 1] = arr[i - 1] + ' ' + arr[i];
                        arr[i] = ''; // 待优化
                        break;
                    default:
                        break;
                }
            }
        }
        return arr;
    }
    // 按嵌套等级分组
    static _extractionNests(sqlArr) {
        // console.log(sqlArr);
        let nestList = [];
        let levelCount = 0;
        nestList[levelCount] = [sqlArr[0]];
        for (let i = 1; i < sqlArr.length; i++) {
            const e = sqlArr[i];
            if (e == SqlKey.SELECT) {
                nestList[levelCount].push(levelCount += 1);
            } else if (e == SqlKey.BRA_R) {
                levelCount--;
                continue;
            }
            if (!(levelCount in nestList)) {
                nestList[levelCount] = [];
            }
            nestList[levelCount].push(e);
        }
        // console.log(nestList);
        return nestList;
    }
    // 转成json格式的树形结构
    static toJsonTree(sql) {
        const rootList = SqlTree._extractionNests(SqlTree._toWordArr(SqlTree._pretreatment(sql)));
        const level = 0;
        const tree = this._toJsonTree(rootList, level);
        console.log(tree);
        return tree;
    }

    static _toJsonTree(lists, level) {
        let node = {};
        let hasNode = false;
        let curKey = '';
        while (lists[level].length > 0) {
            if (isKeyStart(lists[level][0])) {
                if (hasNode) break;
                hasNode = true;
            }
            const val = lists[level].shift();
            if (typeof val == 'number') {
                node[curKey].push(this._toJsonTree(lists, val));
            } else if (isKeyL(val)) {
                curKey = val;
                node[curKey] = [];
            } else {
                node[curKey].push(val);
            }
        }
        return node;
    }

    setJsonTree(jt) {
        this.jsonTree = jt;
        return this;
    }

    getJsonTree() {
        return this.jsonTree;
    }

    init(sql) {
        // this.setJsonTree(SqlTree.toJsonTree(sql));
        this.jsonTree = SqlTree.toJsonTree(sql);
    }
    // 获得显示在页面上的html
    getHTMLString() {
        return this._getHTMLString(this.jsonTree, [], 0).join('');
    }

    _getHTMLString(jTree, strArr, level) {
        // 左缩进
        let keyTab = SqlTree._getTab(level);
        let valTab = SqlTree._getTab(level + 1);
        for (const key in jTree) {
            if (!jTree.hasOwnProperty(key)) continue;
            /* fomat key */
            strArr.push('</br>' + keyTab);
            if (isKeyStart(key) && level != 0) {
                strArr.push('(');
                // strArr.push('</br>');
                level++;
                keyTab = SqlTree._getTab(level);
                // valTab = SqlTree._getTab(level+1);
                valTab = SqlTree._getTabPlus(keyTab, 1);
                strArr.push('</br>' + keyTab);
            }
            strArr.push('<strong class="key-word">' + key.toUpperCase() + '</strong>');
            /* fomat value */
            const values = jTree[key];
            for (let i = 0; i < values.length; i++) {
                let val = values[i];
                if (typeof val == 'object') {
                    strArr.push(this._getHTMLString(val, strArr, level + 1));
                } else {
                    if (i == 0) {
                        strArr.push('</br>' + valTab);
                    } else {
                        let last = values[i - 1];
                        if (typeof last == 'string' && last.search(',') > -1) {
                            strArr.push('</br>' + valTab);
                        }
                    }
                    if (isKeyC(val)) {
                        val = '<strong class="key-word">' + val.toUpperCase() + '</strong>';
                    }
                    strArr.push(val + ' ');
                }
            }
        }
        if (level != 0) {
            strArr.push('</br>' + SqlTree._getTabPlus(keyTab, -1) + ') ');
        }
        return strArr;
    }

    static _getTab(count) {
        let tab = '';
        for (let i = 0; i < count; i++)
            tab += '&nbsp;&nbsp;';
        return tab;
    }
    static _getTabPlus(oTabStr, num) {
        let extTab = SqlTree._getTab(Math.abs(num));
        if (num > 0) {
            oTabStr += extTab;
        } else if (num < 0) {
            oTabStr = oTabStr.replace(extTab, '');
        }
        return oTabStr;
    }
}