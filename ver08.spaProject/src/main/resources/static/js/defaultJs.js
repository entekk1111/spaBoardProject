/**
 * 
 */

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
				height: 250,                 	// 에디터 높이
				minHeight: null,            	// 최소 높이
				maxHeight: null,             	// 최대 높이
				width: 566,
				focus: true,                 	// 에디터 로딩후 포커스를 맞출지 여부
				lang: "ko-KR",					// 한글 설정
				placeholder: '최대 500자까지 쓸 수 있습니다',	//placeholder 설정
				toolbar: [
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
	
	//메인 화면
	$('.hide').hide();
	$('#recentPost').show();
	
	//회원가입 버튼 눌렀을때
	$('#joinBtn').click(function(){
		$('.hide').hide();
		$('#joinForm').show();
	});
	
	//최신 게시글 눌렀을때
	$('#recentPostBtn').click(function(){
		$('.hide').hide();
		$('#recentPost').show();
	});

	
	//글쓰기 눌렀을때
	$('#writeBtn').click(function(){
		$('.hide').hide();	
		$('#write').show();
		writeEditer();
	});
	
	//글제목 눌렀을때
	$('.postDetail').click(function(){
		$('.hide').hide();
		$('#postDetail').show();		
	});	
	
});