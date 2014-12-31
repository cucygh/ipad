define(['backbone', 'md5', 'zepto', 'lottery'], function (Backbone, md5, $, Lot) {
	var is_web;
	var Login = Backbone.Model.extend({
			isOn : false,
			userName : '',
			msg : '',
			imgurl : '',
			domain : 'http://ygh.cp.360.cn/',
			initialize : function () {
				var _this = this;
				is_web = location.protocol == 'chrome-extension:' ? false : true;
				if (is_web) {
					$.ajax({
						url : _this.domain + 'int/querybalance/',
						dataType : 'json',
						success : function (data) {
							_this.set({
								userName : data.username,
								imgurl : data.imgUrl,
								isOn : data.code == 0 ? true : false
							});
						},
						type : 'post',
						error : function (err) {
							_this.set({
								userName : '未登录',
								isOn : false
							})
						}
					});
				} else {
					chrome.cookies.get({
						"url" : _this.domain,
						"name" : 'Q'
					}, function (c) {
						if (c) {
							$.ajax({
								url : _this.domain + 'int/querybalance/',
								dataType : 'json',
								success : function (data) {
									_this.set({
										userName : data.username,
										imgurl : data.imgUrl,
										isOn : data ? true : false
									});
								},
								type : 'post',
								error : function (err) {
									_this.set({
										userName : '未登录',
										isOn : false
									})
								}
							});
						} else {
							_this.set({
								isOn : false,
							});
						}
					});
				}
			},
			login : function (user, pwd, keep, captcha) {
				var _this = this;
				var result = this.validate(user, pwd);
				if (result.pass) {
					var options = {
						account : user,
						password : md5(pwd),
						isKeepAlive : keep,
						userType : '360',
						union : '360',
						t : +new Date
					};
					if (captcha) {
						options.captcha = captcha;
					}
					var data_type = 'json';
					var url = this.domain + 'user/unionLogin/?' + $.param(options);
					this.fetch({
						url : url,
						success : function (data) {
							console.log(data);
							if (data.attributes.errno == '0') {
								_this.set({
									isOn : true,
									msg : 'ok',
									userName : data.attributes.userinfo.userName
								});
								if (is_web) {
									Lot.cookie.set({
										"name" : 'loginedUserName',
										'value' : data.attributes.userinfo.userName
									})
								} else {
									chrome.cookies.set({
										"url" : _this.domain,
										"name" : 'loginedUserName',
										'value' : data.attributes.userinfo.userName
									});
								}

							} else {
								_this.set({
									isOn : false,
									msg : data.attributes.errmsg + ':t=' + (+new Date)
								});
							}
						},
						error : function (err) {
							_this.set({
								msg : err + ':t=' + (+new Date)
							})
						}
					});
				} else {
					this.set({
						msg : result.msg + ':t=' + (+new Date)
					});
				}
			},
			exit : function () {
				var _this = this;
				var url = this.domain + "user/logout/?rt=" + new Date;
				Backbone.sync('read', this, {
					url : url,
					dataType : 'html',
					success : function () {
						_this.set({
							isOn : false
						});
					},
					error : function () {
						_this.set({
							msg : '退出失败',
							isOn : false
						});
					}
				});
			},
			validate : function (user, pwd) {
				var r;
				if (user.toString().trim() != '' && pwd.toString().trim() != '') {
					r = {
						pass : true,
						msg : 'pass',
					}
				} else {
					r = {
						pass : false,
						msg : '账号或密码不能为空！'
					}
				}
				return r;
			},
			//获取个人信息
			get_detail : function (callback) {
				var url = this.domain + 'int/querybalance/';
				$.ajax({
					url : url,
					dataType : 'json',
					data:{coupons:1},
					success : function (data) {
						if (data.code == 0) {
							localStorage.setItem('ipad_user', JSON.stringify(data));
							if (callback && callback instanceof Function) {
								callback.call(null, data);
							}
						}
					},
					type : 'post',
					error : function (err) {}
				});
			}
		});
	return Login;
});
