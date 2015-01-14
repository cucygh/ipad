define(['lottery','backbone','md5'],function(Lot,Backbone,md5){
	var Pay=Backbone.Model.extend({
		initialize:function(){
			this.ssl=false;//�Ƿ�����SSL��ȫ����
			this.code='';//֧���ӿ�״̬��
			this.msg='';//֧���ӿ�״̬����
			this.domain=this.ssl?Lot.help.domain.replace('http:','https:'):Lot.help.domain;//֧���ӿ���������
			this.url='/qbapissl/pgw/';//֧���ӿ�
			this.url_bak='/qbapissl/pgw';//����֧���ӿ�
			this.count=0;//֧������
			this.limit=2;//֧��ʧ�����ƴ������������������ñ���֧���ӿ�
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