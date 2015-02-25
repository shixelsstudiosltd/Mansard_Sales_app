/*
    MansardCart
    - Handles all cart functions
*/
define([
    "jquery",
    "underscore",
    "backbone"
    ],
    function(
    $,
    _,
    Backbone
    ){
    // Creates a new Backbone Model class object
    var MansardCart = Backbone.Model.extend({

        initialize: function() {
            _.bindAll(this);

        },
        items: [],
        count: function() {
            return Mansard.cart.items.length;  
        },
        qty_up: function(item) {
            item.qty++;
        },
        qty_down: function(item) {
            item.qty--;

            if (item.qty === 0) {
                this.remove(item);
            }
        },
        remove: function(item) {
             var position = Mansard.cart.items.indexOf(item);

             if ( ~position ) Mansard.cart.items.splice(position, 1);
        },
        item: function(x) {
                return Mansard.cart.items[x];
        },
        clear: function() {
            Mansard.cart.items = [];
        },
        add: function(item) {
            console.log('items before push: ', Mansard.cart.items);
            Mansard.cart.items.push(item);
            console.log('items after push: ', Mansard.cart.items);
        }, 
        edit: function(item, old_key, new_val) {
           var position = Mansard.cart.items.indexOf(item);

           if ( ~position ) {
           }
        },
        total: function() {
            var cart_total = null;
            for (var i = 0; i < Mansard.cart.count(); i++) {
                cart_total += parseInt(Mansard.cart.items[i].price.replace(/\D/g,''));
            }

            return cart_total;
        }
    });

    // Returns the Model class
    return  MansardCart;

}

);
