define( ['Mansard', 'backbone', 'marionette', 'jquery', 'models/Model', 'hbs!templates/customerProfile'],
    function(Mansard, Backbone, Marionette, $, Model, template) {
        //ItemView provides some default rendering logic
        return Backbone.Marionette.ItemView.extend( {
            template: template,
            model: null,
            customer: null,
            // View Event Handlers
            events: {
                'click .add-customer-button': 'addCustomer',
                'click .call-customer-button': 'callCustomer',
                'click .email-customer-button': 'emailCustomer'
            },
            initialize: function(options) {
                this.customer = options.user;
                console.log(this.customer);                
                var credentials = {customerNo: this.customer.CustomerNo, email: this.customer.keepEmail};
                this.customer.profile = Mansard.api.customer(credentials);
                this.customer.bdate = this.customer.bdate.replace(/\%3A/g, ':');
                this.customer.bdate = this.customer.bdate.replace(/\%2F/g, '/');
                this.customer.email = this.customer.email.replace('%40', '@');
                this.model = new Model({customer: this.customer, genPols: this.customer.profile.GenBizPolicies, lifePols: this.customer.profile.LifePolicies});
            },
            onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
				this.$el = this.$el.children();
				this.setElement(this.$el);
			},
            addCustomer: function() {
                Mansard.appRouter.navigate('#products', {trigger:true});
            },
            callCustomer: function() {
                var num = null;
                if (this.customer.PhoneNo) {
                    num = this.customer.PhoneNo;
                     window.open('tel:' + num);
                } else if (this.customer.tel2 && !this.customer.PhoneNo) {
                    num = this.customer.tel2;
                    window.open('tel:' + num);
                }
               
            },
            emailCustomer: function() {
                window.open('mailto:' + this.customer.email);
            }
        });
    });