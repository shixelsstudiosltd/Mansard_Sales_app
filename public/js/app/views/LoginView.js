define( ['Mansard', 'backbone', 'marionette', 'jquery', 'models/Model', 'hbs!templates/login'],
    function(Mansard, Backbone, Marionette, $, Model, template) {
        //ItemView provides some default rendering logic
        return Backbone.Marionette.ItemView.extend( {
            template: template,
            // View Event Handlers
            events: {
                'click .login-button': 'handleLogin',
                'click .continue-button': 'handleContinue'
            },
            onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
            console.log('login!');
				this.$el = this.$el.children();
				this.setElement(this.$el);
			},
            handleLogin: function(e) {
                e.preventDefault();

                if (!$('.login-username').val() || !$('.login-password').val()) {
                    $('.login-error').html('<div class="alert alert-warning" role="alert">Please fill out all fields!</div>');
                } else if ($('.login-password').val() && $('.login-username').val()) {
                    var username = $('.login-username').val();
                    var password = $('.login-password').val();
                    var credentials = {username: username, password: password};
                    console.log(credentials);
                    Mansard.api.login(credentials);
                }
            },
            handleContinue: function(e) {
                e.preventDefault();

                var agentcode = $('.login-agentcode').val();

                if (agentcode) {
                    Mansard.api.isFA(agentcode);
                } else {
                    $('.login-error').html('<div class="alert alert-warning" role="alert">Please enter agent code!</div>');
                }

                $('.continue-button').html('<i class="fa fa-spinner fa-spin"></i>');
                $('.continue-button').attr('disabled', 'disabled');
            }
        });
    });