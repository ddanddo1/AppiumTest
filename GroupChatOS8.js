const { remote } = require('webdriverio');

const capabilities = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'Android',
  'appium:appPackage': 'com.kakao.talk',
  'appium:appActivity': '.activity.main.MainActivity',
  'appium:noReset': 'true',
  'appium:autoGrantPermissions': 'true', //Android에서 권한을 자동으로 허용
};

const wdOpts = {
  hostname: process.env.APPIUM_HOST || 'localhost',
  port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
  logLevel: 'info',
  capabilities,
};

async function clickElement(driver, xpath) {
  const element = await driver.$(xpath);
  await element.click();
}

async function setValue(driver, xpath, value) {
  const element = await driver.$(xpath);
  await element.setValue(value);
}

async function touchAction(driver, xpath, action) {
  const element = await driver.$(xpath);
  await element.touchAction(action);
}

async function runTest() {
  const driver = await remote(wdOpts);

  try {
    // 패키지명과 액티비티명을 찾아서 수정
    await clickElement(driver, '//*[@text="카카오톡"]');

    // 채팅 아이콘을 찾아서 클릭
    await clickElement(driver, '//*[@text="채팅"]');

    // + 아이콘을 찾아서 클릭 (XPath 값으로 수정)
    await clickElement(driver, '//android.widget.Button[@content-desc="대화 시작하기"]');

    // 일반 채팅 텍스트를 찾아서 클릭 (XPath 값으로 수정)
    await clickElement(driver, '//android.widget.TextView[@text="일반채팅"]');

    // 첫 번째 유저 클릭 (XPath 값으로 수정)
    await clickElement(driver, '(//android.widget.RelativeLayout[@resource-id="com.kakao.talk:id/deactive_background"])[1]/android.view.ViewGroup');

    // 두 번째 유저 클릭 (XPath 값으로 수정)
    await clickElement(driver, '(//android.widget.RelativeLayout[@resource-id="com.kakao.talk:id/deactive_background"])[2]/android.view.ViewGroup');

    // 유저 선택 후 다음 버튼 선택하기
    await clickElement(driver, '//*[@text="다음"]');

    // 그룹채팅방 정보 설정 확인 텍스트 찾아서 선택
    await clickElement(driver, '//*[@text="확인"]');

    for (let i = 1; i <= 2; i++) {
      // 텍스트 필드를 찾아서 n회 입력
      await setValue(driver, '//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]', `마이그레이션 테스트 텍스트 ${i}회 전송`);

      // 전송 버튼 클릭하기
      await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/send"]');
    }

     // 메시지 롱프레스 동작하기 or 모든 대화방에서 메시지 삭제
    for (let i = 1; i <= 2; i++) {
      touchAction(driver, `//android.widget.TextView[@resource-id="com.kakao.talk:id/message" and @text="마이그레이션 테스트 텍스트 ${i}회 전송"]`, 'longPress');
      await clickElement(driver, '//*[@text="삭제"]');
      if (i === 1) {
        await clickElement(driver, '//*[@text="확인"]');
        await clickElement(driver, '//*[@text="삭제"]');
      } else {
        await clickElement(driver, '//*[@text="이 기기에서 삭제"]');
        await clickElement(driver, '//*[@text="확인"]');
        await clickElement(driver, '//*[@text="삭제하기"]');
        await clickElement(driver, '//*[@text="삭제"]');
      }
    }  

    // 링크 전송하기
    await setValue(driver, '//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]', `naver.com`);
      
    // 전송 버튼 클릭하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/send"]');

    // 하이퍼링크 말풍선 전송하기
    await setValue(driver, '//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]', `보이스톡, 페이스톡, 110-1234-1234, 010-9965-4736`);
      
    // 전송 버튼 클릭하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/send"]');

    // 텍스트만 500자 전송
    await setValue(driver, '//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]', `500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자
    500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자
    500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자
    500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자
    500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자`);
      
    // 전송 버튼 클릭하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/send"]');

    // 이모티콘 탭 선택
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/emoticon_button"]')

    // 이모티콘 더블탭하여 전송
    for (let i = 1; i <= 4; i++) {
      await touchAction(driver, `(//android.widget.ImageView[@resource-id="com.kakao.talk.emoticon:id/emoticon_icon"])[${i}]`, [
        { action: 'tap', x: 0, y: 0 },
        { action: 'tap', x: 0, y: 0 }
        ]);
      }

    // 텍스트 입력
    await setValue(driver, '//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]', `이모티콘과 함께 전송`);

    // 이모티콘 탭 선탭 후 더블탭으로 이모티콘 전송
    await touchAction(driver, `(//android.widget.ImageView[@resource-id="com.kakao.talk.emoticon:id/emoticon_icon"])[1]`, [
      { action: 'tap', x: 0, y: 0 },
      { action: 'tap', x: 0, y: 0 }
      ]);

    // 기본 이모티콘 전송
    await setValue(driver, '//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]', `(하하), (하트뿅), (우와), (심각)`);

    // 전송 버튼 클릭하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/send"]');

    // 기본 이모티콘 + 텍스트 입력 전송
    await setValue(driver, '//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]', `(하하), (하트뿅), (우와), (심각) + 기본이모티콘과 텍스트 같이 전송`);

    // 전송 버튼 클릭하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/send"]');

    /* ------------텍스트 500자 입력 후 이모티콘 진입 시 얼럿 노출 확인 여부에 대한 구현 여부가 가능한지 생각중..... */
    

    /*------------------------------------------------------------------------------------------ */
    // +메뉴 선택하기
    // await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 앨범 선택하기
    // await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[1]')
    
    // +메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 카메라 항목 선택
    await clickElement (driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[2]');

    // 사진촬영으로 이동
    await clickElement (driver,'//*[@text="사진 촬영"]');

    // 사진 촬영 시작
    await clickElement (driver, '//GLButton[@content-desc="NONE" and @text="셔터"]')
    
    // 3초 대기 후 전송
    await driver.pause(3000);
    // 사진 촬영 확인 후 전송
    await clickElement (driver, '//*[@text="확인"]');
    // 3초 대기 후 전송
    await driver.pause(3000);
    await clickElement (driver, '//*[@text="전송"]');
    
    //+메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 카메라 항목 선택
    await clickElement (driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[2]');

    // 동영상 촬영으로 이동
    await clickElement (driver, '//*[@text="동영상 촬영"]');

    // 동영상 촬영 시작 및 종료
    await clickElement (driver, '//GLButton[@content-desc="NONE" and @text="녹화"]');
    // 10초 대기
    await driver.pause(10000);
    await clickElement (driver, '//GLButton[@content-desc="NONE" and @text="중지"]');

    // 동영상 확인 후 전송
    await clickElement (driver, '//*[@text="확인"]');
    await clickElement (driver, '//*[@text="전송"]');

    // 10초 대기
    await driver.pause(10000);

    //+메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 통화하기 선택
    await clickElement (driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[4]');

    // 보이스톡 선책
    await clickElement (driver, '//*[@text="보이스톡"]');
    
    // 10초 대기    
    await driver.pause(10000);
    
    // 보이스톡 종료
    await clickElement (driver, '//android.widget.Button[@content-desc="통화 종료"]');

    //+메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 통화하기 선택
    await clickElement (driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[4]');

    // 페이스톡 선책
    await clickElement (driver, '//*[@text="페이스톡"]');

    // 10초 대기
    await driver.pause(10000);

    // 페이스톡 종료
    await clickElement (driver, '//android.widget.Button[@content-desc="통화 종료"]');
    
    //+메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 예약메시지 선택
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[6]');

    // 예약메시지 텍스트 필드 선택 후 텍스트 입력 후 예약
    await setValue(driver, '//android.widget.EditText[@resource-id="com.kakao.talk.jordy:id/text_content"]', "마이그레이션 테스트 예약메시지");
    await clickElement(driver, '//*[@text="예약"]');

    //+메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 일정 선택하기
    await clickElement (driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[7]');

    // 일정 등록하기
    await clickElement (driver, '//*[@text="일정 등록"]');

    // 일정 제목 텍스트 필드 선택 후 텍스트 입력
    await setValue(driver, '//android.widget.EditText[@resource-id="com.kakao.talk.calendar:id/event_title"]', "마이그레이션 일정 제목");

    // 일정 저장
    await clickElement (driver, '//*[@text="저장"]');

    //+메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 일정 선택하기
    await clickElement (driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[7]');

    // 할 일 등록하기
    await clickElement (driver, '//*[@text="할 일 등록"]');

    // 일정 제목 텍스트 필드 선택 후 텍스트 입력
    await setValue(driver, '//android.widget.EditText[@resource-id="com.kakao.talk.jordy:id/content_edit"]', "마이그레이션 할 일 제목");

    // 일정 저장
    await clickElement (driver, '//*[@text="저장"]');

    //+메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 지도 선택하기
    await clickElement (driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[8]');

    // 지도 전송하기
    await clickElement (driver, '//android.widget.LinearLayout[@resource-id="com.kakao.talk:id/box_wrap"]');
   
    // +메뉴 다음으로 이동
    await clickElement (driver, '//android.widget.ImageView[@content-desc="다음"]');

    // 캡처 선택하기
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[1]');

    // 캡처 영역 지정
    await clickElement(driver, '//android.widget.LinearLayout[@resource-id="com.kakao.talk:id/container"]/android.widget.LinearLayout');
    await clickElement(driver, '//android.widget.TextView[@resource-id="com.kakao.talk:id/address"]');

    // 저장하기
    await clickElement(driver, '//android.widget.ImageButton[@content-desc="저장하기"]');
    
    //+메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 캡처 선택하기
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[1]');

    // 캡처 영역 지정
    await clickElement(driver, '//android.widget.LinearLayout[@resource-id="com.kakao.talk:id/container"]/android.widget.LinearLayout');
    await clickElement(driver, '//android.widget.TextView[@resource-id="com.kakao.talk:id/address"]');
    // 공유하기
    await clickElement(driver, '//android.widget.ImageButton[@content-desc="공유하기"]');
    await clickElement(driver, '(//android.view.View[@resource-id="com.kakao.talk:id/profile"])[1]');
    await setValue(driver, '//android.widget.EditText[@resource-id="com.kakao.talk:id/edit_text"]', "마이그레이션 캡처 공유");
    await clickElement(driver, '//*[@text="보내기"]');

    //10초 대기후 시작
    await driver.pause(10000);

    //+메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 음성메시지 선택
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[2]');

    // 간편 녹음 버튼 사용 선택
    await clickElement(driver, '//android.widget.CheckBox[@resource-id="com.kakao.talk:id/check_box"]');

    // 음성메시지 녹음 시작
    await clickElement(driver, '//android.widget.ImageButton[@content-desc="녹음 시작"]');
    //10초 대기
    await driver.pause(10000);
    // 전송
    await clickElement(driver, '//android.widget.Button[@content-desc="전송"]');

    // 간편 녹음 버튼 선택 하여 전송
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/optional_send"]');
    await clickElement(driver, '//android.widget.ImageButton[@resource-id="com.kakao.talk:id/record"]');
    await driver.pause(10000);
    await clickElement(driver, '//android.widget.Button[@content-desc="전송"]');

    //+메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 카카오 프로필 단일 전송
    await clickElement(driver,'(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[3]');
    await clickElement(driver, '//*[@text="카카오톡 프로필 보내기"]');
    await clickElement(driver, '(//android.widget.RelativeLayout[@resource-id="com.kakao.talk:id/deactive_background"])[1]/android.view.ViewGroup');
    await clickElement(driver, '//*[@text="확인"]');

    // 카카오 프로필 2개 이상 전송
    await clickElement(driver,'(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[3]');
    await clickElement(driver, '//*[@text="카카오톡 프로필 보내기"]');
    await clickElement(driver, '(//android.widget.RelativeLayout[@resource-id="com.kakao.talk:id/deactive_background"])[1]/android.view.ViewGroup');
    await clickElement(driver, '(//android.widget.RelativeLayout[@resource-id="com.kakao.talk:id/deactive_background"])[2]/android.view.ViewGroup');
    await clickElement(driver, '(//android.widget.RelativeLayout[@resource-id="com.kakao.talk:id/deactive_background"])[3]/android.view.ViewGroup');
    await clickElement(driver, '//*[@text="확인"]');

    // 연락처 단일 전송
    await clickElement(driver,'(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[3]');
    await clickElement(driver, '//*[@text="연락처 보내기"]');
    await clickElement(driver, '//*[@text="ㄱ.마그 자동화 연락처"]');
    await clickElement(driver, '//*[@text="전송"]');

    //+메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 파일 선택하기
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[4]');

    // 파일에서 선택 후 항목 1 전송
    await clickElement(driver, '//*[@text="파일에서 선택"]');
    await clickElement(driver,'(//android.widget.ImageView[@resource-id="com.android.documentsui:id/icon_thumb"])[1]');
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[4]');

    /* 앨범에서 선택하기
    await clickElement(driver, '//*[@text="앨범에서 선택"]');
    await clickElement(driver,'(//android.widget.ImageView[@resource-id="com.android.documentsui:id/icon_thumb"])[1]');
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[4]');
    */

    // 최근 보낸 파일 항목 전송
    await clickElement(driver,'//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View[4]/android.view.View[1]/android.widget.Button');

    // 최근에 보낸 파일 전체 삭제
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[4]');
    await clickElement(driver, '//*[@text="전체삭제"]');
    await clickElement(driver, '//*[@text="삭제"]');

    // 뷰 아웃
    await driver.pressKeyCode(4);

    // 5초 대기 
    await driver.pause(5000);

    //뮤직 선택하기
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[5]');
    await driver.pause(5000);
    await setValue(driver, '//android.widget.EditText[@resource-id="search__word"]', "Hype boy");
    await clickElement(driver, '//android.widget.Button[@text="찾기"]');

    // 뮤직 단일 전송 
    await clickElement(driver, '//android.widget.ListView[@resource-id="commonList"]/android.view.View[1]/android.view.View[2]/android.view.View[1]');
    await clickElement(driver, '//android.widget.TextView[@text="보내기1"]');

    // 5초 대기 
    await driver.pause(5000);
    
    //+메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]')

    //라이브톡 선택
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[6]');
    await clickElement(driver, '//android.widget.Button[@resource-id="com.kakao.talk.vox:id/livetalk_start_button"]');
    await driver.pause(10000);
    await driver.touchAction([
        { action: 'tap', x: 100, y: 100 }  ]); // 좌표는 화면에서 원하는 위치로 설정
    await clickElement(driver, '//*[@text="종료"]');
    await clickElement(driver, '//*[@text="확인"]');

    // #버튼 제비뽑기 전송
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/search_sharp_button"]');
    await clickElement(driver, '//android.widget.TextView[@resource-id="com.kakao.talk:id/keyword" and @text="제비뽑기"]');
    await clickElement(driver, '//android.widget.Button[@resource-id="com.kakao.talk.jordy:id/share"]');

    // #버튼 제비뽑기 전송
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/search_sharp_button"]');
    await clickElement(driver, '//android.widget.TextView[@resource-id="com.kakao.talk:id/keyword" and @text="날씨"]');
    await clickElement(driver, '//android.widget.Button[@resource-id="com.kakao.talk.jordy:id/share"]');
    
    // #버튼 제비뽑기 전송
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/search_sharp_button"]');
    await clickElement(driver, '//android.widget.TextView[@resource-id="com.kakao.talk:id/keyword" and @text="D-DAY"]');
    await clickElement(driver, '//android.widget.Button[@resource-id="com.kakao.talk.jordy:id/share"]');

    // #버튼 텍스트 직접 입력 전송
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/search_sharp_button"]');
    await setValue(driver, '//android.widget.MultiAutoCompleteTextView[@content-desc="샵검색, 텍스트 필드"]', `카카오`);
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/search"]');
    await clickElement(driver, '//android.widget.Button[@resource-id="com.kakao.talk.jordy:id/share"]');

  } finally {
    await driver.pause(3000);
    await driver.deleteSession();
  }
}

runTest().catch(console.error);