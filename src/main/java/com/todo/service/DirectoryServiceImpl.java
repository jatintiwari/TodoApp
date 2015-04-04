package com.todo.service;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.todo.DAO.TodoDAO;
import com.todo.model.Todo;

@Service
public class DirectoryServiceImpl implements DirectoryService {
	
	@Autowired
	TodoDAO todoDAO;
	
	@Transactional
	public Collection<Todo> getAll() {
		return todoDAO.list();
	}

	@Transactional
	public void save(Todo todo) {
		todoDAO.save(todo);	
	}
	@Transactional
	public Todo getTask(Long id) {
		return todoDAO.getTask(id);
	}
	@Transactional
	public void delete(Long id) {
		todoDAO.delete(id);
	}
	@Transactional
	public void update(Todo todo) {
		todoDAO.update(todo);
	}

}
