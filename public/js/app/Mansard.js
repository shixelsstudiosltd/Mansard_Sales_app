define([
    'jquery', 
    'backbone', 
    'marionette', 
    'underscore', 
    'handlebars',
    'models/MansardAPI',
    'models/MansardCart'
    ],
    function (
    $, 
    Backbone, 
    Marionette, 
    _, 
    Handlebars,
    MansardAPI,
    MansardCart
    ){
        var Mansard = window.Mansard = new Backbone.Marionette.Application();

        function isMobile() {
            var userAgent = navigator.userAgent || navigator.vendor || window.opera;
            return ((/iPhone|iPod|iPad|Android|BlackBerry|Opera Mini|IEMobile/).test(userAgent));
        }

        function checkFA(agent_code, username) {
            var send = null;
            $.ajax({
                    url: 'https://online.mansardinsurance.com/MansardSalesWebApi/api/Agent/Get?agentCode=' + agent_code +'&username=' + username,
                    type: 'GET',
                    async: false,
                    success: function (rData) {
                     if (rData.NeedsSalesDiary) {
                        send = true;
                     } else {
                        send = false;
                     }
                }
            });

            return send;
        }

        Mansard.api = new MansardAPI();
        Mansard.cart = new MansardCart();
        Mansard.discovery_questions = Mansard.api.discovery_quesions();   
        Mansard.tempProduct = false; //temporary product to add to a customer
        Mansard.env = "dev";
        Mansard.customer = null;
        Mansard.cart.current = 0;
        Mansard.tempPolicy = null;
        Mansard.discovery = null;
        if (Mansard.cart.count() > 0) {
            Mansard.cart.last = Mansard.cart.count() - 1;
        } else {
            Mansard.cart.last = 0
        }
        

        
        if (localStorage.getItem("session") === null) {
            Mansard.isLoggedIn = false;
            Mansard.currentUser = null;
            Mansard.currentUser_SubAgentCode = null;
        } else {
            Mansard.isLoggedIn = true;
            Mansard.current = JSON.parse(JSON.parse(JSON.parse(localStorage.getItem("session")).agent));
            Mansard.isFA = checkFA(Mansard.current.AgentCode, Mansard.current.username);
            Mansard.currentUser = JSON.parse(JSON.parse(JSON.parse(localStorage.getItem("session")).agent)).username;
            Mansard.currentUser_SubAgentCode = null;
        }


        //Organize Application into regions corresponding to DOM elements
        //Regions can contain views, Layouts, or subregions nested as necessary
        Mansard.addRegions({
            headerRegion:"#header-container",
            profileRegion:"#user-profile-container",
            mainAppRegion:"#right-area-container",
            fullAppRegion: "#page",
            navRegion: "#main-nav-container"
        });

        Mansard.addInitializer(function () {
            Backbone.history.start();
        });

        Mansard.mobile = isMobile();

        return Mansard;
    });