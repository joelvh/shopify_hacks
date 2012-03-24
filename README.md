Shopify has many limitations and undocumented functionality. Some things can be achieved indirectly, by hacking on their platform and coercing it into doing what you need it to do. I wrote a blog post about some discoveries here:

http://joelvanhorn.com/2012/03/24/pre-filling-shopify-checkout-forms/

Shopify's checkout form can be pre-filled, but took some trial-and-error to finally get the solution right. Part of it requires JavaScript. An example function is in shopify_hacks.js.

Shopify has an option to allow users to login at checkout. However, these accounts can only be created by manually sending invitations to users with a link that lets them create a password. I used Mechanize to automate the steps in a command line script called mechanize_activate_customer_login.rb. (Note: This script assumes you've already created a Shopify Customer through the API.)