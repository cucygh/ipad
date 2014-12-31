define(['backbone', 'zepto', 'm-user', 'user-tpl', 'modal','lottery'], function (Backbone, $, Login, TplLogin, Modal,Lot) {
	var login = new Login();
	var $login=$('.loginModal');
	var Vlogin = Backbone.View.extend({
			el : 'body',
			initialize : function () {
				login.unbind();
				login.bind('change:isOn', this.login_call);
				login.bind('change:msg', this.msg_call);
			},
			events : {
				'click .login' : 'show',
				'click .exit' : 'exit',
				'click .btn-login':'fun_login',
				'click .capcha_change':'fun_capcha'
			},
			login_call : function (e) {
				var tpl_login = '<div class="quick_item quick_history"><a href="http://cp.360.cn/pfchongzhi" class="quick_link"><i class="ico_history_26"></i><span class="quick_txt">充值</span><i class="divide"></i></a></div><div class="quick_item quick_attention"><a href="http://cp.360.cn/pftikuan" class="quick_link _checklogin"><i class="ico_collect_26"></i><span class="quick_txt">提现</span><i class="divide"></i></a></div><div class="quick_item quick_attention"><a href="http://cp.360.cn/pfbet" class="quick_link _checklogin"><i class="ico_collect_26"></i><span class="quick_txt">记录</span><i class="divide"></i></a></div><div class="quick_item quick_attention"><a href="http://cp.360.cn/kj/kaijiang.html" class="quick_link _checklogin"><i class="ico_collect_26"></i><span class="quick_txt">开奖</span><i class="divide"></i></a></div><div class="quick_item quick_user open"><a href="#" class="quick_link"><img src="{img_url}" alt="用户名" title="{user}"></a></div><div class="quick_item"><div class="user_name"><a href="http://cp.360.cn/pfbet">{user}</a></div><div class="user_exit"><a href="#" class="exit">退出</a></div></div>';
				var tpl_exit = '<p class="no-login"><a href="#" class="login">登录</a> | <a href="http://i.360.cn/reg/?src=pcw_i360" class="register">注册</a></p>';
				var str;
				if (e.changed.isOn) {
					str=Lot.string.compile(tpl_login,{img_url:e.attributes.imgurl||e.attributes.userinfo.imgUrl,user:e.attributes.userName});
					// 登录后查看余额
					login.get_detail();
				} else {
					str=tpl_exit;
					localStorage.clear();//清除所有缓存
				}
				$('.profile').html(str);
			},
			fun_login:function(e){
				e&&e.preventDefault();
				var user=$('#user').val();
				var pwd=$('#pwd').val();
				var captcha=$('#captcha');
				captcha=captcha.is(':visible')?captcha.val():'';
				login.login(user,pwd,1,captcha);
			},
			msg_call : function (e) {
				if (e.attributes.msg != 'ok') {
					var msg = e.attributes.msg.replace(/\:t\=\d+/g, '');
					if (msg.indexOf('验证') > -1) {
						$('.capcha').show();
					}
					if (msg) {
						$('.tips-error').html(msg).show();
					}
					$('.capcha img').trigger('click');
				} else {
					$.pgwModal('close');
				}
			},
			show : function (e) {
				e && e.preventDefault();
				$.pgwModal({
					title:'帐号登录',
					maxWidth:390,
					mainClassName:'pgwModal loginModal',
					content : TplLogin({
						user : login.attributes.userName
					})
				});
			},
			exit : function (e) {
				e && e.preventDefault();
				login.exit();
			},
			fun_capcha:function(e){
				e && e.preventDefault();
				$('img.capcha_change').attr('src','http://captcha.360.cn/image.php?app=caipiao&t='+Math.random());
			}
		});
	return Vlogin;
});
