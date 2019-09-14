//借书请求
$(document).ready(function() {
	$('#borrow').click(function() {
		var barcode = $("#barcode").text();
		if (barcode == "") {
			barcode = $("#barcode").val();
		}
		var url = "/borrow";
		$.StandardPost(url, {
			barcode: barcode
		});
	});
});

//还书请求
$(document).ready(function() {
	$(".return").each(function(index) {
		$(".return").eq(index).click(function() {
			var url = "/mylib/return";
			var barcode = $(".barcode").eq(index).text();
			$.StandardPost(url, {
				barcode: barcode
			});
		});
	});
});


//续借请求
$(document).ready(function() {
	$(".renew").each(function(index) {
		$(".renew").eq(index).click(function() {
			var url = "/mylib/renew";
			var barcode = $(".barcode").eq(index).text();
			$.StandardPost(url, {
				barcode: barcode
			});
		});
	});
});


$.extend({
	StandardPost: function(url, args) {
		var form = $("<form method='post'></form>");
		var input;
		form.attr({
			"action": url
		});
		$.each(args, function(key, value) {
			input = $("<input type='hidden'>");
			input.attr({
				"name": key
			});
			input.val(value);
			form.append(input);
		});
		form.appendTo(document.body);
		form.submit();
		document.body.removeChild(form[0]);
	}
});