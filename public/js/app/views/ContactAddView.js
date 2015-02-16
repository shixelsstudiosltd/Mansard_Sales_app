define( ['Mansard', 'backbone', 'marionette', 'jquery', 'models/Model', 'hbs!templates/contactAdd'],
    function(Mansard, Backbone, Marionette, $, Model, template) {
        //ItemView provides some default rendering logic
        return Backbone.Marionette.ItemView.extend( {
            template: template,
            model: null,
            // View Event Handlers
            events: {
                'click .submit-contact-button': 'saveContact',
            },
            initialize: function() {
                var savebutton = null;
                if (Mansard.tempProduct && !Mansard.customer) {
                    savebutton = 'Save & Add to Cart';
                } else {
                    savebutton = 'Save Contact';
                }

                this.model = new Model({savebutton: savebutton});
            },
            onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
				this.$el = this.$el.children();
				this.setElement(this.$el);
                $('.main-menu-button, #right-area-container').removeClass('close-main-nav active');
                $('#main-nav-container, #right-area-container').animate({'left': '0%'});
			},
            saveContact: function(e) {
                e.preventDefault();

                if ($('.contact-add-FirstName').val() && $('.contact-add-LastName').val() && $('.contact-add-MobileNo').val() && $('.contact-add-Email').val() && $('.contact-add-PlaceOfWork').val() && ($('.contact-add-Gender').val() !== '0')) {
                    $('.submit-contact-button').html('<i class="fa fa-spinner fa-spin"></i>');
                    $('.submit-contact-button').attr('disabled', 'disabled');
                    var contact = {
                        FirstName: $('.contact-add-FirstName').val(),
                        LastName: $('.contact-add-LastName').val(),
                        MobileNo: $('.contact-add-MobileNo').val(),
                        Email: $('.contact-add-Email').val(),
                        OwnerUsername: Mansard.currentUser,
                        PlaceOfWork: $('.contact-add-PlaceOfWork').val(),
                        Gender: $('.contact-add-Gender').val()
                    };
                    Mansard.api.save_contact(contact, Mansard.customer);

                    if (Mansard.tempProduct && !Mansard.customer) {
                        var getCust = Mansard.api.convert(contact);

                        Mansard.tempProduct.customer = getCust.CustRowID;
                        Mansard.cart.add(Mansard.tempProduct);

                        for (var i = 0; i < Mansard.cart.items.length; i++) {
                            Mansard.cart.items[i].pos = i;
                            Mansard.cart.total += Mansard.cart.items[i].price.replace(/\D/g,'');;
                        }

                        if (this.total) {
                            this.total = this.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        }
                        $('.mini-card-total-holder').html(this.total);
                        $('.cart-num').html(Mansard.cart.count());
                        Mansard.customer = getCust.CustRowID;
                        Mansard.appRouter.navigate('products', {trigger: true});
                    }
                } else {
                    $('.contact-add-form-error').html('<div class="alert alert-warning" role="alert">Please fill out all fields!</div>');
                }

                
            }
        });
    });