define(["jquery","backbone","marionette","underscore","handlebars","models/MansardAPI","models/MansardCart"],function($,e,n,r,a,t,o){function i(){var e=navigator.userAgent||navigator.vendor||window.opera;return/iPhone|iPod|iPad|Android|BlackBerry|Opera Mini|IEMobile/.test(e)}function s(e,n){var r=null;return $.ajax({url:"https://online.mansardinsurance.com/MansardSalesWebApi/api/Agent/Get?agentCode="+e+"&username="+n,type:"GET",async:!1,success:function(e){r=e.NeedsSalesDiary?!0:!1}}),r}var c=window.Mansard=new e.Marionette.Application;return c.api=new t,c.cart=new o,c.cart.items=[],c.discovery_questions=c.api.discovery_quesions(),c.tempProduct=!1,c.env="dev",c.customer=null,c.cart.current=0,c.tempPolicy=null,c.discovery=null,c.cart.last=c.cart.count()>0?c.cart.count()-1:0,null===localStorage.getItem("session")?(c.isLoggedIn=!1,c.currentUser=null,c.currentUser_SubAgentCode=null):(c.isLoggedIn=!0,c.current=JSON.parse(JSON.parse(JSON.parse(localStorage.getItem("session")).agent)),c.isFA=s(c.current.AgentCode,c.current.username),c.currentUser=JSON.parse(JSON.parse(JSON.parse(localStorage.getItem("session")).agent)).username,c.currentUser_SubAgentCode=null),c.addRegions({headerRegion:"#header-container",profileRegion:"#user-profile-container",mainAppRegion:"#right-area-container",fullAppRegion:"#page",navRegion:"#main-nav-container"}),c.addInitializer(function(){e.history.start()}),c.mobile=i(),c});