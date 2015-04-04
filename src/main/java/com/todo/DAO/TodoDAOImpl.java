package com.todo.DAO;

import java.util.Collection;

import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.todo.model.Todo;


@Repository
public class TodoDAOImpl implements TodoDAO{

	@Autowired
	SessionFactory sessionFactory;
	
	public Collection<Todo> list() {
		return sessionFactory.getCurrentSession().createQuery("from Todo").list();
	}

	public void save(Todo todo) {
		sessionFactory.getCurrentSession().save(todo);	
	}

	public Todo getTask(Long id) {
		return (Todo) sessionFactory.getCurrentSession().load(Todo.class, id);
	}

	public void delete(Long id) {
		Todo todo=getTask(id);
		sessionFactory.getCurrentSession().delete(todo);
	}

	public void update(Todo todo) {
		sessionFactory.getCurrentSession().update(todo);
		
	}

}
