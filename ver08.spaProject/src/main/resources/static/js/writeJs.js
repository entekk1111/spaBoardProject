
$(function(){
	
	//summernote 파일 업로드 함수
	var uploadSummernoteImageFile = function(file, editor) {
        data = new FormData();
        data.append("file", file);
        $.ajax({
            data : data,
            type : "POST",
            url : "/uploadSummernoteImageFile",
            contentType : false,
            processData : false,
            success : function(data) {
                //항상 업로드된 파일의 url이 있어야 한다.
                $(editor).summernote('insertImage', data.url, data.filename);
            }
        });
    }
   
	//summernote 에디터
	var writeEditer = function(){
			$('#contents').summernote({
				height: 250,                 // 에디터 높이
				minHeight: null,             // 최소 높이
				maxHeight: null,             // 최대 높이
				focus: true,                 // 에디터 로딩후 포커스를 맞출지 여부
				lang: "ko-KR",				 // 한글 설정
				toolbar: [					 // 툴바 설정
				    // [groupName, [list of button]]
					['fontname', ['fontname']],
					['fontsize', ['fontsize']],
					['style', ['bold', 'italic', 'underline','strikethrough', 'clear']],
					['color', ['forecolor','color']],
					['table', ['table']],
					['para', ['ul', 'ol', 'paragraph']],
					['height', ['height']],
					['insert',['picture','link','video']],
					['view', ['fullscreen', 'help']]
					  ],
				fontNames: ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New','맑은 고딕','궁서','굴림체','굴림','돋움체','바탕체'],
				fontSizes: ['8','9','10','11','12','14','16','18','20','22','24','28','30','36','50','72'],
				callbacks: {	//여기 부분이 이미지를 첨부하는 부분
					onImageUpload : function(files) {
						uploadSummernoteImageFile(files[0],this);
					},
					onPaste: function (e) {
						var clipboardData = e.originalEvent.clipboardData;
						if (clipboardData && clipboardData.items && clipboardData.items.length) {
							var item = clipboardData.items[0];
							if (item.kind === 'file' && item.type.indexOf('image/') !== -1) {
								e.preventDefault();
							}
						}
					}
				}
		});
	}

	var html = '';
	
	//경고 창
	var msg = function(html){
		$('#postMsg').html('');
		$('#postMsg').append(html);
		$('#postMsg').css('background-color','white');
	};
	
	//댓글수 가져오기
	var postListTr = $('#postListBody').children();
	var array = [];

	if(postListTr.length > 1){
		
		//게시글 코드 가져오기
		for(var i = 0; i <postListTr.length -1; i++){
			var postCode = postListTr.eq(i).find('.postCode').val();
			array.push(postCode);
		}
		//댓글 수 가져오는 ajax
		var request = $.ajax({
			url: "/getCommentNum",
			method: "POST",
			data: { postCode : array },
			dataType: "json"
		});
		
		request.done(function( data ) {
			for(var i = 0; i <data.length; i++){
				//제목 옆에 댓글 수 넣어주기
				postListTr.eq(i).find('.commentNum').text(data[i]);				
			}
		});
		
		request.fail(function( jqXHR, textStatus ) {
			alert('에러가 발생했습니다. 관리자에게 문의해주세요.');
		});
	}
	
	//글 내용 가져오기
	var postDetail = function(postCode){
		var request = $.ajax({
			  url: "/postDetail",
			  method: "POST",
			  data: { postCode : postCode },
			  dataType: "json"
			});
			 
			request.done(function( data ) {
				
				if(data != null && data != undefined){
					$('#postDetailCode').val(data.postCode);
					$('#postName').text(data.postName);
					$('#postUserName').text(data.userName); $('#postUserName').val(data.userName);
					$('#postContents').html(data.postContents);
					if(data.likeCount == undefined || data.likeCount == null){
						$('#postLike').text('0');	
					}else{				
						$('#postLike').text(data.likeCount);	
					}
				}			  
			});
			 
			request.fail(function( jqXHR, textStatus ) {
			  alert('에러가 발생했습니다. 관리자에게 문의해주세요.');
			});
	}
	
	//댓글 가져오기
	var postComment = function(postCode){
		var request = $.ajax({
			  url: "/postComment",
			  method: "POST",
			  data: { postCode : postCode },
			  dataType: "json"
			});
			 
			request.done(function( data ) {
				$('#comment').html('');
				var innerhtml = '';
				if(data.length > 0 && data != null && data != undefined){
					for(var i=0; i<data.length; i++){		
						innerhtml += '<tr>';
						innerhtml += 	'<td>'+ data[i].userName;
						innerhtml +=			'<input type="hidden" class="commentWriterEmail" value="' + data[i].commentWriter + '">';
						innerhtml +=		'</td>';
						innerhtml += 	'<td>'+ data[i].comment + '</td>';
						innerhtml += 	'<td>'+ data[i].commentRegDate.replace('T', ' ').substr(0,19); 
						innerhtml += 		'<button type="button" class="commentDelBtn" value="'+data[i].commentCode+'">삭제</button>';
						innerhtml += 	'</td>';
						innerhtml += '</tr>';
					}
				}else{
					innerhtml += '<tr>';
					innerhtml += 	'<td colspan="3" style="text-align:center;"> 등록된 댓글이 없습니다.</td>';
					innerhtml += '</tr>';
				}
				$('#comment').append(innerhtml);
				
				//댓글 삭제 눌렀을때
				$('.commentDelBtn').click(function(){
					var postCode = $('#postDetailCode').val(); 	//게시물 코드
					var commentCode = $(this).val();			//댓글 코드
					var loginUser = $('#loginUser').val();		//로그인 한 유저 이메일
					var commentWriter = $(this).parent().parent().find('.commentWriterEmail').val(); //댓글 단 유저 이메일
					
					if(loginUser != commentWriter){
						html = '<span>권한이 없습니다.</span>';
						msg(html);
					}else{
						var result = confirm('정말 삭제하시겠습니까?');
						if(result){
							var request = $.ajax({
								url: "/commentDel",
								method: "POST",
								data: {'commentCode' : commentCode}
							});
							
							request.done(function() {
								postComment(postCode);
							});
							
							request.fail(function( jqXHR, textStatus ) {
								alert( "Request failed: " + textStatus );
							});							
						}
					}
					
				});
			});
			 
			request.fail(function( jqXHR, textStatus ) {
			  alert( "Request failed: " + textStatus );
			});
	}
	
	//댓글 등록
	$('#commentBtn').click(function(){
	
		if($('#commentContents').val() != '' && $('#commentContents').val() != undefined && $('#commentContents').val() != null){
			var postCode = $('#postDetailCode').val()
			var array = { 
					postCode : postCode	//게시글 코드
					,commentWriter : $('#loginUser').val()	//로그인유저 이메일
					,comment : $('#commentContents').val()	//댓글 내용
			}
			
			var request = $.ajax({
				url: "/addComment",
				method: "POST",
				data: JSON.stringify(array),
				contentType: "application/json",
				dataType: "json"
			});
			
			request.done(function( data ) {
				if(data){
					postComment(postCode);
					$('#commentContents').val('');
				}	  
			});
			
			request.fail(function( jqXHR, textStatus ) {
				alert( "Request failed: " + textStatus );
			});				
		}else{
			html = '<span>댓글 내용을 입력해주세요.</span>';
			msg(html);
			$('#commentContents').focus();
		}
	});
	
	//좋아요 갯수 가져오기
	var likeBtnNum = function(postCode, userEmail){
		
		var array = {
				postCode : postCode		//게시글 코드
				,userEmail : userEmail	//로그인 한 유저 이메일
		}
		
		var request = $.ajax({
			  url: "/likeBtnNum",
			  method: "POST",
			  data: JSON.stringify(array),
			  contentType: "application/json",
			  dataType: "json"
			});
			 
			request.done(function( data ) {
				//현재 사용자가 해당 게시글에 하트를 누르지 않았을 경우
				if(data.likeCheck == 0){
					$('#likeBtn').text('🤍');
				//현재 사용자가 해당 게시글에 하트를 눌렀을 경우
				}else if(data.likeCheck > 0 ){
					$('#likeBtn').text('🖤');
				}
				//좋아요 갯수
				$('#postLikeNum').text(data.likeNum);
			});
			 
			request.fail(function( jqXHR, textStatus ) {
			  alert( "Request failed: " + textStatus );
			});
	}
	
	//좋아요 버튼 눌렀을때
	$('#likeBtn').click(function(){
		var userEmail = $('#likeBtn').val();		//로그인한 유저 이메일
		var postCode = $('#postDetailCode').val();	//게시글 코드
		//1. db에 같은 게시글에 같은 이메일이 있는지? 
		//2. 있으면 좋아요 취소
		//3. 없으면 좋아요 가능
		//* 본인 글에 좋아요 가능

		if(userEmail == undefined || userEmail == null || userEmail == ''){
			html = '<span>로그인을 해주세요.</span>';
			msg(html);
		}else{		
			var array = {
					userEmail : userEmail
					,postCode : postCode
			}
			
			var request = $.ajax({
				url: "/postLike",
				method: "POST",
				data: JSON.stringify(array),
				contentType: "application/json",
				dataType: "text"
			});
			
			request.done(function( data ) {
				if(data == 'add'){			//좋아요 추가
					$('#likeBtn').text('🖤');
					likeBtnNum(postCode, userEmail);
				}else if(data == 'del'){	//좋아요 삭제
					$('#likeBtn').text('🤍');
					likeBtnNum(postCode, userEmail);			
				}
			});
			
			request.fail(function( jqXHR, textStatus ) {
				alert( "Request failed: " + textStatus );
			});				
		}
		
	});
	
	//이전글 가져오기
	var previousPost = function(postCode){
		var request = $.ajax({
			  url: "/previousPost",
			  method: "POST",
			  data: { postCode : postCode },
			  dataType: "json"
			});
			 
			request.done(function( data ) {
				if(data != null && data != '' && data != undefined){
					$('#previousPost').removeAttr('disabled');
					$('#previousPost').text('이전 글 <<'+data.post_name);	//이전 게시글 제목
					$('#previousPost').attr('value', data.post_code);	//이전 게시글 코드	
				}
			});
			 
			request.fail(function( jqXHR, textStatus ) {
				$('#previousPost').text('이전 글이 없습니다.');
				$('#previousPost').attr('disabled','disabled');
			});
	}
	
	//다음글 가져오기
	var nextPost = function(postCode){
		var request = $.ajax({
			url: "/nextPost",
			method: "POST",
			data: { postCode : postCode },
			dataType: "json"
		});
		
		request.done(function( data ) {
			if(data != null && data != '' && data != undefined){
				$('#nextPost').removeAttr('disabled');
				$('#nextPost').text('다음 글 >>'+data.post_name);	//다음 게시글 제목
				$('#nextPost').attr('value',data.post_code);	//다음 게시글 코드				
			}
		});
		
		request.fail(function( jqXHR, textStatus ) {
			$('#nextPost').text('다음글이 없습니다.');
			$('#nextPost').attr('disabled','disabled');
		});
	}
	
	
	//게시글 검색 유효성 검사
	$('#searchBtn').click(function(){
		if($('input[name=value]').val().trim() ==  null ||$('input[name=value]').val().trim() == undefined || $('input[name=value]').val().trim() == ''){
			html = "<span>검색어를 입력해주세요.</span>";
			msg(html);
			$('input[name=value]').focus();
		}else{
			$('#searchForm').submit();
		}
	});
	
	//게시글 등록 유효성 검사
	$('#addWriteBtn').click(function(){
		if($('input[name=postName]').val().trim() == undefined || $('input[name=postName]').val().trim() == '' || $('input[name=postName]').val().trim() ==  null){
			html = "<span>제목을 입력해주세요.</span>";
			$('input[name=postName]').focus();
		}else if($('#cateSel').val().trim() == undefined || $('#cateSel').val().trim() == '' || $('#cateSel').val().trim() ==  null){
			html = "<span>카테고리를 선택해주세요.</span>";
			$('#cateSel').focus();
		}else if($('#contents').val().trim() == undefined || $('#contents').val().trim() == '' || $('#contents').val().trim() ==  null){
			html = "<span>내용을 입력해주세요.</span>";
			$('#contents').focus();
		}else{
			$('#addPost').submit();
		}
		msg(html);
	});
	
	//글제목 눌렀을때 -> 상세 게시글 보기
	$('.postDetail').click(function(){
		
		//해당 게시글 tr
		var postTr = $(this).parent().parent();
		//해당 게시글 코드
		var postCode = $(this).parent().parent().find('.postCode').val();
		//로그인 한 유저
		var loginUser = $('#likeBtn').val();
		
		postDetail(postCode);			//상세 게시글
		postComment(postCode);			//게시글 댓글
		likeBtnNum(postCode,loginUser);	//좋아요 갯수
		previousPost(postCode);			//이전 게시글
		nextPost(postCode)				//다음게시글
		
	});

	//이전글 눌렀을때
	$('#previousPost').click(function(){
		
		//이전글 게시글 코드
		var postCode = $(this).val();
		//로그인 한 유저
		var loginUser = $('#likeBtn').val();
		
		postDetail(postCode);			//상세 게시글
		postComment(postCode);			//게시글 댓글
		likeBtnNum(postCode,loginUser);	//좋아요 갯수
		previousPost(postCode);			//이전 게시글
		nextPost(postCode);				//다음 게시글	
	});
	
	//다음글 눌렀을때
	$('#nextPost').click(function(){
		
		//이전글 게시글 코드
		var postCode = $(this).val();
		//로그인 한 유저
		var loginUser = $('#likeBtn').val();
		
		postDetail(postCode);			//상세 게시글
		postComment(postCode);			//게시글 댓글
		likeBtnNum(postCode,loginUser);	//좋아요 갯수
		previousPost(postCode);			//이전 게시글
		nextPost(postCode);				//다음 게시글
	});	
	
	//게시글 수정 눌렀을때
	$('#postModify').click(function(){

		var loginName = $(this).val();				//로그인 한 유저 닉네임
		var postName = $('#postUserName').val();	//게시글 작성자 닉네임
		var postCode = $('#postDetailCode').val();	//게시글 코드
		
		if(loginName != postName){
			html = '<span>권한이 없습니다.</span>';
			msg(html);
		}else{
			$('#recentPost').hide();
			$('#joinForm').hide();
			$('#write').show();
			$('#postDetail').hide();
			
			$('#writeType').val('postModify');
			writeEditer();
			
			var request = $.ajax({
				  url: "/postDetail",
				  method: "POST",
				  data: { postCode : postCode },
				  dataType: "json"
				});
				 
				request.done(function( data ) {
					if(data != null && data != undefined){
						$('#postCode').val(data.postCode);
						$('#addPostName').val(data.postName);
						$('.note-editable').html(data.postContents);
						$('#cateSel').val(data.cateCode).prop('seleted',true);
					}			  
				});
				 
				request.fail(function( jqXHR, textStatus ) {
				  alert( "Request failed: " + textStatus );
				});			
		}		
	});
	
	//게시글 삭제 눌렀을때
	$('#postDelete').click(function(){
		
		var loginName = $(this).val();				//로그인한 유저 닉네임
		var postName = $('#postUserName').val();	//게시글 작성자 닉네임
		var postCode = $('#postDetailCode').val();	//게시글 코드
		
		if(loginName != postName){
			html = '<span>권한이 없습니다.</span>';
			msg(html);
		}else{		
			var result = confirm('정말 삭제하시겠습니까?');
			if(result){
				var request = $.ajax({
					url: "/postDelete",
					method: "POST",
					data: { postCode : postCode },
					dataType: "json"
				});
				
				request.done(function(data) {
					if(data > 0){
						location.reload();						
					}
				});
				
				request.fail(function( jqXHR, textStatus ) {
					alert( "Request failed: " + textStatus );
				});			
			}
		}
	});
	
	
});
