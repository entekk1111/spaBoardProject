package com.spaProject.dao;

import org.apache.ibatis.annotations.Mapper;

import com.spaProject.domain.User;

@Mapper
public interface JoinMapper {
	
	//회원가입
	public int addUser(User user);
	
	//닉네임 중복체크
	public int userNameCheck(String userName);
	
	//이메일 중복체크
	public int userEmailCheck(String userEmail);
}
