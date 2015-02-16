define(['jquery', 'hbs!templates/desktopHeader', 'backbone','models/Model', 'views/MiniCartView', 'marionette'],
    function ($, template, Backbone, Model, MiniCartView) {
        //ItemView provides some default rendering logic
        return Backbone.Marionette.ItemView.extend({
            template:template,
            model: null,
            minicart: null,
            events: {
                'click .main-menu-button': 'showNav',
                'click .close-main-nav': 'hideNav',
                'click .add-contact-button': 'addContact',
                'click .back-menu-button': 'goBack',
                'click .cart-button': 'viewMiniCart',
                'click .close-mini-cart': 'hideMiniCart'
            },
            initialize: function(options) {
                this.minicart = new MiniCartView();
                this.model = new Model({title: options.title, button: options.button, menu: options.menu, cart_num: Mansard.cart.count(), isCart: options.isCart, nav: options.nav, nav_button: options.nav_button});
            },
            onRender: function () {
             // get rid of that pesky wrapping-div
            // assumes 1 child element.
                this.$el = this.$el.children();
                this.setElement(this.$el);
            },
            showNav: function() {
                $('#main-nav-container, #right-area-container').animate({'left': '30%'});
                $('.main-menu-button, #right-area-container').addClass('close-main-nav active');
            },
            hideNav: function() {
                $('.main-menu-button, #right-area-container').removeClass('close-main-nav active');
                $('#main-nav-container, #right-area-container').animate({'left': '0%'});
            },
            addContact: function(e) {
                e.preventDefault();
                Mansard.appRouter.navigate('#contact/add', {trigger: true}); 
            },
            goBack: function() {
                window.history.back();
            },
            viewMiniCart: function() {
                $('.cart-button').addClass('close-mini-cart');
                $('#desktop-header').prepend(this.minicart.render().el);
            },
            hideMiniCart: function() {
                $('.mini-cart-view').remove();
                $('.cart-button').removeClass('close-mini-cart');
                this.minicart.remove();

            }
        });
    });