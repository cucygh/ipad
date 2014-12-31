define(['zepto', 'backbone', 'math','lottery'], function ($, B, math,Lot) {
	var mSsq = B.Model.extend({
			/**
			 * 机选几注号码
			 * @param num {Number}
			 */
			random : function (num) {
				var red = math.random({
						min : 1,
						max : 33,
						size : 6,
						count : num,
						sort:true,
						repeat : false
					});
				var blue = math.random({
						min : 1,
						max : 16,
						size : 1,
						count : num,
						repeat : false
					});
				var result = $.map(red, function (item, index) {
						return item.join(' ') + '+' + blue[index];
					});
				return result;
			},
			/**
			 * 添加投注号码
			 * @param code {Object}
			 * @param tpl {String}
			 */
			add_code : function (code, tpl) {
				var codes = code.split('+');
				var red = codes[0];
				var blue = codes[1];
				var count = math.combo(red.split(' ').length, 6) * blue.split(' ').length;
				var data = {
					code : code,
					count : count,
					red : red,
					blue : blue,
					count : count,
					money : count * 2,
					type : count > 1 ? "复式" : "单式"
				};
				return Lot.string.compile(tpl, data);
			}
		})
		return mSsq;
});
