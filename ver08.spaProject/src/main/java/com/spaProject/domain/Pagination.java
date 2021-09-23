package com.spaProject.domain;

import lombok.Data;

@Data
public class Pagination {
	//검색조건
	private String conditions;
	
	//정렬조건
	private String sequence;
	
	//검색값
	private String value;
	
	//게시글 코드
	private String postCode;
	
	//현재 페이지 번호
	private int currentPage;
	
	//한 페이지 당 보여줄 게시글 행의 갯수
	private int rowPerPage;
	
	//한 페이지 당 보여질 행의 시작점 초기화
	//(현재 페이지 번호 -1) * 페이지당 보여줄 게시글 행의 갯수
	public int getRowStart() {
		return (this.currentPage-1) * rowPerPage;
	}
	
	//기본 생성자를 통한 초기값 세팅
	//현재 페이지 = 1페이지
	//보여줄 행의 갯수 = 10개
	public Pagination() {
		this.currentPage = 1;
		this.rowPerPage = 10;
	}
	
	public int getCurrentPage() {
		return currentPage;
	}
	
	//페이지가 음수값이 되지 않도록 설정
	//음수가 되면 1페이지를 나타낸다.
	public void setCurrentPage(int currentPage) {
		if(currentPage <= 0) {
			this.currentPage = 1;
		}else {
			this.currentPage = currentPage;
		}
	}
	
	public int getRowPerPage() {
		return rowPerPage;
	}
	
	//페이지당 보여줄 게시글 개수가 변하지 않도록 설정
	public void setRowPerPage(int pageCount) {
		int cnt = this.rowPerPage;
		if(pageCount != cnt) {
			this.rowPerPage = cnt;
		}else {
			this.rowPerPage = pageCount;
		}
	}

}
