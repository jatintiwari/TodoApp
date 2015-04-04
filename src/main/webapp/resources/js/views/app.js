/**
 * 
 */
var app= {}||app;
var ENTER_KEY=13;

$(function(){
	new app.AppView();
});

app.Todos= new TodoList();
app.AppView= Backbone.View.extend({
	//binds the existing skeleton to the view.
	el:'#todoapp',

	statsTemplate:_.template($('#stats-template').html()),

	events:{
		'keypress #new-todo':'createOnEnter',
		'click #clear-completed':'clearCompleted',
		'click #toggle-all':'toggleAllComplete'
	},

	//at initialization we bind these events to 'todos' collection, when items are added or changed.
	initialize:function(){
		this.allCheckbox=this.$('toggle-all')[0];
		this.$input=this.$('#new-todo');
		this.$footer= this.$('#footer');
		this.$main=this.$('#main');


		this.listenTo(app.Todos,'add',this.addOne);
		this.listenTo(app.Todos,'reset',this.addAll);

		this.listenTo(app.Todos,'change:completed',this.filterOne);
		this.listenTo(app.Todos,'filter',this.filterAll);
		this.listenTo(app.Todos,'all',this.render);

		app.Todos.fetch();
	},

	render:function(){
		var completed = app.Todos.completed().length;
		var remaining = app.Todos.remaining().length;
		//main and footer sections are displayed depending on whether there are any todos in the collection
		if(app.Todos.length){
			this.$main.show();
			this.$footer.show();
			//footer is populated by html compiling the statsTemplate with no. of completed and remaing items		
			this.$footer.html(this.statsTemplate({
				completed:completed,
				remaining:remaining
			}));
			this.$('#filter li a')
			.removeClass('selected')
			.filter('[href="#/'+(app.TodoFilter || '')+'"]')
			.addClass('selected');
		}else{
			this.$main.hide();
			this.$footer.hide();
		}
		//  this.allCheckbox.checked = !remaining;
	},

	//add a single todo item to the list by creating a view for it and appending it to the list '<ul>'
	addOne:function(todo){
		var todoView= new app.TodoView({model:todo});
		$('#todo-list').append(todoView.render().el);
	},
	//add all items in the todo collection at once
	addAll:function(){
		this.$('#todo-list').html('');
		app.Todos.each(this.addOne,this);
	},
	filterOne:function(todo){
		todo.trigger('visible');
	},
	filterAll:function(){
		app.Todos.each(this.filterOne,this);
	},
	newAttributes:function(){
		return {
			title:this.$input.val().trim(),
			order:app.Todos.nextOrder(),
			completed:false
		};
	},

	createOnEnter:function(event){
		if(event.which !== ENTER_KEY || this.$input.val().trim()){
			return;
		}

		app.Todos.create(this.newAttributes());
		this.input.val('');
	},
	clearCompleted:function(){
		_.invoke(app.Todos.completed(),'destroy');
		return false;
	},
	toggleAllComplete:function(){
		var completed= this.allCheckbox.checked;
		app.Todos.each(function(todo){
			todo.save({
				'completed':completed
			});
		});
	}
});