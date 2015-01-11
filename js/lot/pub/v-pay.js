define(['zepto', 'backbone', 'm-pay', 'lottery'], function ($, B, mPay, Lot) {
	var vPay = B.View.extend({
			el : '#wrap',
			initialize : function () {
				var order = this.get_order();
				var user = this.get_user();
				if (order && user) {
					try {
						var detail = order.xValue;
						var $view = $(this.el);
						var type = {
							'1' : '代购方案',
							'2' : '合买方案',
							'3' : '追号方案'
						}
						$view.find('.order-name').html(detail.LotName + ' 第 ' + '<b class="red">' + detail.DrawNo + '</b>' + ' 期 ' + type[detail.TypeID]);
						$view.find('.pay-money').html('<b class="red">' + detail.TradeMoney / 100 + '</b>' + ' 元');
						$view.find('.balance').html('<b class="red">' + user.cashbalance + '</b>' + ' 元');
						if (user.coupons) {
							$hb_menu = $('#hongbao .menu');
							var items = ['<option value="0">不使用红包</option>'];
							var cur_hb = user.coupons;
							for (var i = 0, len = cur_hb.length; i < len; i++) {
								items.push(Lot.string.compile($('#hb-item').html(), {
										value : cur_hb[i].balance / 100,
										money : cur_hb[i].balance / 100,
										field : cur_hb[i].field,
										time : cur_hb[i].validEndTime.split(' ')[0]
									}));
							}
							$hb_menu.html(items.join(''));
						} else {
							$('#hongbao').remove();
						}
					} catch (e) {
						alert('出错了');
					}
				}
			},
			model : new mPay(),
			events : {
				'click #btn-pay' : 'fun_pay',
			},
			get_order : function () {
				var order = localStorage.getItem('ipad_order');
				if (order) {
					return JSON.parse(order);
				} else {
					return false;
				}
			},
			get_user : function () {
				var user = localStorage.getItem('ipad_user');
				if (user) {
					return JSON.parse(user);
				} else {
					return false;
				}
			},
			fun_pay : function () {
				var order = this.get_order().xValue;
				var _this = this;
				var type = {
					'1' : '代购',
					'2' : '合买',
					'3' : '追号'
				};
				var param = {
					chan : order.URL.match(/\d$/g)[0], //消费类型1现金 2红包 3组合支付
					from : '2',
					orderamt : order.TradeMoney,
					orderid : order.OrderID,
					ordername : [order.LotName, '第' + order.DrawNo + '期', type[order.TypeID]].join(' '),
					ordertime : order.OrderTime,
					paypass : this.model.pwd_md5($('#pay_pwd').val()),
					paytype : order.TypeID,
					lotid : order.LotID,
					coupons : 'cash',
					xykk : 0,
					t : +new Date
				};
				var param2 = {
					ch : param.chan,
					cs : param.coupons,
					fr : param.from,
					oa : param.orderamt,
					oi : param.orderid,
					on : param.ordername,
					ot : param.ordertime,
					pp : param.paypass,
					pt : param.paytype,
					lotid : param.lotid,
					xykk : 0,
					tt : +new Date
				};
				this.model.post(param2, function (res) {
					var $tips = $('#pay_err');
					if (res.result_code != 9999) {
						if (res.result_code == '1605' || res.result_code == '1612') {
							$tips.html(res.message || '由于网络原因，支付结果状态未知,请查看购彩记录');
						} else {
							if (res.errno == '9001') {
								$tips.html(res.message || '登录后才能支付，请先登录');
							} else {
								if (res.result_code == '1611') {
									$tips.html(res.message || '该订单已支付,请查看购彩记录');
								} else {
									$tips.html(res.message || ('异常错误，错误码：' + res.result_code));
								}
							}
						}
					} else {
						var lot_info=JSON.parse(localStorage.getItem('ipad_lot'));
						var param={
							name:'双色球',
							issue:lot_info.Issue,
							pj:lot_info.BonusTime+'('+lot_info.BonusWeek+')',
							kj:Lot.date.format(lot_info.OpenTime*1000,'YYYY-MM-DD hh:mm')+'(星期'+'日一二三四五六'.charAt(new Date(lot_info.OpenTime*1000).getDay())+')'
						}
						var tpl=$('#tpl-success').html();
						tpl=Lot.string.compile(tpl,param);
						$(_this.el).html(tpl);
						try {
							var dialog = top.modal.get(window);
							dialog.title('购彩成功');
						} catch (e) {
							console.log(e);
						}
					}
				});
			}
		});
	return vPay;
});
