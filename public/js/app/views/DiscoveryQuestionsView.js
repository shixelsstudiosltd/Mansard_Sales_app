define( ['Mansard', 'backbone', 'marionette', 'jquery', 'models/Model', 'hbs!templates/discoveryQuestions'],
    function(Mansard, Backbone, Marionette, $, Model, template) {
        //ItemView provides some default rendering logic
        return Backbone.Marionette.ItemView.extend( {
            template: template,
            questions: null,
            model: null,
            // View Event Handlers
            events: {
                'click .go-to-sec-1': 'goTo1',
                'click .go-to-sec-2': 'goTo2',
                'click .go-to-sec-3': 'goTo3',
                'click .go-to-sec-4': 'goTo4',
                'click .submit-discovery': 'submitQuestions'
            },
            initialize: function() {
                this.questions = Mansard.discovery_questions;
                var sections = {
                    one: {section: '1', questions: []},
                    two: {section: '2', questions: []},
                    three: {section: '3', questions: []},
                    four: {section: '4', questions: []}
                };
                for (var i = 0; i < this.questions.length; i++) {
                    this.questions[i].options = Mansard.api.discovery_options(this.questions[i].QuestionID);
                    if (this.questions[i].SectionID === '2') {
                        sections.one.name = this.questions[i].SectionName;
                        sections.one.questions.push(this.questions[i]);
                    } else if (this.questions[i].SectionID === '3') {
                        sections.two.name = this.questions[i].SectionName;
                        sections.two.questions.push(this.questions[i]);
                    } else if (this.questions[i].SectionID === '4') {
                        sections.three.name = this.questions[i].SectionName;
                        sections.three.questions.push(this.questions[i]);
                    } else if (this.questions[i].SectionID === '5') {
                        sections.four.name = this.questions[i].SectionName;
                        sections.four.questions.push(this.questions[i]);
                    }
                }

                this.model = new Model({sections: sections});
                console.log(sections);
            },
            onRender: function () {
            // get rid of that pesky wrapping-div
            // assumes 1 child element.
				this.$el = this.$el.children();
				this.setElement(this.$el);
			},
            goTo1: function(e) {
                e.preventDefault();
                $('.discovery-section').hide();
                $('.discovery-section-1').fadeIn();
            },
            goTo2: function(e) {
                e.preventDefault();
                $('.discovery-section').hide();
                $('.discovery-section-2').fadeIn();
            },
            goTo3: function(e) {
                e.preventDefault();
                $('.discovery-section').hide();
                $('.discovery-section-3').fadeIn();
            },
            goTo4: function(e) {
                e.preventDefault();
                $('.discovery-section').hide();
                $('.discovery-section-4').fadeIn();
            },
            submitQuestions: function(e) {
                e.preventDefault();
                var section1weights = [],
                    section2weights = [],
                    section3weights = [],
                    section4weights = [],
                    section1weight = null,
                    section2weight = null,
                    section3weight = null,
                    section4weight = null;

                $('.submit-discovery').html('<i class="fa fa-spinner fa-spin"></i>');
                $('.submit-discovery').attr('disabled', 'disabled');
                $('.discovery-section-1').find('select').each(function() {
                    section1weight += parseInt($(this).find(':selected').data('weight'));
                    
                });
                $('.discovery-section-2').find('select').each(function() {
                    section2weight += parseInt($(this).find(':selected').data('weight'));
                   
                });
                $('.discovery-section-3').find('select').each(function() {
                    section3weight += parseInt($(this).find(':selected').data('weight'));
                    
                });
                $('.discovery-section-4').find('select').each(function() {
                    section4weight += parseInt($(this).find(':selected').data('weight'));
                    
                });
                var section1id = $('.getsection1').data('sectionid');
                var section2id = $('.getsection2').data('sectionid');
                var section3id = $('.getsection3').data('sectionid');
                var section4id = $('.getsection4').data('sectionid');
                var section1Result = Mansard.api.discovery_results({sectionId: section1id, sectionScore: section1weight});
                var section2Result = Mansard.api.discovery_results({sectionId: section2id, sectionScore: section2weight});
                var section3Result = Mansard.api.discovery_results({sectionId: section3id, sectionScore: section3weight});
                var section4Result = Mansard.api.discovery_results({sectionId: section4id, sectionScore: section4weight});

                $('.discovery-section-4').hide();
                $('.results-section').fadeIn();

                $('.section1-results-section .observations').html(section1Result.Observations);
                $('.section1-results-section .reccomendations').html(section1Result.Recommendations);

                $('.section2-results-section .observations').html(section2Result.Observations);
                $('.section2-results-section .reccomendations').html(section2Result.Recommendations);

                $('.section3-results-section .observations').html(section3Result.Observations);
                $('.section3-results-section .reccomendations').html(section3Result.Recommendations);

                $('.section4-results-section .observations').html(section4Result.Observations);
                $('.section4-results-section .reccomendations').html(section4Result.Recommendations);
            }
        });
    });