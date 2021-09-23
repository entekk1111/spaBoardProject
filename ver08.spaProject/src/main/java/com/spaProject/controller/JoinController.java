package com.spaProject.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.spaProject.domain.User;
import com.spaProject.service.JoinService;

@Controller
public class JoinController {

	@Autowired
	private JoinService joinService;

	//회원가입
	@PostMapping("/addUser")
	@ResponseBody
	public boolean addUser(@RequestParam(value="userEmail", required = false) String userEmail
						   ,@RequestParam(value="userPw", required = false) String userPw
						   ,@RequestParam(value="userName", required = false) String userName) {
		
		User user = new User();
		user.setUserEmail(userEmail);
		user.setUserPw(userPw);
		user.setUserName(userName);
		
		int result = joinService.addUser(user);
		
		if(result == 1) {
			return true;
		}else {
			return false;
		}
	}
	
	@PostMapping("/nameCheck")
	@ResponseBody
	public int nameCheck(@RequestParam(value = "userName")String userName) {
		return joinService.userNameCheck(userName);
	}
	
	@PostMapping("/emailCheck")
	@ResponseBody
	public int emailCheck(@RequestParam(value = "emailCheck")String userEmail) {
		return joinService.userEmailCheck(userEmail);
	}
}
