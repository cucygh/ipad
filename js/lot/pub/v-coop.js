define(['zepto', 'backbone', 'lottery'], function ($, B, Lot) {
	var Coop = B.View.extend({
			el : '#coop-dialog',
			initialize : function (options) {
				var init = options;
				this.$el.data('money',init.money);
				var $target = $(this.el);
				$target.find('#my_name').attr('placeholder', init.name);
				this.count(init); //统计
			},
			events : {
				'click .checkbox' : 'fun_check',
				'blur input,textarea':'check',
				'click #btn-pay':'fun_pay'
			}, //是否公开
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
							dialog.title('确认付款');
							location.href='html/pub/pay.html';
						} else {
							Lot.dialog.alert(res.xMessage || res.xCode);
						}
					});
					$err.html('<b class="red">通过验证</b>');
				}else{
					$err.html('<b class="red">验证失败</b>')
				}
			},//计算注数
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
				var param=JSON.parse(localStorage.getItem('ipad_coop')).bet;
				return _.extend(param, {
					buy_type : 'team',
					BetType:'team',
					SecrecyFlag : $('#is_show').find(':checked').val(), //公开方式
					LockCount : bd, //保底金额
					SponsorBuy : own, //认购金额
					SponsorDeduck : $('#my_tc').val(), //中奖佣金
					PTitle : $('#my_name').val()||$('#my_name').attr('placeholder'),
					PMemo : $('#my_say').val()||'这个人很懒，只想中大奖'
				})
			},//校验参数是否完整
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
