define( ['Mansard', 'backbone', 'marionette', 'jquery', 'models/Model', 'hbs!templates/search', 'views/SearchResultView'],
    function(Mansard, Backbone, Marionette, $, Model, template, SearchResultView) {
        //ItemView provides some default rendering logic
        return Backbone.Marionette.ItemView.extend( {
            template: template,
            model: null,
            searchStore: null,
            tempProduct: null,
            // View Event Handlers
            events: {
                'keyup .customer-search': 'searchHandler'
            },
            initialize: function(options) {
                if (options && options.tempProduct) {
                    this.tempProduct = options.tempProduct;
                    console.log(options, options.tempProduct);
                }
                
            },
            onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
                this.$el = this.$el.children();
                this.setElement(this.$el);
                $('.main-menu-button, #right-area-container').removeClass('close-main-nav active');
                $('#main-nav-container, #right-area-container').animate({'left': '0%'});
            },
            searchHandler: function (e) {
                var query = e.currentTarget.value; 
                if (query.length > 2) {
                    Mansard.api.search(query);
                } else if (query.length < 2) {
                    $('.search-results-container').html('');
                    $('.results-num').html('0');
                }
                
            }
        });
    });