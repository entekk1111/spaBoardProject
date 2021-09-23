package com.spaProject.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spaProject.dao.LoginMapper;
import com.spaProject.domain.User;

@Service
public class LoginService {
	

	@Autowired
	private LoginMapper loginMapper;
	
	//닉네임가져오기
	public String getNickName(String userEmail) {
		return loginMapper.getNickName(userEmail);
	}
	
	//로그인
	public boolean login(User user) {
		
		String idCheck = loginMapper.loginIdCheck(user.getUserEmail());
		
		if(idCheck != null) {
			String pwCheck = loginMapper.loginPwCheck(user.getUserEmail());
			String rawPw = user.getUserPw();
			
			if(pwCheck.equals(rawPw)) {
				return true;
			}else {
				return false;
			}
		}		
		return false;
	}
}
