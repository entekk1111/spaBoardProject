/**
 * 회원가입
 */

$(function(){
	var html = '';
	var msg = function(html){
		$('#postMsg').html('');
		$('#postMsg').append(html);
		
			$('#postMsg').attr('class','show');
			  setTimeout(() => {
				  $('#postMsg').removeAttr('class','show');
			  }, 1000)
	}
	
	//이메일 형식 체크 함수
	var email_check = function(email) { 
		var regex=/([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/; 
		
		if(regex.test(email)){
			return true;
		}; 
	}
	
	var emailCheckVal = false;
	var nameCheckVal = false;
		
	//이메일 형식 체크
	var email = '';
	$('#userEmail').blur(function(){
		email = $('#userEmail').val();
		
		if(email == '' || email == undefined) return;
		
		if(! email_check(email)){
			html = '<span>잘못된 형식의 이메일 주소입니다.</span>';
			$('#userEmail').focus();
		}
		msg(html);
	});
	
	
	//이메일 중복 체크
	$('#userEmailCheck').click(function(){
		var emailCheck = $('#userEmail').val();
		
		if(emailCheck == '' || emailCheck == undefined){
			html = '<span>이메일 주소를 입력해주세요.</span>';
		}else{
			
			if(! email_check(email)){
				html = '<span>잘못된 형식의 이메일 주소입니다.</span>';
				$('#userEmail').focus();
			}else{
				var request = $.ajax({
					url: "/emailCheck",
					method: "POST",
					data: { emailCheck : emailCheck },
					dataType: "json"
				});
				
				request.done(function( data ) {
					console.log(data);
					if(data == 0){
						html = '<span>사용가능한 이메일입니다.</span>';
						$('#userEmail').prop('disabled','disabled');
						$('#emailValue').val(emailCheck);
						$('#userPw').focus();
						emailCheckVal = true;
					}else{
						html = '<span>중복된 이메일입니다.</span>';
						$('#userEmail').val('');
						$('#userEmail').focus();
						emailCheckVal = false;
					}		
					msg(html);
				});
				
				request.fail(function( jqXHR, textStatus ) {
					alert( "Request failed: " + textStatus );
				});				
			}		
		}
		msg(html);
	})
	
	//닉네임 중복 체크
	$('#userNameCheck').click(function(){
		var userName = $('#userName').val();
		
		if(userName == '' || userName == undefined){
			html = '<span>닉네임을 입력해주세요.</span>';
			msg(html);
		}else{
			var request = $.ajax({
				url: "/nameCheck",
				method: "POST",
				data: { userName : userName },
				dataType: "json"
			});
			
			request.done(function( data ) {
				if(data == 0){
					html = '<span>사용가능한 닉네임입니다.</span>';
					msg(html);
					$('#userNameValue').val(userName);
					$('#userName').attr('disabled','true');
					nameCheckVal = true;
				}else{
					html = '<span>중복된 닉네임입니다.</span>';
					msg(html);
					$('#userName').val('');
					$('#userName').focus();
					nameCheckVal = false;
				}
			});
			
			request.fail(function( jqXHR, textStatus ) {
				alert( "Request failed: " + textStatus );
			});
		}
	})
	
	//비밀번호 형식 체크
	$('#userPw').blur(function(){
		var userPw = $('#userPw').val();
		
		
		if(userPw != '' && userPw != undefined){
			var pwCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/;
			
			//비밀번호 형식이 맞으면 통과
			if(pwCheck.test(userPw)){
				$('#userPwCheck').focus();			
			}else{
				html = '<span>비밀번호 형식이 맞지 않습니다.</span>';
				msg(html);
				$('#userPw').focus();
			}
		}
	});
	
	$('#userPwCheck').blur(function(){
		var userPw = $('#userPw').val();
		var userPwCheck = $('#userPwCheck').val();
		
		if(userPw != userPwCheck){
			html = '<span>비밀번호를 확인해주세요.</span>';
			msg(html);
			$(this).val('');
		}
	});

	
	//회원가입 전송
	$('#joinUserInfoBtn').click(function(){
		//유효성 검사
		if(!emailCheckVal){
			html = '이메일 중복체크를 해주세요.';
		}else if(!nameCheckVal){
			html = '닉네임 중복체크를 해주세요.';
		}else if($('#userPw').val() == '' || $('#userPw').val() == undefined || $('#userPw').val() == null){
			html = '비밀번호를 입력해주세요.';
			$('#userPw').focus();
		}else if($('#userPwCheck').val() == '' || $('#userPwCheck').val() == undefined || $('#userPwCheck').val() == null){
			html = '비밀번호를 확인해주세요.';
			$('#userPwCheck').focus();
		}else{
			
			var request = $.ajax({
				  url: "/addUser",
				  method: "POST",
				  data: { 
					  userEmail : $('#userEmail').val()
					  ,userPw : $('#userPw').val()
					  ,userName : $('#userName').val()
				  },
				  dataType: "json"
				});
				 
				request.done(function( data ) {
				  if(data){
					  $('#recentPost').show();
					  $('#joinForm').hide();
					  $('input').val('');
					  $('input').removeAttr('disabled');
				  }else{
					  alert('오류가 발생했습니다.');
				  }
				});
				 
				request.fail(function( jqXHR, textStatus ) {
				  alert( "오류가 발생했습니다.");
				});
		}
		msg(html);
		
	});
	

});