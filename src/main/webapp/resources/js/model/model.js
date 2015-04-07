var app= app || {};

	app.Task=Backbone.Model.extend({
		urlRoot:'todo',
		defaults:{
			id: null,
			taskTitle:'',
			completed:false
		},
		idAttribute: "id",
		iniialize:function(){

		},
		validate:function(attr){
			if(!$.trim(attr.taskTitle)){
				return "Task title required";
			}
		},
	});


	app.Tasks= Backbone.Collection.extend({
		model:app.Task,
		url:'todo/list'
	});

	app.CountModel=Backbone.Model.extend({
		defaults:{
			total:'',
			complete:'',
			incomplete:''
		}
	});