define( ['Mansard', 'backbone', 'marionette', 'jquery', 'models/Model', 'hbs!templates/miniCartItem'],
function(Mansard, Backbone, Marionette, $, Model, template) {
    //ItemView provides some default rendering logic
    return Backbone.Marionette.ItemView.extend( {
        template: template,
        model: null,
        total: null,
        item: null,
        // View Event Handlers
        events: {
            
        },
        initialize: function() {
            this.model = new Model({item: this.item, total: this.total});
        },
        onRender: function () {
        // get rid of that pesky wrapping-div
        // assumes 1 child element.
			this.$el = this.$el.children();
			this.setElement(this.$el);
		}
    });
});