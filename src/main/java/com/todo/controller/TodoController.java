package com.todo.controller;

import java.util.Collection;

import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.todo.model.Todo;
import com.todo.service.DirectoryService;

@Controller
@RequestMapping(value="todo")
public class TodoController {

	@Autowired
	DirectoryService directoryService;

	ObjectMapper mapper;
	JSONObject jsonObject;
	JSONArray jsonArray;

	@RequestMapping(value="list",method=RequestMethod.GET)
	public @ResponseBody String getTodoList(){
		try {
			Collection<Todo> todoList= directoryService.getAll();
			jsonArray= new JSONArray();
			for(Todo todo:todoList){
				jsonObject= new JSONObject();
				jsonObject.put("id", todo.getId());
				jsonObject.put("taskTitle", todo.getTaskTitle());
				jsonObject.put("completed",todo.isCompleted());
				jsonArray.put(jsonObject);
			}
			return jsonArray.toString();
		} catch (JSONException e) {
			return "{\"result\": \"no items:e\"}";
		}
	}
	
	@RequestMapping(method=RequestMethod.POST) 
	@ResponseStatus(value=HttpStatus.CREATED)
	public @ResponseBody String addTodo(@RequestBody String incomingData){
		try{
			System.out.println("Post: "+incomingData);
			mapper= new ObjectMapper();
			Todo todo= mapper.readValue(incomingData,Todo.class);
			directoryService.save(todo);
			return "{\"result\":\"success\"}";
		}catch(Exception e){
			return null;
		}
	}
	@RequestMapping(value="/{id}",method=RequestMethod.PUT) 
	public @ResponseBody String updateTodo(@PathVariable("id") Long id,@RequestBody String incomingData){
		try{
			mapper= new ObjectMapper();
			System.out.println("UPDATE: "+id);
			System.out.println("IncomingData: "+incomingData);
			Todo todo= mapper.readValue(incomingData,Todo.class);
			directoryService.update(todo);
			return "{\"result\":\"success\"}";
		}catch(Exception e){
			e.printStackTrace();
			return "{\"result\":\"exception\"}";
		}
	}
	
	@RequestMapping(value="/{id}",method=RequestMethod.DELETE) 
	public @ResponseBody String deleteTodo(@PathVariable("id") Long id,@RequestBody String incomingData){
		try{
			System.out.println("Incoming Data: "+incomingData);
			System.out.println("DELETE: "+id);
			directoryService.delete(id);
			return "{\"result\":\"success\"}";
		}catch(Exception e){
			return null;
		}
	}
}
