define(['backbone', 'zepto', 'math', 'handlebars', 'lottery', 'underscore', 'timer', 'v-user', 'm-ssq'], function (B, $, math, handlebar, Lot, _, Timer, User, mSsq) {
	var View_ssq = B.View.extend({
			el : '#wrap',
			initialize : function () {
				Lot.bet.get_cur_issue({
					id : 220051,
					ok_call : function (d) {
						if (d && !_.isEmpty(d)) {
							$('.issue').text(d.Issue);
							/* ����ʱ */
							$('.countdown').countdown(d.FsEndTime * 1000, function (event) {
								$(this).html(event.strftime('<b class="day red">%D</b>��<b class="hour red">%H</b>ʱ<b class="minute red">%M</b>��<b class="second red">%S</b>��'));
							});
						}
					}
				});
				var user = new User();
			},
			model : new mSsq(),
			events : {
				'click .random-ball' : 'fun_dropdown',
				'click .ui.dropdown .button' : 'fun_dropdown_button',
				'click .ball' : 'fun_ball',
				'click .add-bet' : 'fun_add_bet',
				'click .clear-bet' : 'fun_rm_bet',
				'click .random-zhu' : 'fun_random_zhu',
				'click .buy-own' : 'fun_own_buy',
				'click .buy-cooperate' : 'fun_coop_buy',
				'click .clear-all' : 'fun_clear_all'
			}, //��ѡ����
			fun_dropdown : function (e) {
				var $self = $(e.target);
				$self.parents('.ui.dropdown').find('.random-num').toggle();
			}, //��ѡ����
			fun_dropdown_button : function (e) {
				var $self = $(e.target);
				var $parent = $self.parents('.random-num');
				var $top = $parent.parents('.segment');
				var num = $self.text() * 1;
				var type = $parent.attr('type');
				var max = $parent.attr('max');
				var result = math.random({
						min : 1,
						max : max,
						size : num,
						sort : 1
					});
				var cur_arr = result[0],
				$item;
				$top.find('.ball').each(function (index, item) {
					$item = $(item);
					if ($.inArray($item.text(), cur_arr) > -1) {
						$item.addClass(type);
					} else {
						$item.removeClass(type);
					}
				});
				$top.find('.text').text('��ѡ ' + num + ' ��');
				$self.find('.random-num').toggle();
				this.count(); //����ע��
			}, //ѡ��
			fun_ball : function (e) {
				var $self = $(e.target);
				var name = 'red';
				if ($self.parents('.bet-blue-code').length) {
					name = 'blue';
				};
				$self.toggleClass(name);
				this.count(); //����ע��
			}, //����ѡ�Ž��
			count : function () {
				var $wrap = $(this.el);
				var count = math.combo($wrap.find('.ball.red').length, 6) * $wrap.find('.ball.blue').length;
				$wrap.find('.bet-confirm .zhu').text(count);
				$wrap.find('.bet-confirm .money').text(count * 2);
			}, //���ѡ��
			fun_add_bet : function (e) {
				e.preventDefault();
				var $wrap = $(this.el);
				var red_ball = [];
				$wrap.find('.ball.red').each(function (index, item) {
					red_ball.push($(item).text());
				});
				var blue_ball = [];
				$wrap.find('.ball.blue').each(function (index, item) {
					blue_ball.push($(item).text())
				});
				var code = red_ball.join(' ') + '+' + blue_ball.join(' ');
				var tpl = $('#bet-item').html();
				var item = this.model.add_code(code, tpl);
				$('#bet-list').append(item);
				this.fun_rm_bet(); //��պ���
			}, //���ѡ��
			fun_rm_bet : function (e) {
				e && e.preventDefault();
				var $wrap = $(this.el);
				$wrap.find('.ball').removeClass('red blue');
				this.count();
			}, //��ѡ��ע
			fun_random_zhu : function (e) {
				e && e.preventDefault();
				var $self = $(e.target);
				var num = $self.attr('num');
				var tpl = $('#bet-item').html();
				var codes = this.model.random(num);
				var code,
				items = [];
				while (code = codes.pop()) {
					items.push(this.model.add_code(code, tpl));
				}
				$('#bet-list').append(items.join(''));
			},
			// ���Ͷע�б�
			fun_clear_all : function (e) {
				e && e.preventDefault();
				$('#bet-list').html('');
			},
			//����Ͷע/����
			fun_own_buy : function () {
				var $list = $('#bet-list li');
				var code = [];
				var count = 0;
				$list.each(function (index, item) {
					code.push($(item).attr('code'));
					count += $(item).attr('count') * 1;
				});
				var param = {
					BetCodes : code.join(';'),
					BetType : 'bet', //����
					LotID : Lot.bet.get_lot_name('ssq')[1],
					OneMoney : 2,
					BetPageID : '6001',
					DrawNo : $('.issue').text(),
					BetMoney : count * 2,
					BetMulti : 1
				};
				Lot.bet.post(param, function (res) {
					if (res.xCode == 0) {
						window.localStorage.setItem('ipad_order', JSON.stringify(res));
						Lot.dialog.pay();
					} else {
						$.pgwModal({
							title : '��ܰ��ʾ',
							maxWidth : 390,
							mainClassName : 'pgwModal alertModal',
							content : '<p style="text-align:center;padding:1em">' + (res.xMessage || res.xCode) + '</p>'
						});
					}
				});
			},
			fun_coop_buy:function(e){
				e&&e.preventDefault();
				Lot.dialog.custome({
					align:'right top',
					content:'����ʹ��ռ����'					
				})
			}
		});
	return View_ssq;
});
