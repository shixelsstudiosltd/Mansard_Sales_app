define(["Mansard","backbone","marionette","jquery","models/Model","hbs!templates/searchResult","views/QuickResultView"],function(t,e,s,$,i,l,r){return e.Marionette.ItemView.extend({template:l,model:null,result:null,quickResult:null,tempProduct:null,total:null,events:{"click .quick-open":"showQuickResult","click .quick-add":"addToCart"},initialize:function(t){if(this.result=t.result,t.type){var e=this.result.FirstName+" "+this.result.LastName,s=this.result.Email,l=s.substring(0,20),r=e.substring(0,12),a=this.result.Fullname,u=this.result.email,n=r+"[..]",d=l+"[..]";this.result.Fullname=n}else{var e=this.result.Fullname,s=this.result.email,l=s.substring(0,20),r=e.substring(0,12),a=this.result.Fullname,u=this.result.email,n=r+"[..]",d=l+"[..]";this.result.Fullname=n}(this.result.email||this.result.Email)&&(this.result.email=d),this.result.searchButton=window.Mansard.tempProduct?'<div class="search-result-button"><a href="#" class="btn btn-primary quick-add" data-user="1">Add</a></div>':'<div class="search-result-button"><a href="#" class="btn btn-primary quick-open" data-user="1">Open</a></div>',this.result.keepEmail=u,this.result.keepFullName=a,this.model=new i({result:this.result})},onRender:function(){this.$el=this.$el.children(),this.setElement(this.$el)},showQuickResult:function(t){t.preventDefault(),this.quickResult=this.result;var e=new r({quickResult:this.quickResult});this.renderQuickResult(e)},renderQuickResult:function(t){var e=".search-quick-result-container";$(e).html(t.render().el)},addToCart:function(t){t.preventDefault(),window.Mansard.tempProduct.customer=this.result.CustomerNo,window.Mansard.cart.add(window.Mansard.tempProduct);for(var e=0;e<window.Mansard.cart.items.length;e++)window.Mansard.cart.items[e].pos=e,window.Mansard.cart.total+=window.Mansard.cart.items[e].price.replace(/\D/g,"");this.total&&(this.total=this.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")),$(".mini-card-total-holder").html(this.total),$(".cart-num").html(window.Mansard.cart.count())}})});