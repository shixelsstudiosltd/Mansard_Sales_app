define( ['Mansard', 'backbone', 'marionette', 'jquery', 'models/Model', 'hbs!templates/kyc'],
    function(Mansard, Backbone, Marionette, $, Model, template) {
        //ItemView provides some default rendering logic
        return Backbone.Marionette.ItemView.extend( {
            template: template,
            dropdowns: {},
            model: null,
            // View Event Handlers
            events: {
                'click .choose-ind': 'showIndForm',
                'click .choose-corp': 'showCorpForm',
                'click .submit-corp': 'submitCorpForm',
                'click .submit-ind' : 'submitIndForm',
                'click .go-to-ind2': 'goToInd2',
                'click .go-to-ind1': 'goToInd1'
            },
            initialize: function() {
                this.dropdowns.business = Mansard.api.kyc_dropdowns('business');
                this.dropdowns.transaction = Mansard.api.kyc_dropdowns('transaction');
                this.dropdowns.religion = Mansard.api.kyc_dropdowns('religion');
                this.dropdowns.job = Mansard.api.kyc_dropdowns('job');
                this.dropdowns.employ = Mansard.api.kyc_dropdowns('employ');
                this.dropdowns.profession = Mansard.api.kyc_dropdowns('profession');
                this.dropdowns.salary = Mansard.api.kyc_dropdowns('salary');


                this.model = new Model({dropdowns: this.dropdowns});
                console.log(this.dropdowns);
            },
            onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
				this.$el = this.$el.children();
				this.setElement(this.$el);
			},
            showCorpForm: function(e) {
                e.preventDefault();

                $('.ind-form').hide();
                
                $('.temp-search-result').hide();
                
                $('.choose-ind').removeClass('active');
                
                $(e.currentTarget).addClass('active');
               
                $('.corp-form').show();
            },
            showIndForm: function(e) {
                e.preventDefault();
                
                $('.corp-form').hide();
                
                $('.temp-search-result').hide();
                
                $('.choose-corp').removeClass('active');
                
                $(e.currentTarget).addClass('active'); 
                
                $('.ind-form').show();
            },
            submitIndForm: function(e) {
                e.preventDefault();
                var indFormData = $('.ind-form').serialize();
                Mansard.api.kyc(indFormData);
            },
            submitCorpForm: function(e) {
                e.preventDefault();
                var corpFormData = $('.corp-form').serialize();
                Mansard.api.kyc(corpFormData);
            },
            goToInd1: function(e) {
                e.preventDefault();

                $('.ind-form-2').hide();
                $('.ind-form-1').show();
            },
            goToInd2: function(e) {
                e.preventDefault();

                $('.ind-form-1').hide();
                $('.ind-form-2').show();

            }
        });
    });