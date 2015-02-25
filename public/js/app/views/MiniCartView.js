define( ['Mansard', 'backbone', 'marionette', 'jquery', 'models/Model', 'hbs!templates/miniCart'],
    function(Mansard, Backbone, Marionette, $, Model, template) {
        //ItemView provides some default rendering logic
        return Backbone.Marionette.ItemView.extend( {
            template: template,
            model: null,
            items: null,
            total: null,
            // View Event Handlers
            events: {
                'click .mini-cart-item-remove': 'removeItem',
                'click .mini-checkout-button': 'checkout'
            },
            initialize: function() {

                $('.mini-card-total-holder').html(Mansard.cart.total());
                $('.cart-num').html(Mansard.cart.count());

                this.items = Mansard.cart.items;
                

                for (var i = 0; i < this.items.length; i++) {
                    this.items[i].pos = i;
                    this.total += this.items[i].price;
                    this.items[i].price = this.items[i].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }

                if (this.total) {
                    this.total = this.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
                
                this.model = new Model({items: this.items, total: this.total});
            },
            onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
				this.$el = this.$el.children();
				this.setElement(this.$el);
			},
            removeItem: function(e) {
                e.preventDefault();
                console.log($(this).parent().parent());
            },
            checkout: function(e) {
                e.preventDefault();
                Mansard.appRouter.navigate('policy/save/' + Mansard.cart.current, {trigger: true});
            }
        });
    });