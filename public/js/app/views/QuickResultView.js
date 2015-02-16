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
                this.quickResult = options.quickResult;
                this.model = new Model({quickResult: this.quickResult});
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
                window.location = '#products/' + this.quickResult.CustomerNo;
                //console.log(Mansard.customer);
            }
        });
    });