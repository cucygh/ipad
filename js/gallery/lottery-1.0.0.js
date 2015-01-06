define(['zepto', 'underscore', 'modal'], function ($, Lot, Modal) {
	var domain = 'http://ygh.cp.360.cn';
	// 彩种简称、ID、全称
	var lottery = {
		ssq : [220051, '双色球'],
		slt : [120029, '超级大乐透'],
		p3 : [110033, '排列三'],
		p5 : [110035, '排列五'],
		qxc : [110022, '七星彩'],
		sd : [210053, '福彩3D'],
		sdbj : [215152, '北京3D'],
		qlc : [220028, '七乐彩'],
		xw : [223515, '东方15选5'],
		xwtj : [225303, '天津15选5'],
		jczq : [130042, '竞彩足球'],
		jclq : [130043, '竞彩篮球'],
		dc : [130041, '北京单场'],
		sfc : [130011, '胜负彩'],
		rj : [130019, '任选九'],
		kl8 : [265108, '北京快乐8'],
		syxwsd : [166406, '山东11选5'],
		syxwjx : [168009, '新11选5'],
		syxwgd : [165707, '广东11选5'],
		syxwsh : [165207, '上海11选5'],
		syxwhlj : [166507, '幸运11选5'],
		sscjx : [258001, '江西时时彩'],
		ssccq : [255401, '重庆时时彩'],
		k3js : [255903, '江苏快3'],
		k3hb : [257703, '湖北快3'],
		k3nm : [257503, '内蒙快3'],
		k3jl : [258203, '吉林快3'],
		pk3 : [166407, '山东快乐扑克3'],
		jq4 : [130018, '四场进球'],
		zc6 : [130016, '6场半全场']
	};
	// 支付URL
	var pay_url = {
		bet : domain + '/int/bet/',
		team : domain + '/int/teambet/',
		join : domain + '/int/join/',
		trace : domain + '/int/trace/',
		pteam : domain + '/int/pteambet/'
	};
	/**
	 * 字符串相关
	 */
	var string = {
		/**
		 * 简单的模板编译
		 * @param tpl {string}
		 * @param data {Object}
		 * @return tpl {string}
		 */
		compile : function (tpl, data) {
			var reg;
			for (var p in data) {
				reg = new RegExp('\{' + p + '\}', 'g');
				tpl = tpl.replace(reg, data[p]);
			}
			return tpl;
		}
	};

	/**
	 * 投注相关
	 */
	var bet = {
		/**
		 * 获取彩种信息，含简写、id、全称
		 * @param name {String} 					eg:'130016' || 'zc6' || '6场半全场' || '6场' || '半全场'
		 * @ignore created
		 * @return result {Array}				eg:['zc6',130016, '6场半全场']
		 */
		get_lot_name : function (name) {
			var by_name = /^[a-z\d]+$/gi.test(name);
			var by_id = /^\d+$/.test(name);
			var index = 0;
			if (!by_name) {
				index = by_id ? 1 : 2;
			}
			var p_arr = [];
			for (var p in lottery) {
				p_arr = [p].concat(lottery[p]);
				if (p == name || lottery[p][index].toString().indexOf(name) > -1) {
					break;
				}
			}
			return p_arr;
		},
		/**
		 * 获取支付URL
		 * @param con {String}
		 * @ignore created
		 * @return result {Array}
		 */
		get_pay_url : function (con) {
			var refer = {
				bet : '代购',
				team : '合买',
				join : '认购',
				trace : '追号',
				pteam : '先发起'
			};
			var p,
			url;
			for (p in refer) {
				if (con.indexOf(p) > -1 || con.indexOf(refer[p]) > -1) {
					url = pay_url[p];
					break;
				}
			}
			return url || false;
		},
		/**
		 * 获取彩种基本信息
		 * @param id {String}
		 * @ignore created
		 * @return result {Object}
		 */
		get_cur_issue : function (param) {
			var url = domain + '/int/qcurissue';
			var id = param.id;
			var cur_issue = param.cur_issue;
			var freq = param.freq;
			var ok_call = param.ok_call || function () {};
			var fail_call = param.fail_call || function () {};
			$.ajax({
				url : url,
				type : 'GET',
				data : {
					LotID : id
				},
				dataType : 'json',
				async : cur_issue ? true : false,
				success : function (data) {
					if (data) {
						if (cur_issue != undefined && cur_issue == data.issue) {
							setTimeout(function () {
								get_cur_issue.call(null, id, cur_issue);
							}, freq || 3000);
						} else {
							ok_call.call(null, data);
						}
					} else {
						fail_call.call(null);
					}
				},
				error : function () {
					fail_call.call(null);
				},
				timeout : 1000
			})
		},
		/**
		 * 生成订单
		 * @param data {Object}
		 * @param data {Object}
		 * @param data {Object}
		 * @ignore created
		 * @return result {Array}
		 */
		post : function (param, callback) {
			var _url = bet.get_pay_url(param.BetType);
			$.ajax({
				url : _url,
				type : 'POST',
				data : param,
				dataType : 'json',
				success : function (res) {
					if (callback && callback instanceof Function) {
						callback.call(null, res);
					}
				}
			})
		}
	}
	//cookie相关
	var cookie = {
		/**
		 * @description set设置cookie, del删除cookie,当expires小于0时即为删除cookie
		 * @param {Object} options={name:,value:,expires:,domain:,path:,secure:,encode:}【必选】
		 * @param {String} name cookie的名称【必选】
		 * @param {String} value cookie的值【必选】
		 * @param {Number} expires cookie的过期时间，为整数，单位为天，为负时删除cookie【可选】
		 * @param {String} domain  指定cookie所属的域【可选】
		 * @param {String} path  指定cookie 的路径【可选】
		 * @param {Boolean} secure  是否安全传输 当协议为https时才可用【可选】
		 * @param {Boolean} encode  是否对值进行encodeURIComponent【可选】
		 */
		set : function (options) {
			var ck = [];
			ck.push(options.name + '=');
			if (options.value) {
				ck.push(!!options.encode ? options.value : encodeURIComponent(options.value));
				//是否encodeURIComponent
			}
			if (options.expires) {
				var d = new Date();
				d.setHours(0);
				d.setMinutes(0);
				d.setSeconds(0);
				d.setTime(d.getTime() + options.expires * 86400000);
				//24 * 60 * 60 * 1000
				ck.push(';expires=' + d.toGMTString());
			}
			if (options.domain) {
				ck.push(';domain=' + options.domain);
			}
			ck.push(';path=' + (options.path || '/'));
			if (options.secure) {
				ck.push(';secure');
			}
			document.cookie = ck.join('');
		},
		/**
		 * @description 得到指定的cookie值
		 * @example Q.cookie.get('name')
		 * @param {String} name cookie名称【必选】
		 * @param {Boolean} encode 是否encodeURIComponent 默认false【可选】
		 * @return 指定cookie的值
		 */
		get : function (name, encode) {
			var m = document.cookie.match(new RegExp("(^| )" + name + "=([^;])*", "gi")),
			v = !m ? '' : m[0].split(name + '=')[1];
			return (!!encode ? v : decodeURIComponent(v));
		}
	};
	//辅助相关
	var help = {
		is_web : location.protocol == "chrome-extension:" ? false : true, //是否为web端，false为扩展应用
		domain:domain
	}
	//对话框相关
	var _dialog = {
		alert : function (content) {
			dialog({
				title : '温馨提示',
				content : content,
				skin : 'dialog-alert',
				okValue : '确定',
				ok : function () {
					this.close().remove();
				},
				fixed : true
			}).showModal();
		},
		prompt : function (options) {
			dialog({
				title : options.title || '温馨提示',
				content : options.content || '',
				okValue : options.ok_txt || '确定',
				fixed : true,
				ok : options.ok || function () {},
				cancelValue : options.cancel_txt || '取消',
				cancel : options.cancel || function () {}
			}).showModal();
		},
		custome : function (options) {
			dialog(options).showModal();
		},
		pay : function (order) {
			dialog({
				fixed : true,
				title : '确认付款',
				url : 'html/pub/pay.html'
			}).showModal();
		}
	};
	window.modal=Modal;
	return {
		string : string,
		bet : bet,
		cookie : cookie,
		help : help,
		dialog : _dialog
	}
});
