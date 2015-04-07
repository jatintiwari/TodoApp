var app= app||{};
(function(){
	window.router= new app.TaskRouter();
	Backbone.history.start();
})();