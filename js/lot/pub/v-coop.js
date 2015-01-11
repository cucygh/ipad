define(['zepto', 'backbone', 'lottery'], function ($, B, Lot) {
	var Coop = B.View.extend({
			el : '#coop-dialog',
			initialize : function (options) {
				var init = options;
				this.$el.data('money',init.money);
				var $target = $(this.el);
				$target.find('#my_name').attr('placeholder', init.name);
				this.count(init); //ͳ��
			},
			events : {
				'click .checkbox' : 'fun_check',
				'blur input,textarea':'check',
				'click #btn-pay':'fun_pay'
			}, //�Ƿ񹫿�
			fun_check : function (e) {
				e && e.preventDefault();
				var $self = $(e.target).parents('.checkbox').find('input');
				var is = $self.prop('checked');
				$self.prop('checked', !is);
			},
			fun_pay:function(e){
				e&&e.preventDefault();
				var $err=$('.sum_txt');
				var param=this.count({money:this.$el.data('money')});
				if($err.data('flag')){
					var dialog = top.modal.get(window);
					Lot.bet.post(param, function (res) {
						if (res.xCode == 0) {
							window.localStorage.setItem('ipad_order', JSON.stringify(res));							
							dialog.title('ȷ�ϸ���');
							location.href='html/pub/pay.html';
						} else {
							Lot.dialog.alert(res.xMessage || res.xCode);
						}
					});
					$err.html('<b class="red">ͨ����֤</b>');
				}else{
					$err.html('<b class="red">��֤ʧ��</b>')
				}
			},//����ע��
			count : function (param) {
				var money = param.money; //�������
				var per = $('#my_tc').val();
				per = Math.max(0.05, per);
				var own = Math.max(param.own || 0, Math.ceil(param.money * per)); //�Ϲ����
				var bd = param.bd || 0; //���׽��
				bd = Math.min(bd, money - own);
				$('.total').text(money);
				$('.ownbuy').text(own);
				$('.ownlast').text(bd);
				$('#my_buy').val(own);
				$('#my_bd').val(bd);
				var param=JSON.parse(localStorage.getItem('ipad_coop')).bet;
				return _.extend(param, {
					buy_type : 'team',
					BetType:'team',
					SecrecyFlag : $('#is_show').find(':checked').val(), //������ʽ
					LockCount : bd, //���׽��
					SponsorBuy : own, //�Ϲ����
					SponsorDeduck : $('#my_tc').val(), //�н�Ӷ��
					PTitle : $('#my_name').val()||$('#my_name').attr('placeholder'),
					PMemo : $('#my_say').val()||'����˺�����ֻ���д�'
				})
			},//У������Ƿ�����
			check:function(){
				var $item;
				var $err=$('.sum_txt');
				$err.data("flag",true);
				var flag=true;
				$('input').add('textarea').each(function(index,item){
					$item=$(item);
					if($.trim($item.val())==''){
						flag=false;
						$err.html($item.attr('err')).data('flag',flag);
						return false;
					}
				});
				
				return flag;
			}
		});
	return Coop;
});
