package com.todo.DAO;

import java.util.Collection;

import com.todo.model.Todo;

public interface TodoDAO {

	Collection<Todo> list();
	void save(Todo todo);
	Todo getTask(Long id);
	void delete(Long id);
	void update(Todo todo);
}
