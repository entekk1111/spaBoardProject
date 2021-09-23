/**
 * 로그인
 */
$(function(){
	
	var html = '';
	
	//경고 창
	var msg = function(html){
		$('#loginMsg').html('');
		$('#loginMsg').append(html);
		$('#postMsg').show();
		
	}
	
	//로그인
	$('#loginBtn').click(function(){
		$('#loginMsg').html('');
		var html = '';
		var userEmail = $('#loginUserEmail').val();
		var userPw = $('#loginUserPw').val();
		var postCode = $('#postDetailCode').val();
		if(! email_check(userEmail)){
			html = '<span>잘못된 형식의 이메일입니다.</span>';
			msg(html);
			$('#loginUserEmail').focus();				
			
		}else if(userPw == '' || userPw == null || userPw == undefined){
			html = '<span>비밀번호를 입력해주세요.</span>';
			msg(html);
			$('#loginUserPw').focus();
		}else{
			var request = $.ajax({
				  url: "/login",
				  method: "POST",
				  data: { 
					  	  userEmail : userEmail,
					  	  userPw 	: userPw
					  	},
				  dataType: "json"
				});				 
				request.done(function( data ) {
					if(data){
						location.reload();
					}else{
						html = '<span>아이디나 비밀번호를 확인해주세요.</span>';
					}
				});				 
				request.fail(function( jqXHR, textStatus ) {
					html = '<span>아이디나 비밀번호를 확인해주세요.</span>';
					msg(html);
				});
		}
		
	});
	
	function email_check( email ) { 
		var regex=/([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/; 
		
		if(regex.test(email)){
			return true;
		}; 
	}

});