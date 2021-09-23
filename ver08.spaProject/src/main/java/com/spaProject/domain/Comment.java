package com.spaProject.domain;

import lombok.Data;

@Data
public class Comment {
	private int commentCode;
	private String postCode;
	private String commentWriter;
	private String comment;
	private String commentRegDate;
	
}
