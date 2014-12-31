define(['zepto', 'underscore', 'backbone','v-ssq'], function ($, _, Backbone,Vssq) {
	var AppRouter = Backbone.Router.extend({
			initialize : function () {
				Backbone.history.start();
			},
			routes : {
				ssq:'ssq'
			},
			ssq:function(){
				var ssq_view=new Vssq();
			}

		});
	return AppRouter;
});