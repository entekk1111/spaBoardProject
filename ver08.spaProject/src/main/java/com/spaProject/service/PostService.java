package com.spaProject.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spaProject.dao.PostMapper;
import com.spaProject.domain.Comment;
import com.spaProject.domain.Pagination;
import com.spaProject.domain.Post;

@Service
public class PostService {
	
	
	@Autowired
	private PostMapper postMapper;
	
	//좋아요 갯수+좋아요 눌렀는지 확인
	public Map<String, Object> likeBtnNum(Post post) {
		
		int likeNum = postMapper.likeBtnNum(post);
		int likeCheck = postMapper.likeCheck(post);
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		resultMap.put("likeNum", likeNum);
		resultMap.put("likeCheck", likeCheck);
		return resultMap;
	}
	
	//좋아요 버튼 클릭
	public String postLike(Post post) {
		
		//중복 좋아요 체크
		int result = postMapper.likeCheck( post);
		
		if(result == 0) {
			//좋아요 등록
			postMapper.addPostLike(post);
			return "add";
		}else {
			//좋아요 취소
			postMapper.delPostLike(post);
			return "del";
		}		
	}
	
	//댓글 삭제
	public void commentDelete(String commentCode) {
		postMapper.commentDelete(commentCode);
	}
	
	//댓글 등록
	public void addComment(Comment comment) {
		int code = postMapper.getMaxCommentCode();
		comment.setCommentCode(code+1);
		postMapper.addComment(comment);
	};
	
	//게시글 댓글 가져오기
	public List<Map<String, Object>> getComment(String postCode){
		return postMapper.getComment(postCode);
	};
	
	//게시글 이전글
	public Map<String, Object> nextPost(String postCode) {
		return postMapper.nextPost(postCode);
	};
	
	//게시글 이전글
	public Map<String, Object> previousPost(String postCode) {
		return postMapper.previousPost(postCode);
	};
	
	//게시글 상세 가져오기
	public Map<String, Object> getPostDetail(String postCode){
		
		//조회수 올리기
		int viewNum = postMapper.getViewNum(postCode);
		
		Map<String, Object> viewMap = new HashMap<>();
		
		viewMap.put("viewNum", viewNum+1);
		viewMap.put("postCode", postCode);
		//조회수 +1
		postMapper.addViewNum(viewMap);
		
		return postMapper.getPostDetail(postCode);
	};
	
	
	
	//게시글 등록 or 수정
	public void addPost(Post post) {
		
		if(post.getType().equals("addPost")) {
			postMapper.addPost(post);			
		}else if(post.getType().equals("postModify")) {
			postMapper.postModify(post);
		}	
	}
	
	public int getPostCount(Pagination paging) {
		return postMapper.getPostCount(paging);
	}
	
	//댓글 수 가져오기
	public List<String> getCommentNum(List<String> postCode){
		List<String> num = new ArrayList<>();
		
		for(int i = 0; i<postCode.size(); i++) {
			String result = postMapper.getCommentNum(postCode.get(i));
			num.add(result);
		}		
		return num;
	}
	
	//게시글 
	public List<Map<String, Object>> getPostList(Pagination paging){
		return postMapper.getPostList(paging);		
	};
	
	//게시글 삭제
	public int postDelete(String postCode) {
		return postMapper.postDelete(postCode);
	};
}
