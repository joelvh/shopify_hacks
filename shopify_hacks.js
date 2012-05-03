// Get the Shopify checkout URL
function getShopifyCheckoutUrl(shop_id) {
	var cart_token = readCookie("cart");
	//checkout URL has "create_order" appended to it to allow pre-filling forms
	var checkout_url = "https://checkout.shopify.com/carts/" + shop_id + "/" + cart_token + "/create_order";
	
	return checkout_url;
}

// Create query string parameters for the checkout page to pre-fill the checkout form
function getShopifyCheckoutPrefillQueryString(params) {
	var query = [];
	//create query string that pre-populates the checkout form
	if (params) {
		for (key in params) {
			query.push( "order[" + encodeURIComponent(key) + "]=" + encodeURIComponent(params[key]) )
		}
	}
	
	return query.join("&");
}

// Get the Shopify checkout URL with query string parameters to pre-fill the checkout form
function getShopifyCheckoutUrlWithPrefillQueryString(shop_id, params) {
	var checkout_url = getShopifyCheckoutUrl(shop_id);
	var query = getShopifyCheckoutPrefillQueryString(params);
	
	return checkout_url + "?" + query;
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