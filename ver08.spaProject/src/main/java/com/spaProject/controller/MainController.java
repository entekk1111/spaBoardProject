package com.spaProject.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.spaProject.domain.Pagination;
import com.spaProject.paging.PageMaker;
import com.spaProject.service.PostService;



@Controller
public class MainController {

	
	@Autowired
	private PostService postService; 
	
	@GetMapping("/")
	public String main(Model model, Pagination paging) {
		
		//PageMaker 객체를 생성함
		PageMaker pageMaker = new PageMaker();
		
		//currentPage(현재 페이지 번호)와 rowPerPage(한 페이지당 보여줄 게시글 행의 갯수)를 셋팅해준다.
		pageMaker.setPaging(paging);
		
		//총 게시글 수 셋팅 : 게시글 리스트 총 갯수를 세는 쿼리를 호출하여 셋팅해줌.
		pageMaker.setTotalCount(postService.getPostCount(paging));
		
		List<Map<String, Object>> resultMap = postService.getPostList(paging);
		
		model.addAttribute("currentPage", paging.getCurrentPage());
		model.addAttribute("lastPage", pageMaker.getLastPage());
		model.addAttribute("pageStartNum", pageMaker.getPageStartNum());
		model.addAttribute("pageEndNum", pageMaker.getPageEndNum());
		model.addAttribute("totalCount", pageMaker.getTotalCount());
		
		
		model.addAttribute("sequence", paging.getSequence());
		model.addAttribute("conditions", paging.getConditions());
		model.addAttribute("value", paging.getValue());
		model.addAttribute("list", resultMap);
		
		
		return "main";
	};
	
}
