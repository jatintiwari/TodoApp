(function(){
	window.App={
			Model:{},
			View:{},
			Collection:{},
			Router:{}
	};
	window.template=function(id){
		return _.template($('#'+id).html());
	};
	

	//define a model: 1. set defaults 2. validations
	App.Model.Task=Backbone.Model.extend({
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

		},
	});
	//define a view for the model
	//define the edit and delete methods
	App.View.TaskView= Backbone.View.extend({
		tagName:'li',
		template:template('templateView'),
		initialize:function(){
			this.model.on('destroy',this.remove,this);
			this.model.on('change',this.render,this);
		},
		events:{
			'click .edit':'editEvent',
			'click .delete':'destroy'
		},
		destroy:function(){
			console.log("destroy");
			this.model.destroy();
		},
		remove:function(){
			this.$el.remove();
		},
		editEvent:function(){
			app.navigate('edit',false);
		},
		render:function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
	});



	//define a collection of that model 1. initialize the events 2. seperate the render and adding method

	App.Collection.Tasks= Backbone.Collection.extend({
		model:App.Model.Task,
		url:'todo/list'
	});

	App.View.TasksView= Backbone.View.extend({
		tagName:'ul',
		initialize:function(){
			this.collection.on('add',this.addOne,this);
		},
		render:function(){
			this.$el.empty();
			this.collection.each(this.addOne,this);
			return this;
		},
		addOne:function(task){
			var taskView= new App.View.TaskView({model:task})
			this.$el.append(taskView.render().el);
		}
	});
	//define the add event for the collections and render the event in template
	App.View.AddOne= Backbone.View.extend({
		el:'#addTask',

		events:{
			'submit':'submit'
		},
		submit:function(e){
			e.preventDefault();
			var addNewTitle= $('#taskTitle').val();
			var id= this.model.get('id');
			var completed= $('input[name="completed"]:checked').length>0;
			console.log(completed);
			var addNewModel= new App.Model.Task({
				id:id,
				taskTitle:addNewTitle,
			});
			if(completed){
				addNewModel.set('completed',true)
			}
			addNewModel.save();
			setTimeout(function(){
				app.navigate('',true);
				console.log('added');
			},100);
		}
	});
	
	App.Model.CountModel=Backbone.Model.extend({
		defaults:{
			total:'',
			complete:'',
			incomplete:''
		}
	});
	
	App.View.CountView= Backbone.View.extend({
		el:'.count',
		template:template('countTemplateView'),
		initialize:function(){
			var total=this.collection.length;
			var complete=this.collection.where({completed:true}).length;
			var incomplete=total-complete;
			var countModel= new App.Model.CountModel({
				complete:complete,
				incomplete:incomplete
			});
			console.log(countModel.toJSON());
			this.$el.html(this.template(countModel.attributes));
		},
	});
	
	
	window.tasks= new App.Collection.Tasks();
	var tasksView= new App.View.TasksView({collection:tasks});
	
	
	App.Router.Tasks=Backbone.Router.extend({
		routes:{
			'':'list',
			'add':'add',
			'edit/:id':'edit'
		},
		
		list:function(){
			$('.addFormDisplay').empty();
			tasks.fetch({
				success:function(){
					$('.tasks').html(tasksView.render().el);
					setTimeout(function(){
						var countView= new App.View.CountView({collection:tasks});
					},50);
				}
			});
			
		},
		add:function(){
			console.log('this is a add function');
			$('.addFormDisplay').html(_.template($('#addFormTemplate').html(),{task:new App.Model.Task}));
			if(tasks.isEmpty){
				tasks.fetch();
			}
			$('.tasks').html(tasksView.render().el);
			var addNewTaskView= new App.View.AddOne({model:new App.Model.Task});	
		},
		edit:function(id){
			console.log('this is a edit function for model id ' +id);
			$('.tasks').html(tasksView.render().el);
			this.getTask=tasks.get(id);
			console.log(this.getTask.toJSON());
			$('.addFormDisplay').html(_.template($('#addFormTemplate').html(),{task:this.getTask.toJSON()}));
			var addNewTaskView= new App.View.AddOne({model:this.getTask});
		}
	});

	var app= new App.Router.Tasks({pushState:true});
	Backbone.history.start();
})();