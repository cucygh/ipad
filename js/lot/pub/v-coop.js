define(['zepto', 'backbone', 'lottery'], function ($, B, Lot) {
	var Coop = B.View.extend({
			el : '#coop-dialog',
			initialize : function (options) {
				var init = options;
				console.log(options);
				var $target = $(this.el);
				$target.find('#my_name').attr('placeholder', init.name);
				this.count(init); //ͳ��
			},
			events : {
				'click .checkbox' : 'fun_check'
			}, //�Ƿ񹫿�
			fun_check : function (e) {
				e && e.preventDefault();
				var $self = $(e.target).parents('.checkbox').find('input');
				var is = $self.prop('checked');
				$self.prop('checked', !is);
			}, //����ע��
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
				/* var default = {
					LotID : Q.pages.lott_type_id,
					PlayID : Q.pages.play_id,
					//Ͷע�� ��λ��Ϊpar[2],˳��Ҫ����
					BetCodes : Q.pages.get_post_code(),
					//��ע�۸�
					OneMoney : Q.pages.price,
					//ҳ����Դ,��д��
					BetPageID : Q.pages.bet_page_id || 1010,
					//����
					DrawNo : Q.pages.issue,
					//�ܽ��
					BetMoney : $.trim($('#money').text()),
					//����
					BetMulti : $('#mul').val()
				} */
				return {
					buy_type : 'team',
					SecrecyFlag : $('#is_show input').val(), //������ʽ
					LockCount : bd, //���׽��
					SponsorBuy : own, //�Ϲ����
					SponsorDeduck : $('#my_tc').val(), //�н�Ӷ��
					PTitle : $('#my_name').val(),
					PMemo : $('#my_say').val()
				}
			},//У������Ƿ�����
			check:function(){
				
			}
		});
	return Coop;
});
