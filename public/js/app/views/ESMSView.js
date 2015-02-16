define( ['Mansard', 'backbone', 'marionette', 'jquery', 'models/Model', 'hbs!templates/esms'],
    function(Mansard, Backbone, Marionette, $, Model, template) {
        //ItemView provides some default rendering logic
        return Backbone.Marionette.ItemView.extend( {
            template: template,
            model: null,
            sectors: {},
            // View Event Handlers
            events: {
            },
            initialize: function() {
                this.sectors.main = Mansard.api.sectors('main');
                this.sectors.sub = Mansard.api.sectors('sub');
                this.model = new Model({sectors: this.sectors});
            },
            onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
				this.$el = this.$el.children();
				this.setElement(this.$el);
			}
        });
    });