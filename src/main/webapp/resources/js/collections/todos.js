/**
 * 
 */

//todo collection

var app= app|| {};


//collection is backed by localstorage instead of server.

var TodoList= Backbone.Collection.extend({
	model:app.Todo,
	
	localStorage: new Backbone.LocalStorage('todos-backbone'),
	
	//filter down the list of all todo items that are finished.
	completed:function(){
		return this.filter(function(){
			return todo.get('completed');
		});
	},
	
	//filter down the list of items that still not finished.
	remaining:function(){
		return this.without.apply(this,this.completed());
	},
	
	
	//todo are placed in sequential order, this generates next order no. for the new ones.
	nextOrder:function(todo){
		if(!this.length){
			return 1;
		}
		return this.last().get('order')+ 1;
	},
	
	//todos  are sorted by thier natural insertion order
	comparator: function(todo){
		return todo.get('order');
	}
});

