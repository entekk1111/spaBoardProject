package com.spaProject.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.spaProject.domain.Comment;
import com.spaProject.domain.Pagination;
import com.spaProject.domain.Post;

@Mapper
public interface PostMapper {
	
	//좋아요 갯수
	public int likeBtnNum(Post post);
	
	//좋아요 취소
	public void delPostLike(Post post);
	
	//좋아요 등록
	public void addPostLike(Post post);
	
	//중복 좋아요 체크
	public int likeCheck(Post post);
	
	//댓글삭제
	public void commentDelete(String commentCode);
	
	//댓글등록
	public void addComment(Comment comment);
	
	//댓글코드 최댓값 가져오기
	public int getMaxCommentCode();
	
	//조회수 +1
	public int addViewNum(Map<String, Object> viewNum);
	
	//기존 조회수 가져오기
	public int getViewNum(String postCode);
	
	//게시글 댓글 가져오기
	public List<Map<String, Object>> getComment(String postCode);
	
	//게시글 이전글 가져오기
	public Map<String, Object> nextPost(String postCode);

	//게시글 이전글 가져오기
	public Map<String, Object> previousPost(String postCode);
	
	//게시글 상세 가져오기
	public Map<String, Object> getPostDetail(String postCode);
	
	//게시글 수정
	public int postModify(Post post);
	
	//게시글 등록
	public int addPost(Post post);
	
	public int getPostCount(Pagination paging);
	
	//댓글 수 가져오기
	public String getCommentNum(String postCode);
	
	public List<Map<String, Object>> getPostList(Pagination paging);
	
	//게시글 삭제
	public int postDelete(String postCode);
}
