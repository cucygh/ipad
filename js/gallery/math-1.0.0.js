define([], function () {
	// ˽�к������׳�����
	var tank = function (n) {
		if (n == 0)
			return 1;
		else
			return tank(n - 1) * n;
	}
	// ��Ϻ���
	var combo = function (m, n) {
		if (n <= m) {
			var result = tank(m - n) * tank(n);
			result = tank(m) / result;
			return result;
		} else
			return 0;
	}
	/**
	 * �ݹ�����㷨
	 * �� arr[1...n] ����ѡ num(0 < num <= n) �������������
	 */
	function combine(arr, num) {
		var r = [];
		(function f(t, a, n) {
			if (n == 0)
				return r.push(t);
			for (var i = 0, l = a.length; i <= l - n; i++) {
				f(t.concat(a[i]), a.slice(i + 1), n - 1);
			}
		})([], arr, num);
		return r;
	}
	/**
	 * @description ����Ȼ��n-m�ķ�Χ���ѡ��k��z��������Ҫ���ڲ�Ʊ�е����ѡ��
	 * @param {Object} options �������
	 * @param {Number} options.min ��Χ��Сֵ
	 * @param {Number} options.max ��Χ���ֵ
	 * @param {Array} options.share ���룬���ָ�������ÿһ���ﶼ�����������ڵ�Ԫ�ء���ѡ��
	 * @param {Array} options.shahao ɱ�ţ����ָ�������ÿһ���ﶼ��������������ڵ�Ԫ�ء���ѡ��
	 * @param {Number} options.size ����ĸ���
	 * @param {Number} options.count �����������һ����options.size��Ĭ��Ϊһ�顾��ѡ��
	 * @param {Boolean} options.repeat �Ƿ�����ظ� Ĭ�ϲ��ظ�����ѡ��
	 * @param {Boolean} options.sort �Ƿ����� Ĭ�ϲ����򡾿�ѡ��
	 * @param {Boolean} options.repeat_team �����һ��ʱ�������Ƿ�����ظ���Ĭ�Ͽ��ԡ���ѡ��
	 * @return {Array} �磺[[1,3,4],[3,4,6]]
	 */
	var random = function (options_p) {
		var options = {
			min : 0,
			max : 9,
			share : [],
			shahao : [],
			size : 1
		};
		$.extend(options, options_p);
		options.count = options.count || 1;
		var one_random = function (options) {
			var ar,
			tmp,
			k = 0,
			ml,
			l;
			var pre_str = '0000000000000000';
			ml = (options.max + '').length;
			ar = (options.share || []).toString();
			ar = ar === '' ? [] : ar.split(/[,\-_=+\|]/);
			l = ar.length;
			if (l > 0 && options.max > 9) { //�е���Ϊ��λ�����ϣ�ǰ�油��
				for (var i = 0; i < l; i++) {
					if (ar[i].length < ml) {
						ar[i] = pre_str.substr(0, ml - ar[i].length) + ar[i];
					}
				}
			}
			while (k < options.size) {
				tmp = (Math.floor(Math.random() * (options.max - options.min + 1)) + options.min) + '';
				tmp = pre_str.substr(0, ml - tmp.length) + tmp;
				if (options.repeat || (!options.repeat) && $.inArray(tmp, ar) == -1 && $.inArray(tmp, options.shahao || []) == -1) {
					ar.push(tmp);
					k++;
				}
			}
			if (!!options.sort) {
				ar.sort();
			}
			return typeof options.split_str !== 'undefined' ? ar.join(options.split_str) : ar;
		};
		var result = [];
		var count = combo(options.max - options.min + 1 - options.share.length - options.shahao.length, options.size);
		if (count < options.count) {
			options.repeat_team = 1;
		}
		for (var i = 0; i < options.count; i++) {
			var re_tmp = one_random(options);
			if (!options.repeat_team) {
				var re_len = result.length;
				var flag = 0;
				for (var j = 0; j < re_len; j++) {
					if (result[j].toString() == re_tmp.toString()) {
						flag = 1;
						break;
					}
				}
				if (flag) {
					i--;
				} else {
					result.push(re_tmp);
				}
			} else {
				result.push(re_tmp);
			}
		}
		return result;
	};
	// �ӿڶ���
	return {
		combo : combo,
		comboArr : combine,
		random:random
	}
});
