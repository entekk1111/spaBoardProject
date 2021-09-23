package com.spaProject.controller;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.spaProject.domain.Comment;
import com.spaProject.domain.Post;
import com.spaProject.service.PostService;

@Controller
public class PostController {
		
	@Autowired
	private PostService postService;
	
	//좋아요
	@PostMapping("postLike")
	@ResponseBody
	public String postLike(@RequestBody Post post) {
		
		String result = postService.postLike(post);		
		return result;
	}
	
	//댓글 삭제
	@PostMapping("commentDel")
	@ResponseBody
	public void commentDelete(@RequestParam(value="commentCode", required = false)String commentCode) {
		postService.commentDelete(commentCode);;
	}
	
	//댓글 등록
	@PostMapping("addComment")
	@ResponseBody
	public boolean addComment(@RequestBody Comment comment) {
		postService.addComment(comment);
		return true;
	}
	
	//댓글 수 가져오기
	@PostMapping("getCommentNum")
	@ResponseBody
	public List<String> getCommentNum(@RequestParam(value="postCode[]")List<String> postCode){
		return postService.getCommentNum(postCode);
	}
	
	//좋아요 갯수 가져오기
	@PostMapping("likeBtnNum")
	@ResponseBody
	public Map<String, Object> likeBtnNum(@RequestBody Post post){
		Map<String, Object> resultMap = postService.likeBtnNum(post);
		return resultMap;
	}
	
	//댓글 가져오기
	@PostMapping("postComment")
	@ResponseBody
	public List<Map<String, Object>> postComment(@RequestParam(value = "postCode", required = false)String postCode){
		return postService.getComment(postCode);
	}
	
	//다음글 가져오기
	@PostMapping("nextPost")
	@ResponseBody
	public Map<String, Object> nextPost(@RequestParam(value = "postCode", required = false)String postCode) {
		return postService.nextPost(postCode);
	}
	
	//이전글 가져오기
	@PostMapping("previousPost")
	@ResponseBody
	public Map<String, Object> previousPost(@RequestParam(value = "postCode", required = false)String postCode) {
		return postService.previousPost(postCode);
	}
	
	//게시글 상세 가져오기
	@PostMapping("postDetail")
	@ResponseBody
	public Map<String, Object> postDetail(@RequestParam(value = "postCode", required = false)String postCode) {	
		return postService.getPostDetail(postCode);
	}	
	
    @PostMapping(value="/uploadSummernoteImageFile", produces = "application/json")
    @ResponseBody
    public Map<String,Object> uploadSummernoteImageFile(@RequestParam("file") MultipartFile multipartFile) {

        Map<String,Object> jsonObject = new HashMap<>();

        String fileRoot = "C:\\imagepath\\";	//저장될 파일 경로 
        String originalFileName = multipartFile.getOriginalFilename();	//오리지널 파일명
        String extension = originalFileName.substring(originalFileName.lastIndexOf("."));	//파일 확장자
        
        // 랜덤 UUID+확장자로 저장될 savedFileName
        String savedFileName = UUID.randomUUID() + extension;	
        
        File targetFile = new File(fileRoot + savedFileName);

        try {
            InputStream fileStream = multipartFile.getInputStream();
            FileUtils.copyInputStreamToFile(fileStream, targetFile);	//파일 저장
            jsonObject.put("url", "/image/"+savedFileName);
            jsonObject.put("responseCode", "success");
            jsonObject.put("filename", savedFileName);

        } catch (IOException e) {
            FileUtils.deleteQuietly(targetFile);	// 실패시 저장된 파일 삭제
            jsonObject.put("responseCode", "error");
            e.printStackTrace();
        }

        return jsonObject;
    }

	
	//게시글 수정 or 등록
	@PostMapping("addPost")
	public String addPost(Post post) {
		postService.addPost(post);

		return "redirect:/";
	}
	
	//게시글 삭제
	@PostMapping("postDelete")
	@ResponseBody
	public int postDelete(@RequestParam(value = "postCode", required = false)String postCode) {
		return postService.postDelete(postCode);
	}
}
