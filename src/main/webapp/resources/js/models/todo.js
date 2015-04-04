/**
 * 
 */

var app= {} || app;

//todo model

app.Todo= Backbone.Model.extend({

	defaults:{
		title:'',
		completed:false
	},
	//toggle the completed state of todo
	
	toggle:function(){
		this.save({
			completed:!this.get('completed')
		})
	}
	
});
