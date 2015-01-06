define(['zepto', 'backbone', 'm-pay', 'lottery', 'pay-tpl'], function ($, B, mPay, Lot, tplPay) {
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
							'1' : '��������',
							'2' : '���򷽰�',
							'3' : '׷�ŷ���'
						}
						$view.find('.order-name').html(detail.LotName + ' �� ' + '<b class="red">' + detail.DrawNo + '</b>' + ' �� ' + type[detail.TypeID]);
						$view.find('.pay-money').html('<b class="red">' + detail.TradeMoney / 100 + '</b>' + ' Ԫ');
						$view.find('.balance').html('<b class="red">' + user.cashbalance + '</b>' + ' Ԫ');
						if (user.coupons) {
							$hb_menu = $('#hongbao .menu');
							var items = ['<option value="0">��ʹ�ú��</option>'];
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
						alert('������');
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
				var type = {
					'1' : '����',
					'2' : '����',
					'3' : '׷��'
				};
				var param = {
					chan : order.URL.match(/\d$/g)[0], //��������1�ֽ� 2��� 3���֧��
					from : '2',
					orderamt : order.TradeMoney,
					orderid : order.OrderID,
					ordername : [order.LotName, '��' + order.DrawNo + '��', type[order.TypeID]].join(' '),
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
							$tips.html(res.message || '��������ԭ��֧�����״̬δ֪,��鿴���ʼ�¼');
						} else {
							if (res.errno == '9001') {
								$tips.html(res.message || '��¼�����֧�������ȵ�¼');
							}else{
								if(res.result_code == '1611'){
									$tips.html(res.message || '�ö�����֧��,��鿴���ʼ�¼');
								}else{
									$tips.html('�쳣���󣬴����룺'+res.result_code);
								}
							}
						}
					} else {
						/* $.ajax({
						url:Lot.help.domain+res.showurl,
						dataType:'html',
						type:'POST',
						success:function(res){
						$('#wrap').html(res);
						}
						}); */
					}
				});
			}
		});
	return vPay;
});
