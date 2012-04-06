
function getShopifyCheckoutUrl(shop_id, email) {
	var cart_token = readCookie("cart");
	//checkout URL has "create_order" appended to it to allow pre-filling forms
	var checkout_url = "https://checkout.shopify.com/carts/" + shop_id + "/" + cart_token + "/create_order";
	//if an email address is specified, append it to pre-fill forms
	if (email) {
		checkout_url += "?order[email]=" + encodeURIComponent(email);
	}
	
	return checkout_url;
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}