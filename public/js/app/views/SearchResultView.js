define( ['Mansard', 'backbone', 'marionette', 'jquery', 'models/Model', 'hbs!templates/searchResult', 'views/QuickResultView'],
    function(Mansard, Backbone, Marionette, $, Model, template, QuickResultView) {
        //ItemView provides some default rendering logic
        return Backbone.Marionette.ItemView.extend( {
            template: template,
            model: null,
            result: null,
            quickResult: null,
            tempProduct: null,
            total: null,

            // View Event Handlers
            events: {
                'click .quick-open': 'showQuickResult',
                'click .quick-add': 'addToCart'
            },
            initialize: function(options) {
                this.result = options.result;

                if (!window.Mansard.isFA) {
                    var name = this.result.Fullname;
                    var email = this.result.email;
                    var emailTrim = email.substring(0,20);
                    var nameTrim = name.substring(0, 12);
                    var keepFullName = this.result.Fullname;
                    var keepEmail = this.result.email;
                    var truncateName = nameTrim + '[..]';
                    var truncateEmail = emailTrim + '[..]';
                    this.result.Fullname =  truncateName; //Truncate content after 6th character
                } else {
                    var name = this.result.FirstName + ' ' + this.result.LastName;
                    var email = this.result.Email;
                    var emailTrim = email.substring(0,20);
                    var nameTrim = name.substring(0, 12);
                    var keepFullName = name;
                    var keepEmail = this.result.Email;
                    var truncateName = nameTrim + '[..]';
                    var truncateEmail = emailTrim + '[..]';
                    this.result.Fullname =  truncateName; //Truncate content after 6th character
                }
                
                
                if (this.result.email || this.result.Email) {
                   this.result.email = truncateEmail;
                }
                if (!window.Mansard.tempProduct) {
                    this.result.searchButton = '<div class="search-result-button"><a href="#" class="btn btn-primary quick-open" data-user="1">Open</a></div>';
                } else {
                    this.result.searchButton = '<div class="search-result-button"><a href="#" class="btn btn-primary quick-add" data-user="1">Add</a></div>';
                }
                this.result.keepEmail = keepEmail;
                this.result.keepFullName = keepFullName;
                this.model = new Model ({result: this.result});
            },
            onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
				this.$el = this.$el.children();
				this.setElement(this.$el);                
			},
            showQuickResult: function(e) {
                e.preventDefault();
                this.quickResult = this.result;
                var quick_result = new QuickResultView({quickResult: this.quickResult});
                this.renderQuickResult(quick_result);

            },
            renderQuickResult: function(quickResult) {
               var selector = '.search-quick-result-container';
               $(selector).html(quickResult.render().el);
               
            },
            addToCart: function(e) {
                e.preventDefault();
                window.Mansard.tempProduct.customer = this.result.CustomerNo;
                window.Mansard.cart.add(window.Mansard.tempProduct);
                window.Mansard.cart.last = window.Mansard.cart.count() - 1;

                for (var i = 0; i < window.Mansard.cart.items.length; i++) {
                    window.Mansard.cart.items[i].pos = i;
                }
                $('.mini-card-total-holder').html(window.Mansard.cart.total());
                $('.cart-num').html(window.Mansard.cart.count());
                window.Mansard.customer = this.result.CustomerNo;
                window.Mansard.appRouter.navigate('products', {trigger: true});

            }
        });
    });