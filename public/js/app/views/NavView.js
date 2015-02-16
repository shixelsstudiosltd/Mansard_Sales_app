define( ['Mansard', 'backbone', 'marionette', 'jquery', 'models/Model', 'hbs!templates/nav'],
    function(Mansard, Backbone, Marionette, $, Model, template) {
        //ItemView provides some default rendering logic
        return Backbone.Marionette.ItemView.extend( {
            template: template,
            model: null,
            // View Event Handlers
            events: {
                'click .nav-logout': 'logout'
            },
            initialize: function() {
            },
            onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
				this.$el = this.$el.children();
				this.setElement(this.$el);
			},
            logout: function() {
                Mansard.api.logout();
            }
        });
    });