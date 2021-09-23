package com.spaProject.domain;

import lombok.Data;

@Data
public class Post {
	
	private int postCode;
	private String cateCode;
	private String postEmail;
	private String postName;
	private String postContents;
	private int postView;
	private String postRegDate;
	private String postModifyDate;
	private String type;
	private String userEmail;
	
}
