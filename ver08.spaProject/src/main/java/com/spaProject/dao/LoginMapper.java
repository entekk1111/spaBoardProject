package com.spaProject.dao;

import org.apache.ibatis.annotations.Mapper;


@Mapper
public interface LoginMapper {

	//닉네임 가져오기
	public String getNickName(String userEmail);
	
	//비밀번호 체크
	public String loginPwCheck(String userEmail);
	
	//아이디 체크
	public String loginIdCheck(String userEmail);
}
