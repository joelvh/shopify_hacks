/* FORM FIELDS ON SHOPIFY CHECKOUT PAGE:

order[email] 
billing_address[first_name] 
billing_address[last_name] 
billing_address[company] 
billing_address[address1] 
billing_address[address2] 
billing_address[city] 
billing_address[zip] 
billing_address[country] United States
billing_address[province] 
billing_address[phone] 
billing_is_shipping on
shipping_address[first_name] 
shipping_address[last_name] 
shipping_address[company] 
shipping_address[address1] 
shipping_address[address2] 
shipping_address[city] 
shipping_address[zip] 
shipping_address[country] United States
shipping_address[province] 
shipping_address[phone] 
*/

// Get the Shopify checkout URL
function getShopifyCheckoutUrl(shop_id) {
	var cart_token = readCookie("cart");
	//checkout URL has "create_order" appended to it to allow pre-filling forms
	var checkout_url = "https://checkout.shopify.com/carts/" + shop_id + "/" + cart_token + "/create_order";
	
	return checkout_url;
}

// Create query string parameters for the checkout page to pre-fill the checkout form. 
// Model names are "order", "billing_address", and "shipping_address". 
// Example "models" argument:
// models = { 
//            order: { 
//              email: "name@domain.com" 
//            }, 
//            billing_address: { 
//              first_name: "Joel", 
//              last_name: "Van Horn" 
//            
//              // additional attributes: company, address1, address2, city, zip, country, province, phone
//
//            }, 
//            shipping_address: { 
//              first_name: "Joel", 
//              last_name: "Van Horn" 
//            
//              // additional attributes: company, address1, address2, city, zip, country, province, phone
//
//            } 
//          }
function getShopifyCheckoutPrefillQueryString(models) {
	var query = [];
	//create query string that pre-populates the checkout form
	if (models) {
		//loop through each model
		for (name in models) {
			//loop through each attribute
			for (attribute in models[name]) {
				var param = encodeURIComponent(name) + "[" + encodeURIComponent(attribute) + "]",
				    value = encodeURIComponent(models[name][attribute]);
				//add query string name/value pair
				query.push( param + "=" + value);
			}
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