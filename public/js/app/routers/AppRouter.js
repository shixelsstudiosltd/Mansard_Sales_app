define(['backbone', 'marionette'], function(Backbone, Marionette) {
   return Backbone.Marionette.AppRouter.extend({
       //"index" must be a method in AppRouter's controller
       appRoutes: {
           "": "index",
           "login": "login",
           "dashboard": "dashboard",
           "dashboard?*tempProduct": "dashboard",
           "products": "products",
           "customer/add": "contactAdd",
           "customer?*user": "customer",
           "discovery": "discovery",
           "kyc": "kyc",
           "policy/save/:count": 'policy',
           "esms": "esms",
           "payment": "payment"
       }
   });
});