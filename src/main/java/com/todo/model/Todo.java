package com.todo.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Todo {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	private String taskTitle;
	private boolean completed;
	
	public boolean isCompleted() {
		return completed;
	}
	public void setCompleted(boolean completed) {
		this.completed = completed;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getTaskTitle() {
		return taskTitle;
	}
	public void setTaskTitle(String taskTitle) {
		this.taskTitle = taskTitle;
	}
	
}
