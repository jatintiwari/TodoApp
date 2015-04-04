package com.todo.service;

import java.util.Collection;

import com.todo.model.Todo;

public interface DirectoryService {

	Collection<Todo> getAll();

	void save(Todo todo);

	Todo getTask(Long id);

	void delete(Long id);

	void update(Todo todo);
}
