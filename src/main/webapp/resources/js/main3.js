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
			if(!$.trim(attr.taskTitle)){
				return "Task title required";
			}
		},
	});
	//define a view for the model
	//define the edit and delete methods
	App.View.TaskView= Backbone.View.extend({
		tagName:'tr',
		template:template('templateView'),
		initialize:function(){
			this.model.on('change',this.render,this);
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
		tagName:'td',
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
		initialize:function(){
			this.model.on('destroy',this.remove,this);
			this.model.on('invalid',function(model,error){
				this.invalid(model,error);
			},this);
		},
		events:{
			'submit':'submit',
			'click .delete':'destroy',
		},
		invalid:function(model,error){
			$('.error').html(error);
		},
		destroy:function(){
			this.model.destroy();
		},
		remove:function(){
			this.$el.remove();
			setTimeout(function(){
				app.navigate('',true);
			},30);
		},
		submit:function(e){
			e.preventDefault();
			var addNewTitle= $('#taskTitle').val();
			var completed= $('input[name="completed"]:checked').length>0;
			this.model.set('completed',completed);
			this.model.save({taskTitle:addNewTitle}, {
			    success: function (model, response) {
			    	setTimeout(function(){
						app.navigate('',true);
						console.log('added');
					},100);
			    },
			});
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
		events:{
			'click .complete':'complete',
				'click .incomplete':'incomplete'
		},
		template:template('countTemplateView'),
		self:this,
		initialize:function(){
			var total=this.collection.length;
			self.completeModels=this.collection.where({completed:true});
			var completeCount=completeModels.length;
			var incompleteCount=total-completeCount;
			self.countModel= new App.Model.CountModel({
				complete:completeCount,
				incomplete:incompleteCount
			});
			//this.complete(completeModels);
			this.render(self.countModel);
		},
		render:function(countModel){
			this.$el.html(this.template(countModel.attributes));
		},
		complete:function(){
			console.log("Complete");
			$('#listLabel').html("<h4>Tasks: Completed</h4>")
			$('.addFormDisplay').html('');
			this.completeCollection= new App.Collection.Tasks();
			_.each(self.completeModels,function(task){
				this.completeCollection.add(task);
			},this);
		this.tasksView= new App.View.TasksView({collection:this.completeCollection});
		$('.tasks').html(this.tasksView.render().el);
		},
		incomplete:function(){
			console.log("Incomplete");
			$('#listLabel').html("<h4>Tasks: Incomplete</h4>")
			$('.addFormDisplay').html('');
			this.inCompleteCollection= new App.Collection.Tasks();
			this.incomplete=this.collection.where({completed:false});
			_.each(this.incomplete,function(task){
				this.inCompleteCollection.add(task);
			},this);
		this.tasksView= new App.View.TasksView({collection:this.inCompleteCollection});
		$('.tasks').html(this.tasksView.render().el);
		},
	});

	App.Router.Tasks=Backbone.Router.extend({
		routes:{
			'':'list',
			'add/:id':'add',
		},
		initialize:function(){
			this.tasks= new App.Collection.Tasks();
			this.tasksView= new App.View.TasksView({collection:this.tasks});
		},

		list:function(){
			var _this=this;
			$('.addFormDisplay').empty();
			$('#listLabel').html("<h4>Tasks: All</h4>")
			this.tasks.fetch({
				success:function(){
					var self=_this;
					$('.tasks').html(_this.tasksView.render().el);
					setTimeout(function(){
						var countView= new App.View.CountView({collection:self.tasks});
					},50);
				}
			});

		},
		add:function(id){
			console.log('this is a add function');
			if(id!=='new'){
				console.log(id);
				var getTask=this.tasks.get(id);
				if(!getTask){
					$('.addFormDisplay').html('<div class="alert alert-danger" role="alert">No Task</div>');
					return;
				}
				$('.addFormDisplay').html(_.template($('#addFormTemplate').html(),{task:getTask.toJSON()}));
				this.addNewTaskView= new App.View.AddOne({model:getTask});
			}else{
				$('.addFormDisplay').html(_.template($('#addFormTemplate').html(),{task:new App.Model.Task}));
				this.addNewTaskView= new App.View.AddOne({model:new App.Model.Task});	
			}
			this.tasks.fetch();
			$('.tasks').html(this.tasksView.render().el);
		},
	});

	var app= new App.Router.Tasks();
	Backbone.history.start();
})();