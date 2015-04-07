var app= app||{};


app.TaskRouter=Backbone.Router.extend({
		routes:{
			'':'list',
			'add/:id':'add',
		},
		initialize:function(){
			window.tasks= new app.Tasks();
			this.tasksView = new app.TasksView({collection:tasks});
		},

		list:function(){
			var _this=this;
			$('.addFormDisplay').empty();
			$('#listLabel').html("<h4>Tasks: All</h4>")
			tasks.fetch({
				success:function(){
					$('.tasks').html(_this.tasksView.render().el);
					setTimeout(function(){
						this.countView= new app.CountView({collection:tasks});
					},50);
				}
			});

		},
		add:function(id){
			console.log('this is a add function');
			if(id!=='new'){
				console.log(id);
				var getTask=tasks.get(id);
				if(!getTask){
					$('.addFormDisplay').html('<div class="alert alert-danger" role="alert">No Task</div>');
					return;
				}
				$('.addFormDisplay').html(_.template($('#addFormTemplate').html(),{task:getTask.toJSON()}));
				this.addNewTaskView= new app.AddOne({model:getTask});
			}else{
				$('.addFormDisplay').html(_.template($('#addFormTemplate').html(),{task:new app.Task}));
				this.addNewTaskView= new app.AddOne({model:new app.Task});
				tasks.fetch();
				$('.tasks').html(this.tasksView.render().el);
			}
			
		},
	});