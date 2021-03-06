<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri ="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head th:replace="fragments/head :: headFragment">
<meta charset="UTF-8">
</head>
<body>
   <div id="wrapper">
         <div id="header" th:replace="fragments/header :: headerFragment"></div>
		 
		 <div id="leftcolumn" th:replace="fragments/left :: leftFragment"></div>
		 
		 <div id="rightcolumn">
		 <!-- 게시글 목록 -->
		  	<div class="hide" id="recentPost">
			  	<form id="searchForm" th:action="@{/(sequence=${sequence}
			 						,conditions=${conditions}
			 						,value=${#strings.trim(value)})}" method="get">
				<table style="border: none;" id="searchTb">
					<tbody>
						<tr>
							<td>
							<c:if test="${sequence == '' or sequence == null and value == null}">
								<h1>최신게시글</h1>
							</c:if>
							<c:if test="${sequence == 'postView'}">
								<h1>조회수best</h1>
							</c:if>
							<c:if test="${sequence == 'postLike'}">
								<h1>공감수</h1>
							</c:if>
							<c:if test="${sequence == '' or sequence == null and value == null}">
								<h1>최신게시글</h1>
							</c:if>
							<c:if test="${conditions == 'chat'}">
								<h1>잡담</h1>
							</c:if>
							<c:if test="${conditions == 'hobby'}">
								<h1>취미</h1>
							</c:if>
							<c:if test="${conditions == 'horror'}">
								<h1>공포</h1>
							</c:if>
							<c:if test="${value != '' and value != null and conditions != ''.toString() and conditions != ''}">
								<h1>검색결과</h1>
							</c:if>
								<b>[통합검색] : </b>
							 	<select name="conditions">
				 					<option value="postName">제목</option>
				 					<option value="userName">글쓴이</option>
				 				</select>
				 				<input name="value" type="text" maxlength="20" placeholder="검색어를 입력하세요."></input>
				 				<button id="searchBtn" type="button">검색</button>
							</td>			
						</tr>
					</tbody>
				</table>
	 			</form>
 				
		 		<table id="postListTb" border="1">
		 			<thead>
		 				<tr>
		 					<th>no.</th>
		 					<th>카테고리</th>
		 					<th>제목</th>
		 					<th>글쓴이</th>
		 					<th>공감수</th>
		 					<th>조회수</th>
		 					<th>작성일</th>
		 				</tr>
		 			</thead>
		 			<tbody id="postListBody">
		 			<th:block th:if="${list.size} > 0">
		 				<tr class="postListTr" th:each="l, index: ${list}">
		 					<td th:text="${totalCount-((currentPage-1)*10+index.index)}"></td>
		 					<td th:text=${l.cate_name}></td>
		 					<td><a class="postDetail" th:href="@{#}">[[${l.post_name}]]</a>
		 						💬<b class="commentNum"></b>
		 						<input type="hidden" class="postCode" th:value=${l.post_code}></input>
		 					</td>
		 					<td th:text=${l.user_name}></td>
		 					<td th:text=${l.like_num}></td>
		 					<td th:text=${l.post_view}></td>
		 					<td th:text="${#dates.format(l.post_reg_date, 'yyyy-MM-dd hh:mm:ss')}"></td>

		 				</tr>
		 				<tr>
		 					<td colspan="7" style="text-align: center;">
		 						<a th:if="${currentPage > 1}" th:href="@{/(sequence=${sequence}
		 																,conditions=${conditions}
		 																,value=${value})}">[처음으로]</a>
		 						<a th:if="${currentPage > 1}" th:href="@{/(currentPage=${currentPage - 1}
		 																,sequence=${sequence}
		 																,conditions=${conditions}
		 																,value=${value})}">[이전]</a>
		 						
		 						<th:block th:each="num:${#numbers.sequence(pageStartNum, pageEndNum)}">
		 							<a th:if="${num != currentPage}" th:href="@{/(currentPage=${num}
		 																		,sequence=${sequence}
		 																		,conditions=${conditions}
		 																		,value=${value})}">[[${num}]]</a>
		 							<a th:unless="${num != currentPage}" style="color: red;">[[${num}]]</a>
		 						</th:block>
		 						<a th:if="${currentPage < lastPage}" th:href="@{/(currentPage=${currentPage + 1}
		 																		,sequence=${sequence}
		 																		,conditions=${conditions}
		 																		,value=${value})}">[다음]</a>
		 						<a th:if="${pageEndNum != currentPage}" th:href="@{/(currentPage=${lastPage}
		 																			,sequence=${sequence}
		 																			,conditions=${conditions}
		 																			,value=${value})}">[맨마지막으로]</a>
		 					</td>
		 				</tr>
		 			</th:block>
		 			<th:block th:unless="${list.size} > 0">
		 				<tr>
		 					<td colspan="7" style="text-align: center;">
		 						검색 결과가 없습니다.
		 					</td>
		 				</tr>
		 			</th:block>
		 			</tbody>
		 		</table>
		 		<th:block th:if="${session.SNAME != ''.toString() and session.SNAME != null}">
			 		<br/><button id="writeBtn" type="button">글쓰기</button>
		 		</th:block>
		 	</div>
		 
		 <!-- 글쓰기 -->
		 	<div class="hide" id="write">
		 		<form id="addPost" th:action="@{/addPost}" method="post" enctype="multipart/form-data">
			 		<table id="addPostTb">
				 		<thead>
				 			<tr>
				 				<th>글쓰기</th>
				 			</tr>
				 		</thead>
				 		<tbody>
				 			<tr>
				 				<td><input id="addPostName" name="postName" type="text" maxlength="45" placeholder="45자 내로 제목을 입력해주세요."></input>	
				 					<input type="hidden" name="postEmail" th:value="${session.SEMAIL}" />	
				 					<input type="hidden" name="postCode" id="postCode" value="0"/>	
				 					<input type="hidden" name="type" id="writeType" value="addPost"/>	
				 				</td>
				 			</tr>
				 			<tr>
				 				<td>
				 					<select name="cateCode" id="cateSel">
				 						<option value="chat">잡담</option>
				 						<option value="hobby">취미</option>
				 						<option value="horror">공포</option>
				 					</select>
				 				</td>
				 			</tr>
				 			<tr>
				 				<td><textarea id="contents" name="postContents" cols="50" rows="14"></textarea></td>
				 			</tr>
				 		</tbody>
			 		</table>
		 		</form>
		 			<a class="listBtn" th:href="@{/(currentPage=${currentPage}
		 						,sequence=${sequence}
		 						,conditions=${conditions}
		 						,value=${value})}">목록</a>
			 		<button id="addWriteBtn">등록</button>
		 	</div>
		 	
		 	<!-- 게시글 상세 -->
		 	<div class="hide" id="postDetail">
		 		<table id="postDetailTb">
			 		<thead>
			 			<tr>
			 				<th colspan="2">글상세보기</th>
			 			</tr>
			 		</thead>
			 		<tbody>
			 			<tr>
			 				<td colspan="2"><b>제목 : </b><h1 id="postName"></h1>
			 					<input type="hidden" id="postDetailCode"/>
			 				</td>
			 			</tr>
			 			<tr>
			 				<td colspan="2"><b>글쓴이 : </b><span id="postUserName"></span></td>
			 			</tr>
			 			<tr>
			 				<td style="height: 100px;" colspan="2"><span id="postContents"></span></td>
			 			</tr>
			 			<tr>
			 				<td colspan="2"><button id="likeBtn" th:value="${session.SEMAIL}">🤍</button> 공감<span id="postLikeNum"></span>개!</td>
			 			</tr>
			 			<tr>			 				
			 				<td class="listBtn"><a th:href="@{/(currentPage=${currentPage}
						 						,sequence=${sequence}
						 						,conditions=${conditions}
						 						,value=${value})}">목록</a></td>
			 				<th:block th:if="${session.SNAME != ''.toString() and session.SNAME != null}">
				 				<td style="text-align: right; border-left:none;"><button th:value="${session.SNAME}" id="postModify" type="button">수정</button>
				 					<button th:value="${session.SNAME}" id="postDelete" type="button">삭제</button>
				 				</td>
			 				</th:block>
			 			</tr>
			 		</tbody>
		 		</table>
		 		<table id="commentTb">
		 			<thead>
		 				<tr>
		 					<th>댓글</th>
		 					<th:block th:if="${session.SNAME != ''.toString() and session.SNAME != null}">
			 					<th><input id="commentContents" placeholder="200자 이내로 작성해주세요." maxlength="199" type="text" name="comment"/>
			 						<input id="loginUser" type="hidden" th:value="${session.SEMAIL}" />
			 					</th>
			 					<th><button id="commentBtn">등록</button></th>
		 					</th:block>
		 					
		 					<th:block th:unless="${session.SNAME != ''.toString() and session.SNAME != null}">
			 					<th><input type="text" name="comment" disabled="disabled" placeholder="로그인 후 가능"/></th>
			 					<th><button>등록</button></th>
		 					</th:block>
		 				</tr>
		 			</thead>
		 			<tbody id="comment">
		 				
		 			</tbody>
		 		</table>
		 		<div id="btnDiv">
			 		<button id="previousPost"></button>
			 		<button id="nextPost"></button>
		 		</div>
		 	</div>
		 
		 <!-- 회원가입 -->
		 	<div class="hide" id="joinForm">
		 		<h2>회원가입</h2>
		 		<form id="submitForm" th:action="@{/addUser}" method="post">
			 		<table id="addUserForm">
			 			<tbody>
			 				<tr>
			 					<td>
			 						<label for="userEmail">이메일</label>
			 					</td>
			 					<td>
			 						<input type="text" id="userEmail" maxlength="45" placeholder="이메일"/>
			 						<input type="hidden" id="emailValue" name="userEmail"/>
			 						<button id="userEmailCheck" type="button"/> 중복체크
			 					</td>
			 				</tr>
			 				<tr>
			 					<td>
			 						<label for="userPw">비밀번호</label>
			 					</td>
			 					<td>
			 						<input type="password" name="userPw" id="userPw" maxlength="45" placeholder="비밀번호"/>
			 						</br><span>*최소 8자리 이상 영어 대문자,소문자,숫자,특수문자 중 3종류 조합</span>
			 					</td>
			 				</tr>
			 				<tr>
			 					<td>
			 						<label for="userPwCheck">비밀번호 확인</label>
			 					</td>
			 					<td>
			 						<input type="password" id="userPwCheck" maxlength="45" placeholder="비밀번호"/>
			 					</td>
			 				</tr>
			 				<tr>
			 					<td>
			 						<label for="userName">닉네임</label>
			 					</td>
			 					<td>
			 						<input type="text" id="userName" maxlength="10" placeholder="10글자 이하"/>
			 						<input type="hidden" name="userName" id="userNameValue"/>
			 						<button id="userNameCheck" type="button"/> 중복체크
			 					</td>
			 				</tr>
			 			</tbody>
			 		</table>
		 		</form>
			 		<button id="joinUserInfoBtn" type="button">회원가입</button>
		 	</div>
			<div class="hide" id="postMsg"></div>
			</div>
		 
		 <div id="footer" th:replace="fragments/footer :: footerFragment"></div>
   </div>
   
   <!-- 버튼 클릭시 기본 -->
   <script type="text/javascript" th:src="@{/js/defaultJs.js}"></script>
   <!----------->
   
   <!-- 회원가입 -->
   <script type="text/javascript" th:src="@{/js/joinJs.js}"></script>
   <!----------->
   
   <!-- 로그인 -->
   	<script type="text/javascript" th:src="@{/js/loginJs.js}"></script>
   <!----------->
   
   <!-- 글쓰기 -->
   	<script type="text/javascript" th:src="@{/js/writeJs.js}"></script>
   <!----------->
</body>
</html>