#!/usr/bin/env ruby

require 'rubygems'
require 'json'
require 'cgi'
require 'mechanize'

if ARGV.size < 5
    puts "This script requires the following arguments: shop name, admin email, admin password, customer email, customer password"
    exit
end

#
# Invoke this script on the command line like this:
# 
#     ruby mechanize_activate_customer_login.rb shopname mechanize@shop.com mechanize_password customer@gmail.com new_password
#

shop_name = ARGV[0]
admin_email = ARGV[1]
admin_password = ARGV[2]
customer_email = ARGV[3]
customer_password = ARGV[4]

base_url = "https://#{shop_name}.myshopify.com"
start_time = this_time = Time.now
agent = Mechanize.new

puts "Fetching login page..."

login_page = agent.get("#{base_url}/admin")

last_time, this_time = this_time, Time.now
puts "   ... elapsed total (#{this_time-start_time}) since last (#{this_time-last_time})"

puts "Filling out login form..."

login_form = login_page.form
login_form.login = admin_email
login_form.password = admin_password

puts "Submitting login form..."

login_result = agent.submit(login_form, login_form.button)

last_time, this_time = this_time, Time.now
puts "   ... elapsed total (#{this_time-start_time}) since last (#{this_time-last_time})"

# TODO: make sure login succeeded

puts "Fetching disabled customer by email address..."

customer_results_page = agent.get("#{base_url}/admin/customers/search.json?f[]=state:disabled&f[]=email:#{CGI.escape(customer_email)}")

last_time, this_time = this_time, Time.now
puts "   ... elapsed total (#{this_time-start_time}) since last (#{this_time-last_time})"

customer_results = JSON.parse(customer_results_page.body)['customers']

puts "#{customer_results.size} customer(s) found"

unless customer_results.size == 0
    
    customer = customer_results[0]
    customer_id = customer['id']
    
    puts "Customer ID is #{customer_id}"
    
    puts "Retrieving invite code"
    
    invite_link_page = agent.get("#{base_url}/admin/customers/#{customer_id}/new_account")
    
    last_time, this_time = this_time, Time.now
    puts "   ... elapsed total (#{this_time-start_time}) since last (#{this_time-last_time})"

    invite_content = invite_link_page.body
    # find the invite code in the email template
    invite_code = /[0-9a-f]{32}/.match(invite_content).to_s
    
    puts "Invite code is #{invite_code}"
    
    puts "Fetching activation page"
    
    activate_result_page = agent.get("#{base_url}/account/activate/#{invite_code}")
    
    last_time, this_time = this_time, Time.now
    puts "   ... elapsed total (#{this_time-start_time}) since last (#{this_time-last_time})"

    puts "Using activation code as customer password"
    
    pp activate_result_page

    # Loops through all forms on activate_result_page to identify form which contains password fields,
    # and assigns discovered field to activate_form
    activate_form = nil
    activate_result_page.forms.each do |form|
      form.fields.each do |field|
        if field.name.include?('password')
          activate_form = form
          break
        end
      end
    end

    # if you're generating a random password, you could use the invite code
    # because it is randomly generated each time the invite email is displayed
    activate_form['customer[password]'] = customer_password
    activate_form['customer[password_confirmation]'] = customer_password

    puts "Submitting activation form"

    pp agent.submit(activate_form, activate_form.buttons.first)

    last_time, this_time = this_time, Time.now
    puts "   ... elapsed total (#{this_time-start_time}) since last (#{this_time-last_time})"

    puts "Email (#{customer_email})"

end