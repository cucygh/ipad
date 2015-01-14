define(['lottery','backbone','md5'],function(Lot,Backbone,md5){
	var Pay=Backbone.Model.extend({
		initialize:function(){
			this.ssl=false;//是否启用SSL安全链接
			this.code='';//支付接口状态码
			this.msg='';//支付接口状态描述
			this.domain=this.ssl?Lot.help.domain.replace('http:','https:'):Lot.help.domain;//支付接口所在域名
			this.url='/qbapissl/pgw/';//支付接口
			this.url_bak='/qbapissl/pgw';//备用支付接口
			this.count=0;//支付次数
			this.limit=2;//支付失败限制次数，超过此设置启用备用支付接口
		},
		post:function(data,callback){
			this.count++;
			var _self=this;
			// data.paypass=_self.pwd_md5(data.paypass);
			// data['sign']=_self.sign_md5(data);
			data['s']=_self.sign_md5(data);
			$.ajax({
				url:_self.domain+_self.url,
				data:data,
				dataType:'json',
				timeout:10000,
				success:function(res){
					if(callback&&typeof callback=='function'){
						callback.call(null,res);
					}
				},
				error:function(){
					if(_self.count<_self.limit){
						_self.post.call(_self,data);
					}else{
						
					}
				}
			});
		},
		get_msg:function(){
			
		},
		pwd_md5:function(txt){
			return md5('fcfa5d2e|'+txt+'|fcfa5d2e');
		},
		sign_md5:function(data){
			var arr=[];
			for(var p in data){
				if(p=='tt'||p=='lotid'||p=='xykk'){
					continue;
				}
				arr.push(p+'='+data[p]);
			}
			arr.push('key=353f32ef57aceb1b90ea4cf2afacb595');
			return md5(arr.join('&'));
		}
	});
	return Pay;
});