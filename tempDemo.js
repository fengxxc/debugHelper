// modal
var SelectSqlModal = function () {
	this.select = '';
	this.from = '';
	this.where = '';
	this.groupBy = '';
	this.having = '';
	this.orderBy = '';
	this.limit = '';

	this.DataList = [];
}

var SqlUtil = {
	sqlSplit: function (sqlstr) {
		return sqlstr.split(/\s+/g);
	},
	selectParse: function (sqlstr) {
		var ss = this.sqlSplit(sqlstr);

		var fromIndex = null;
		for (var i = 0, selectCount = 0, fromCount = 0; i < ss.length; i++) {
			if ( /select/i.test(ss[i]) ) 
				selectCount ++;
			if ( /from/i.test(ss[i]) ) {
				fromCount ++;
				if (selectCount == fromCount) {
					// console.log('from关键字的索引是：' + i);
					fromIndex = i;
					break;
				}
			}

		}
		
		return new SelectSqlModal();
	}
}