define([
    'Mansard', 
    'backbone', 
    'marionette', 
    'views/SearchView', 
    'views/DesktopHeaderView',
    'views/ProfileView',
    'views/LoginView',
    'views/ProductsView',
    'views/ContactAddView',
    'views/CustomerProfileView',
    'views/DiscoveryQuestionsView',
    'views/KYCView',
    'views/NavView',
    'views/SavePolicyView',
    'views/ESMSView',
    'views/PaymentView'
    ],
    function (
    Mansard, 
    Backbone, 
    Marionette, 
    SearchView, 
    DesktopHeaderView,
    ProfileView,
    LoginView,
    ProductsView,
    ContactAddView,
    CustomerProfileView,
    DiscoveryQuestionsView,
    KYCView,
    NavView,
    SavePolicyView,
    ESMSView,
    PaymentView
    ){
    return Backbone.Marionette.Controller.extend({
        initialize:function (options) {
            Mansard.navRegion.show(new NavView());
            Mansard.profileRegion.show(new ProfileView());
        },
        //gets mapped to in AppRouter's appRoutes
        index:function () {
            if (!Mansard.isLoggedIn) {
             Mansard.fullAppRegion.show(new LoginView());
            } else {
                if (Mansard.isFA) {
                    Mansard.appRouter.navigate('dashboard', {trigger: true});
                } else {
                    Mansard.appRouter.navigate('dashboard', {trigger: true});
                   // Mansard.appRouter.navigate('products', {trigger: true});
                }
            }
        },
        login: function() {
            if (!Mansard.isLoggedIn) {
             Mansard.fullAppRegion.show(new LoginView());
            } else {
               if (Mansard.isFA) {
                    Mansard.appRouter.navigate('dashboard', {trigger: true});
                } else {
                    Mansard.appRouter.navigate('dashboard', {trigger: true});
                    //Mansard.appRouter.navigate('products', {trigger: true});
                }
            }
        },
        dashboard: function(tempProduct) {
            tempProduct = Mansard.api.parseQueryString(tempProduct);
            console.log(tempProduct);
            if (Mansard.isLoggedIn) {
                Mansard.headerRegion.show(new DesktopHeaderView({title: 'Customer & Contact Search', button: 'fa fa-shopping-cart', menu: 'cart-button', isCart: true, nav: 'fa fa-bars', nav_button: 'main-menu-button'}));
                Mansard.mainAppRegion.show(new SearchView({tempProduct: tempProduct})); 
               
           } else {
               Mansard.appRouter.navigate('#login', {trigger: true});
           }
           
        },
        products: function(customer) {
            if (Mansard.isLoggedIn) {
                if (customer) {
                    Mansard.customer = customer;
                }
                Mansard.headerRegion.show(new DesktopHeaderView({title: 'Products Search', button: 'fa fa-shopping-cart', menu: 'cart-button', isCart: true, nav: 'fa fa-bars', nav_button: 'main-menu-button'}));
                Mansard.mainAppRegion.show(new ProductsView());
            } else {
                this.login();
            }
        },
        contactAdd: function() {
            if (Mansard.isLoggedIn) {
                Mansard.headerRegion.show(new DesktopHeaderView({title: 'Add a Contact', button: 'fa fa-plus', menu: 'add-contact-button', isCart: false, nav: 'fa fa-bars', nav_button: 'main-menu-button'}));
                Mansard.mainAppRegion.show(new ContactAddView());
            } else {
                this.login();
            }
        },
        customerAdd: function() {
            if (Mansard.isLoggedIn) {
                Mansard.headerRegion.show(new DesktopHeaderView({title: 'Add a Customer', button: 'fa fa-plus', menu: 'add-contact-button', isCart: false, nav: 'fa fa-bars', nav_button: 'main-menu-button'}));
                Mansard.mainAppRegion.show(new ContactAddView());
            } else {
                this.login();
            }
        },
        customer: function(user) {
            user = Mansard.api.parseQueryString(user);
            if (Mansard.isLoggedIn) {
                Mansard.headerRegion.show(new DesktopHeaderView({title: 'Customer Porfile', button: 'fa fa-shopping-cart', menu: 'cart-button', isCart: true, nav: 'fa fa-bars', nav_button: 'main-menu-button'}));
                Mansard.mainAppRegion.show(new CustomerProfileView({user: user}));
            } else {
                this.login();
            }
        },
        discovery: function() {
            if (Mansard.isLoggedIn) {
                Mansard.headerRegion.show(new DesktopHeaderView({title: 'Discovery Questions', button: 'fa fa-shopping-cart', menu: 'cart-button', isCart: true, nav: 'fa fa-bars', nav_button: 'main-menu-button'}));
                Mansard.mainAppRegion.show(new DiscoveryQuestionsView());
            } else {
                this.login();
            }
        },
        kyc: function() {
            if (Mansard.isLoggedIn) {
                Mansard.headerRegion.show(new DesktopHeaderView({title: 'Know Your Customer', button: 'fa fa-shopping-cart', menu: 'cart-button', isCart: true, nav: 'fa fa-bars', nav_button: 'main-menu-button'}));
                Mansard.mainAppRegion.show(new KYCView());
            } else {
                this.login();
            }
        },
        policy: function() {
            if (Mansard.isLoggedIn) {
                Mansard.headerRegion.show(new DesktopHeaderView({title: 'Save Policy', button: 'fa fa-shopping-cart', menu: 'cart-button', isCart: true, nav: 'fa fa-bars', nav_button: 'main-menu-button'}));
                Mansard.mainAppRegion.show(new SavePolicyView());
            } else {
                this.login();
            }
        },
        esms: function() {
            if (Mansard.isLoggedIn) {
                Mansard.headerRegion.show(new DesktopHeaderView({title: 'Environmental and Social Risk Management System (ESMS)', button: 'fa fa-shopping-cart', menu: 'cart-button', isCart: true, nav: 'fa fa-bars', nav_button: 'main-menu-button'}));
                Mansard.mainAppRegion.show(new ESMSView());
            } else {
                this.login();
            }
        },
        payment: function(){
           if (Mansard.isLoggedIn) {
                Mansard.headerRegion.show(new DesktopHeaderView({title: 'Policy Payment', button: 'fa fa-shopping-cart', menu: 'cart-button', isCart: true, nav: 'fa fa-bars', nav_button: 'main-menu-button'}));
                Mansard.mainAppRegion.show(new PaymentView());
            } else {
                this.login();
            } 
        }
    });
});