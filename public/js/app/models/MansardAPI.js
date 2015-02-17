/*
    MansardAPI
    - Does all API calls and returns JSON objects for use
*/
define([
    "jquery",
    "underscore",
    "backbone",
    "views/SearchResultView"
    ],
    function(
    $,
    _,
    Backbone,
    SearchResultView
    ){
    // Creates a new Backbone Model class object
    var MansardAPI = Backbone.Model.extend({

        initialize: function() {
            _.bindAll(this);

        },
        login: function (credentials) {    
            var self = this;
            $('.login-button').html('<i class="fa fa-spinner fa-spin"></i>');
            $('.login-button').attr('disabled', 'disabled');
            $.ajax({
                url: 'https://online.mansardinsurance.com/MansardSalesWebApi/api/MobileLogin/atu?CustomerNo=0&passcode=0&Username=' + credentials.username + '&Password=' + credentials.password,
                type: 'POST',
                success: function (rData) {
                    if (rData.username && rData.isFirstTimeLogin) {
                        $('.login-form-form').hide();
                        $('.login-agent-code').show();
                    } else if (rData.username && !rData.isFirstTimeLogin) {
                        self.isFA(rData.AgentCode, rData.username);
                    }
                    else {
                        
                        $('.login-error').html('<div class="alert alert-warning" role="alert">Incorrect Username and/or Password!</div>');
                        $('.login-button').html('Login');
                        $('.login-button').removeAttr('disabled');
                    }
                }
            });
        },
        logout: function() {
            localStorage.removeItem('session');
            window.location.hash = '';
            Mansard.isLoggedIn = false;
        },
        search: function(query) {
            var self = this;
            var results = [];
            var theUrl = null;
            $('.search-results-container').html('<div class="search-load"><i class="fa fa-spinner fa-spin"></i> Searching...</div>');
            $('.results-num').html('-');
            if (Mansard.isFA) {
                theUrl1 = 'https://online.mansardinsurance.com/MansardSalesWebApi/api/Contacts/getContactByName?contactname=' + query;
                theUrl2 = 'https://online.mansardinsurance.com/MansardSalesWebApi/api/Customer/Post_GetCustomerByName/' + query;
                $.ajax({
                    url: theUrl1,
                    success: function (rData1) {
                        for (var i = 0; i < rData1.length; i++) {
                            rData1[i].type = 'contact';
                        }
                        results.push(rData1);
                        $.ajax({
                            url: theUrl2,
                            success: function (rData2) {
                                for (var i = 0; i < rData2.length; i++) {
                                    rData2[i].type = 'customer';
                                }
                                results.push(rData2);
                                results = $.merge( results[0], results[1]);
                                console.log(results);
                               for (var i = 0; i < results.length; i++) {
                                    var search_result = results[i];
                                    var result = new SearchResultView({result: search_result});
                                    self.renderResult(result,results.length);

                                }
                                $('.results-num').html(results.length);
                            }
                        });
                    }
                });
            } else {
                theUrl = 'https://online.mansardinsurance.com/MansardSalesWebApi/api/Customer/Post_GetCustomerByName/' + query;
                $.ajax({
                    url: theUrl,
                    success: function (rData) {
                       for (var i = 0; i < rData.length; i++) {
                            var search_result = rData[i];
                            var result = new SearchResultView({result: search_result});
                            self.renderResult(result,rData.length);

                        }
                        $('.results-num').html(rData.length);
                    }
                });
            }
            
        },
        isFA: function(agent_code, username) {
            var self = this;
            $.ajax({
                    url: 'https://online.mansardinsurance.com/MansardSalesWebApi/api/Agent/Get?agentCode=' + agent_code +'&username=' + username,
                    type: 'GET',
                    success: function (rData) {
                     if (rData.NeedsSalesDiary) {
                        rData.username = username;
                        self.session(JSON.stringify(rData));
                        Mansard.appRouter.navigate('dashboard', {trigger: true});
                        location.reload();
                     } else {
                        rData.username = username;
                        self.session(JSON.stringify(rData));
                        Mansard.appRouter.navigate('products', {trigger: true});
                        location.reload();
                     }
                }
            });
        },
        quote: function(type, data) {
            var url = null;
            var send = null;
            if (type === 'motor') {
                url = 'https://online.mansardinsurance.com/MansardSalesWebApi/api/Quote/jComputePremium_Motor';
            } else if (type === 'life') {
                url = 'https://online.mansardinsurance.com/MansardSalesWebApi/api/Riders/Post_GetLifeRiders';
            }

            $.ajax({
                    url: url,
                    type: 'POST',
                    data: data,
                    async: false,
                    success: function (rData) {
                        send = rData;
                }
            });

            return send;
        },
        products: function(type) {
            var url = null;
            var send = null;
            if (type === 'motor') {
                url = 'https://online.mansardinsurance.com/MansardSalesWebApi/api/Products/GetProducts_Motor';
            } else if (type === 'life') {
                url = 'https://online.mansardinsurance.com/MansardSalesWebApi/api/Products/GetProducts_Life';
            }

            $.ajax({
                url: url,
                type: 'GET',
                async: false,
                success: function (rData) {
                   send = rData;
                }
            });

            return send;
        },
        save_contact: function(data, save) {
            $.ajax({
                url: 'https://online.mansardinsurance.com/MansardSalesWebApi/api/Contacts/Post_SaveContactInfo',
                type: 'post',
                data: data,
                success: function(res) {
                    if (save) {
                        $('.contact-add-form')[0].reset();
                        $('.submit-contact-button').removeAttr('disabled');
                        $('.submit-contact-button').html('Save Contact');
                        $('.contact-message').html(res.Message);
                    }
            }

            });
        },
        customer: function(credentials) {
            var send = null;
            $.ajax({
                url: 'https://online.mansardinsurance.com/MansardSalesWebApi/api/Customer/getCustomerPolicies?customerNo=' + credentials.customerNo +'&email=' + credentials.email,
                async: false,
                success: function(rData) {
                   send = rData;
                }
            });

            return send;
        },
        session: function(agent) {
            var token = 'MA_' + this.generateToken(70);
            var current_session = {agent: JSON.stringify(agent), session_token: token};
            localStorage.setItem('session', JSON.stringify(current_session));
        },
        token: function() {
            var chars = "0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";
            return chars.substr( this.getRandomNumber(62), 1 );
        },
        getRandomNumber: function(range) {
            return Math.floor(Math.random() * range);
        },
        generateToken: function(size)
        {
            var str = "";
            for(var i = 0; i < size; i++)
            {
                str += this.token();
            }
            return str;
        },
        discovery_quesions: function() {
            var send = null;

             $.ajax({
                url: 'https://online.mansardinsurance.com/MansardSalesWebApi/api/Discovery/Post_GetAllDiscoveryInterviewQuestions',
                type: 'POST',
                async: false,
                success: function(res){
                    send = res;
                }
            });

             return send;
        },
        discovery_options: function(id) {
            var send = null;
            $.ajax({
                url: 'https://online.mansardinsurance.com/MansardSalesWebApi/api/Discovery/Post_GetOptions?questionID=' + id,
                type: 'POST',
                async: false,
                success: function(res){
                    send = res;
                }
            });
            return send;
        },
        discovery_results: function(data) {
            var send = null;

            $.ajax({
                url: 'https://online.mansardinsurance.com/MansardSalesWebApi/api/Discovery/Post_GetInferenceBySectionScoreAndSectionID?sectionId=' + data.sectionId + '&sectionScore=' + data.sectionScore,
                type: 'POST',
                async: false,
                success: function(res){
                   send = res;
                }
            });

            return send;
        },
        renderResult: function(result) {
           $('.search-results-container').prepend(result.render().el);
        },
        kyc_dropdowns: function(type) {
            var send = null;
            var url_ext = null;

            if (type === 'business') {
                url_ext = 'getBusinessType';
            } else  if (type === 'transaction') {
                url_ext = 'getTransactionStatus';
            } else  if (type === 'religion') {
                url_ext = 'getReligion';
            } else  if (type === 'job') {
                url_ext = 'GetJobTitles';
            } else  if (type === 'employ') {
                url_ext = 'GetEmploymentTypes';
            } else  if (type === 'profession') {
                url_ext = 'GetProfession';
            } else  if (type === 'salary') {
                url_ext = 'getAnnualSalary';
            }

            $.ajax({
                url: 'https://online.mansardinsurance.com/MansardSalesWebApi/api/Shared/' + url_ext,
                type: 'GET',
                async: false,
                success: function(res){
                    send = res;
                }
            });

            return send;
        },
        kyc: function(data) {
            $('.submit-ind').html('<i class="fa fa-spinner fa-spin"></i>');
            $('.submit-ind').attr('disabled', 'disabled');
            $('.submit-corp').html('<i class="fa fa-spinner fa-spin"></i>');
            $('.submit-corp').attr('disabled', 'disabled');
            $.ajax({
                url: 'https://online.mansardinsurance.com/MansardSalesWebApi/api/KYC/Post_SaveKycInfo',
                type: 'POST',
                data: data,
                success: function(res){
                    $('.submit-ind').html('Submit');
                    $('.submit-ind').removeAttr('disabled');
                    $('.submit-corp').html('Submit');
                    $('.submit-corp').removeAttr('disabled');
                    if(res.IsSuccessful) {
                        $('.status-kyc').html('KYC Submitted Successfully!');
                    } else {
                        $('.status-kyc').html('An Error Occured, Please Try again!');
                    }
                }
            });
        },
        save_policy: function(booking_type, booking) {
            var url = null;

            if (booking_type === 'motor') {
                url = 'https://online.mansardinsurance.com/MansardSalesWebApi/api/Motor/PostMotor';
            } else if (booking_type === 'life') {
                url = '';
            }

            $.ajax({
                url: url,
                type: 'POST',
                data: booking,
                success: function(res){
                    console.log(res);
                }
            });
        },
        policy_dropdowns: function(type, productCode) {
            var send = null;
            var url = null;
            var url_join = null;

            if (type === 'plates') {
                url = 'https://online.mansardinsurance.com/MansardSalesWebApi/api/Motor/GetVehiclePlateColours';
            } else  if (type === 'uses') {
                url = 'https://online.mansardinsurance.com/MansardSalesWebApi/api/Motor/GetVehicleUses';
            } else  if (type === 'places') {
                url = 'https://online.mansardinsurance.com/MansardSalesWebApi/api/Motor/GetVehicleRegPlaces';
            } else  if (type === 'manYear') {
                url = 'https://online.mansardinsurance.com/MansardSalesWebApi/api/shared/GetVehicleManufacturinYear';
            } else if (type === 'payFreq') {
                url = 'https://online.mansardinsurance.com/MansardSalesWebApi/api/shared/getPaymentFrequencies';
            } else if (type === 'insPeriod') {
                url_join = 'https://online.mansardinsurance.com/MansardSalesWebApi/api/Shared/GetInsurancePeriod/?productCode=' + productCode;
                url = url_join;
            } else if (type === 'payPeriod') {
                url_join = 'https://online.mansardinsurance.com/MansardSalesWebApi/api/Shared/GetPaymentPeriod/?productCode=' + productCode;
                url = url_join;
            }

            $.ajax({
                url: url,
                type: 'GET',
                async: false,
                success: function(res){
                    send = res;
                }
            });

            return send;
        },
        convert: function(contact) {
            var send = null;

            $.ajax({
                url: 'https://online.mansardinsurance.com/MansardSalesWebApi/api/Contacts/Post_ConvertToLead',
                data: contact,
                type: 'POST',
                async: false,
                success: function(res) {
                    send = res;
                }

            });

            return send;
        },
        sectors: function(type) {
            var send = null;
            var url = null;

            if (type === 'main') {
                url = 'https://online.mansardinsurance.com/MansardSalesWebApi/api/ESMS/GetAllSectors';
            } else if (type === 'sub') {
                url = 'https://online.mansardinsurance.com/MansardSalesWebApi/api/ESMS/GetAllSubSectors';
            }

            $.ajax({
                url: url,
                type: 'GET',
                async: false,
                success: function (rData) {
                    send = rData;
                }
            });

            return send;
        },
        sectorChange: function(data) {
            var send = null;
            $.ajax({
                url: 'https://online.mansardinsurance.com/MansardSalesWebApi/api/ESMS/Post_CheckIfSectorHasChanged?sectorId=' + data.sectorId + '&mCustRowID=' + data.mCustRowID,
                type: 'POST',
                async: false,
                success: function(res) {
                    send = res;
                    console.log(send);
                }
            });
            return send;
        },
        parseQueryString: function(queryString) {
            var params = {};
            if(queryString){
                _.each(
                    _.map(decodeURI(queryString).split(/&/g),function(el,i){
                        var aux = el.split('='), o = {};
                        if(aux.length >= 1){
                            var val = null;
                            if(aux.length == 2)
                                val = aux[1];
                            o[aux[0]] = val;
                        }
                        return o;
                    }),
                    function(o){
                        _.extend(params,o);
                    }
                );
            }
            return params;
        },
        esms: function(sectionID) {
            var send = null;
            $.ajax({
                url: 'https://online.mansardinsurance.com/MansardSalesWebApi/api/ESMS/GetSectionQuestions?sectionID=' + sectionID + '&isCorporate=True',
                type: 'GET',
                async: false,
                success: function(res) {
                    send = res;
                }
            });

            return send;
        },
        dashboard: function(agentCode) {
            var send = {};

            $.ajax({
                url: 'https://online.mansardinsurance.com/MansardSalesWebApi/api/Agent/GetTotalLifePremiumPaid?agentCode=' + agentCode,
                type: 'GET',
                async: false,
                success: function(res) {
                    send.life = res;
                }
            });

            $.ajax({
                url: 'https://online.mansardinsurance.com/MansardSalesWebApi/api/Agent/GetTotalNonLifePremiumPaid?agentCode=' + agentCode,
                type: 'GET',
                async: false,
                success: function(res) {
                    send.nonlife = res;
                }

            });

            $.ajax({
                url: 'https://online.mansardinsurance.com/MansardSalesWebApi/api/Agent/GetTotalClaimsPaid?agentCode=' + agentCode,
                type: 'GET',
                async: false,
                success: function(res) {
                    send.claims = res;
                }

            });

            return send;
            
        },
        digits: function(number) {
            return number.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"); 
        }
    });

    // Returns the Model class
    return  MansardAPI;

}

);
