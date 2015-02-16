define( ['Mansard', 'backbone', 'marionette', 'jquery', 'models/Model', 'hbs!templates/savePolicy'],
    function(Mansard, Backbone, Marionette, $, Model, template) {
        //ItemView provides some default rendering logic
        return Backbone.Marionette.ItemView.extend( {
            template: template,
            policy_type: null,
            model: null,
            SubAgentCode: null,
            payFreq: null,
            // View Event Handlers
            events: {
                'change .save-policy-product': 'populatePeriods',
                'change .save-policy-payment-period': 'matchPeriodsToPay',
                'change .save-policy-insurance-period': 'matchPeriodsToIns',
                'click .to-motor-2': 'goToMotor2',
                'click .to-motor-1': 'goToMotor1',
                'click .submit-policy': 'submitPolicy',
                'click .next-policy': 'moveToNext'

            },
            initialize: function(options) {

                this.policy_type = Mansard.cart.items[Mansard.cart.current].type;
                this.SubAgentCode = Mansard.currentUser_SubAgentCode;
                var lifeProducts = Mansard.api.products('life');
                var submitButton = null;
                if (Mansard.cart.current === Mansard.cart.last) {
                    submitButton = '<button class="policy-next btn btn-primary pull-right submit-policy">Submit Policy(s)</button>';
                } else {
                    submitButton = '<button class="policy-next btn btn-primary pull-right next-policy">Next Policy Item</button>';
                }
                if (this.policy_type === 'motor') {
                    var motor = {};
                    motor.manYears = Mansard.api.policy_dropdowns('manYear');
                    motor.places = Mansard.api.policy_dropdowns('places');
                    motor.uses = Mansard.api.policy_dropdowns('uses');
                    motor.plates = Mansard.api.policy_dropdowns('plates');
                    this.model = new Model ({isMotor: true, motor: motor, submitButton: submitButton});
                } else if (this.policy_type === 'life'){
                    this.payFreq = Mansard.api.policy_dropdowns('payFreq');
                    this.model = new Model({isMotor: false, lifeProducts: lifeProducts, payFreq: this.payFreq, submitButton: submitButton});
                }
            },
            onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
				this.$el = this.$el.children();
				this.setElement(this.$el);
			},
            populatePeriods: function() {
                var productCode = $('.save-policy-product').val();
                var periods = {};
                var insOption = null;
                var payOption = null;

                periods.ins = Mansard.api.policy_dropdowns('insPeriod', productCode);
                periods.pay = Mansard.api.policy_dropdowns('payPeriod', productCode);
                $('.save-policy-insurance-period').html('');
                $('.save-policy-payment-period').html('');
                for (var i = 0; i < periods.ins.length; i++) {
                    insOption = '<option value="'+ periods.ins[i].Value + '">' + periods.ins[i].Description + '</option>';
                    $('.save-policy-insurance-period').prepend(insOption);
                }

                for (var j = 0; j < periods.pay.length; j++) {
                    console.log(payOption);
                    payOption = '<option value="'+ periods.pay[j].Value + '">' + periods.pay[j].Description + '</option>';
                    $('.save-policy-payment-period').prepend(payOption);
                }
                
                console.log(periods);
            },
            matchPeriodsToPay: function() {
                var matchVal = $('.save-policy-payment-period').val();

                $('.save-policy-insurance-period').val(matchVal);
            },
            matchPeriodsToIns: function() {
                var matchVal = $('.save-policy-insurance-period').val();

                $('.save-policy-payment-period').val(matchVal);
            },
            goToMotor1: function(e){
                e.preventDefault()
                $('.policy-motor-form-page').hide();
                $('.policy-motor-form-1').show()
            },
            goToMotor2: function(e){
                 e.preventDefault()
                $('.policy-motor-form-page').hide();
                $('.policy-motor-form-2').show()
            },
            submitPolicy: function(e){
                 e.preventDefault()
                 if (this.policy_type === 'motor') {

                    var motorFormData = JSON.parse(JSON.stringify($(".policy-motor-form").serializeArray()));
                    Mansard.cart.items[Mansard.cart.current].policy_details = motorFormData;
                } else {
                    var lifeFormData = JSON.parse(JSON.stringify($(".policy-life-form").serializeArray()));
                    Mansard.cart.items[Mansard.cart.current].policy_details = lifeFormData;
                }
                Mansard.appRouter.navigate('payment', {trigger: true});
            },
            moveToNext: function(e){
                e.preventDefault();

                if (this.policy_type === 'motor') {
                    var motorFormData = JSON.parse(JSON.stringify($(".policy-motor-form").serializeArray()));
                    Mansard.cart.items[Mansard.cart.current].policy_details = motorFormData;
                } else {
                    var lifeFormData = JSON.parse(JSON.stringify($(".policy-life-form").serializeArray()));
                    Mansard.cart.items[Mansard.cart.current].policy_details = lifeFormData;
                }

                Mansard.cart.current++;
                Mansard.appRouter.navigate('policy/save/' + Mansard.cart.current, {trigger: true});
            
        }    
        });
    });