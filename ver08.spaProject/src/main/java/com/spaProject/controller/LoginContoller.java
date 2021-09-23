package com.spaProject.controller;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.spaProject.domain.User;
import com.spaProject.service.LoginService;

@Controller
public class LoginContoller {

	@Autowired
	private LoginService loginService;	
	
	//로그인
	@PostMapping("login")
	@ResponseBody
	public boolean login(HttpSession session
						,@RequestParam(value="userEmail", required = false)String userEmail
						,@RequestParam(value="userPw", required = false)String userPw) {
		
		User user = new User();
		user.setUserEmail(userEmail);
		user.setUserPw(userPw);
		
		boolean result = loginService.login(user);
		
		if(result) {
			String name = loginService.getNickName(user.getUserEmail());
			
			session.setAttribute("SEMAIL", user.getUserEmail());
			session.setAttribute("SNAME", name);
			return true;
		}else {
			return false;
		}		
		
	}
	
	@GetMapping("logout")
	public String logout(HttpSession session) {
		session.invalidate();
		return "redirect:/";
	}

}
