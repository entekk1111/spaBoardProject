package com.spaProject.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spaProject.dao.JoinMapper;
import com.spaProject.domain.User;

@Service
public class JoinService {
	

	@Autowired
	private JoinMapper joinMapper;
	
	//회원가입
	public int addUser(User user) {		
		return joinMapper.addUser(user);
	}
	
	//닉네임 중복체크
	public int userNameCheck(String userName) {
		return joinMapper.userNameCheck(userName);
	};
	
	//이메일 중복체크
	public int userEmailCheck(String userEmail) {
		return joinMapper.userEmailCheck(userEmail);
	}
}
