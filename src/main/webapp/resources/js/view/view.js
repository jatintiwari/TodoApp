var app= app || {};

	app.TaskView= Backbone.View.extend({
		tagName:'tr',
		template:_.template($('#templateView').html()),
		events:{
			'dblclick .edit':'edit',
			'click .edit':'display'
		},
		edit:function(){
			console.log('edit');
			router.navigate('list/'+this.model.id+'/edit',true);
		},
		display:function(){
			console.log('display');
			router.navigate('list/'+this.model.id,true);
		},
		initialize:function(){
			window.tasks= new app.Tasks();
			this.tasksView = new app.TasksView({collection:tasks});
		},
		initialize:function(){
			this.model.on('change',this.render,this);
		},
		render:function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
	});


		app.TasksView= Backbone.View.extend({
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
			var taskView= new app.TaskView({model:task})
			this.$el.append(taskView.render().el);
		}
	});
	

	app.AddOne= Backbone.View.extend({
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
				router.navigate('',true);
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
						router.navigate('',true);
						console.log('added');
					},100);
			    },
			});
		}
	});
	
	
	app.CountView= Backbone.View.extend({
		el:'.count',
		events:{
			'click .complete':'complete',
				'click .incomplete':'incomplete'
		},
		template:_.template($('#countTemplateView').html()),
		self:this,
		initialize:function(){
			var total=this.collection.length;
			self.completeModels=this.collection.where({completed:true});
			var completeCount=completeModels.length;
			var incompleteCount=total-completeCount;
			this.countModel= new app.CountModel({
				complete:completeCount,
				incomplete:incompleteCount
			});
			this.render(this.countModel);
		},
		render:function(countModel){
			this.$el.html(this.template(countModel.attributes));
		},
		complete:function(){
			console.log("Complete");
			$('#listLabel').html("<h4>Tasks: Completed</h4>")
			$('.addFormDisplay').html('');
			this.completeCollection= new app.Tasks();
			_.each(self.completeModels,function(task){
				this.completeCollection.add(task);
			},this);
		this.tasksView= new app.TasksView({collection:this.completeCollection});
		$('.tasks').html(this.tasksView.render().el);
		},
		incomplete:function(){
			console.log("Incomplete");
			$('#listLabel').html("<h4>Tasks: Incomplete</h4>")
			$('.addFormDisplay').empty();
			this.inCompleteCollection= new app.Tasks();
			this.incomplete=this.collection.where({completed:false});
			_.each(this.incomplete,function(task){
				this.inCompleteCollection.add(task);
			},this);
		this.tasksView= new app.TasksView({collection:this.inCompleteCollection});
		$('.tasks').html(this.tasksView.render().el);
		},
	});