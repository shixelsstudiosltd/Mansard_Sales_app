define( ['Mansard', 'backbone', 'marionette', 'jquery', 'models/Model', 'hbs!templates/quickResult'],
    function(Mansard, Backbone, Marionette, $, Model, template) {
        //ItemView provides some default rendering logic
        return Backbone.Marionette.ItemView.extend( {
            template: template,
            quickResult: null,
            model: null,
            // View Event Handlers
            events: {
                'click .view-full-profile': 'viewProfile',
                'click .add-policys': 'addPolicy'
            },
            initialize: function(options) {
                var isCustomer = null;
                this.quickResult = options.quickResult;
                if (this.quickResult.type === 'customer') {
                    isCustomer = true;
                } else {
                    isCustomer = false;
                }
                this.model = new Model({quickResult: this.quickResult, isCustomer: isCustomer});
                console.log(this.quickResult);
            },
            onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
				this.$el = this.$el.children();
				this.setElement(this.$el);
			},
            viewProfile: function() {
              var user_query = this.createQuerySting(this.quickResult);
              var url_customer = '#customer?' + user_query;
              window.location = url_customer;
            },
            createQuerySting: function(obj) {
                var str = [];
                for(var p in obj){
                   if (obj.hasOwnProperty(p)) {
                       str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                   }
                }
                return str.join("&");
            },
            addPolicy: function(e) {
                e.preventDefault();
                if (this.quickResult.type === 'customer') {
                    window.Mansard.customer = this.quickResult.CustomerNo;
                     window.Mansard.appRouter.navigate('products', {trigger: true});
                } else if (this.quickResult.type === 'contact') {
                    getCust = window.Mansard.api.convert(this.quickResult);
                    window.Mansard.customer = getCust.CustRowID;
                     window.Mansard.appRouter.navigate('dicovery', {trigger: true});
                }
               
                //console.log(Mansard.customer);
            }
        });
    });