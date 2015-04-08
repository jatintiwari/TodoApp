var app= app||{};


app.TaskRouter=Backbone.Router.extend({
		routes:{
			'':'list',
			'add':'add',
			'list/:id(/:action)':'taskEdit',
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
		add:function(){
				console.log('this is a add function');
				var _this=this;
				this.newTask= new app.Task();
				$('.addFormDisplay').html(_.template($('#addFormTemplate').html(),{task:this.newTask,action:'add'}));
				$('#taskTitle').focus();
				this.addNewTaskView= new app.AddOne({model:this.newTask});
				tasks.fetch({
					success:function(){
						$('.tasks').html(_this.tasksView.render().el);
					}
				});
		},
		taskEdit:function(id,action){
			console.log(id);
			var getTask=tasks.get(id);
			if(!getTask){
				$('.addFormDisplay').html('<div class="alert alert-danger" role="alert">No Task</div>');
				return;
			}
			if(action==='edit'){
				$('.addFormDisplay').html(_.template($('#addFormTemplate').html(),{task:getTask.toJSON(),action:action}));
				this.addNewTaskView= new app.AddOne({model:getTask});
			}else{
				$('.addFormDisplay').html(_.template($('#addFormTemplate').html(),{task:getTask.toJSON(),action:null}));
				this.addNewTaskView= new app.AddOne({model:getTask});
			}
		},
		
	});