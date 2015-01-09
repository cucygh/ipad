require(['v-coop', 'lottery'], function (Vcoop, Lot) {
	var store = parent.localStorage;
	var ipad_coop = store.getItem('ipad_coop');
	if (ipad_coop) {
		ipad_coop = JSON.parse(ipad_coop);
		var vcoop = new Vcoop(ipad_coop);
	} else {
		var dialog = parent.modal.get(window);
		dialog.close();
	}
});
