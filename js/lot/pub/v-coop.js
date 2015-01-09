define(['zepto', 'backbone', 'lottery'], function ($, B, Lot) {
	var Coop = B.View.extend({
			el : '#coop-dialog',
			initialize : function (options) {
				var init = options;
				console.log(options);
				var $target = $(this.el);
				$target.find('#my_name').attr('placeholder', init.name);
				this.count(init); //统计
			},
			events : {
				'click .checkbox' : 'fun_check'
			}, //是否公开
			fun_check : function (e) {
				e && e.preventDefault();
				var $self = $(e.target).parents('.checkbox').find('input');
				var is = $self.prop('checked');
				$self.prop('checked', !is);
			}, //计算注数
			count : function (param) {
				var money = param.money; //方案金额
				var per = $('#my_tc').val();
				per = Math.max(0.05, per);
				var own = Math.max(param.own || 0, Math.ceil(param.money * per)); //认购金额
				var bd = param.bd || 0; //保底金额
				bd = Math.min(bd, money - own);
				$('.total').text(money);
				$('.ownbuy').text(own);
				$('.ownlast').text(bd);
				$('#my_buy').val(own);
				$('#my_bd').val(bd);
				/* var default = {
					LotID : Q.pages.lott_type_id,
					PlayID : Q.pages.play_id,
					//投注码 此位置为par[2],顺序不要调整
					BetCodes : Q.pages.get_post_code(),
					//单注价格
					OneMoney : Q.pages.price,
					//页面来源,先写死
					BetPageID : Q.pages.bet_page_id || 1010,
					//期数
					DrawNo : Q.pages.issue,
					//总金额
					BetMoney : $.trim($('#money').text()),
					//倍数
					BetMulti : $('#mul').val()
				} */
				return {
					buy_type : 'team',
					SecrecyFlag : $('#is_show input').val(), //公开方式
					LockCount : bd, //保底金额
					SponsorBuy : own, //认购金额
					SponsorDeduck : $('#my_tc').val(), //中奖佣金
					PTitle : $('#my_name').val(),
					PMemo : $('#my_say').val()
				}
			},//校验参数是否完整
			check:function(){
				
			}
		});
	return Coop;
});
