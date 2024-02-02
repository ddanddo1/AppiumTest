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

async function clickItem(driver, xpath) {
  const item = await driver.$(xpath);
  await item.click();
}

async function runTest() {
  const driver = await remote(wdOpts);

  try {
    // 패키지명과 액티비티명을 찾아서 수정
    await clickItem(driver, '//*[@text="카카오톡"]');

    // 채팅 아이콘을 찾아서 클릭
    await clickItem(driver, '//*[@text="채팅"]');

    // + 아이콘을 찾아서 클릭 (XPath 값으로 수정)
    await clickItem(driver, '//android.widget.Button[@content-desc="대화 시작하기"]');

    // 일반 채팅 텍스트를 찾아서 클릭 (XPath 값으로 수정)
    await clickItem(driver, '//android.widget.TextView[@text="일반채팅"]');

    // 첫 번째 유저 클릭 (XPath 값으로 수정)
    await clickItem(driver, '(//android.widget.RelativeLayout[@resource-id="com.kakao.talk:id/deactive_background"])[1]/android.view.ViewGroup');

    // 두 번째 유저 클릭 (XPath 값으로 수정)
    await clickItem(driver, '(//android.widget.RelativeLayout[@resource-id="com.kakao.talk:id/deactive_background"])[2]/android.view.ViewGroup');

    // 유저 선택 후 다음 버튼 선택하기
    await clickItem(driver, '//*[@text="다음"]');

    // 그룹채팅방 정보 설정 확인 텍스트 찾아서 선택
    await clickItem(driver, '//*[@text="확인"]');

    for (let i = 1; i <= 2; i++) {
      // 텍스트 필드를 찾아서 n회 입력
      const textField = await driver.$('//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]'); // XPath 값으로 실제 화면에 대한 정보로 수정
      await textField.setValue(`마이그레이션 테스트 텍스트 ${i}회 전송`); // 입력할 텍스트 내용으로 수정

      // 전송 버튼 클릭하기
      await clickItem(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/send"]');
    }

     // 메시지 롱프레스 동작하기 or 모든 대화방에서 메시지 삭제
    for (let i = 1; i <= 1; i++) {
      const message = await driver.$(`//android.widget.TextView[@resource-id="com.kakao.talk:id/message" and @text="마이그레이션 테스트 텍스트 ${i}회 전송"]`);
      await message.touchAction('longPress') 
      await clickItem(driver, '//*[@text="삭제"]');
      await clickItem(driver, '//*[@text="확인"]');
      await clickItem(driver, '//*[@text="삭제"]');
    }  
    // 메시지 롱프레스 동작하기 or 모든 대화방에서 메시지 삭제
    for (let i = 2; i <= 2; i++) {
      const message = await driver.$(`//android.widget.TextView[@resource-id="com.kakao.talk:id/message" and @text="마이그레이션 테스트 텍스트 ${i}회 전송"]`);
      await message.touchAction('longPress') 
      await clickItem(driver, '//*[@text="삭제"]');
      await clickItem(driver, '//*[@text="이 기기에서 삭제"]');
      await clickItem(driver, '//*[@text="확인"]');
      await clickItem(driver, '//*[@text="삭제하기"]');
      await clickItem(driver, '//*[@text="삭제"]');
    }  

      // 링크 전송하기
      const textField2 = await driver.$('//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]'); // XPath 값으로 실제 화면에 대한 정보로 수정
      await textField2.setValue(`naver.com`); // 입력할 텍스트 내용으로 수정
      
    // 전송 버튼 클릭하기
    await clickItem(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/send"]');

    // 하이퍼링크 말풍선 전송하기
    const textField3 = await driver.$('//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]'); // XPath 값으로 실제 화면에 대한 정보로 수정
    await textField3.setValue(`보이스톡, 페이스톡, 110-1234-1234, 010-9965-4736`); // 입력할 텍스트 내용으로 수정
      
    // 전송 버튼 클릭하기
    await clickItem(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/send"]');

    // 텍스트만 500자 전송
    const textField4 = await driver.$('//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]'); // XPath 값으로 실제 화면에 대한 정보로 수정
    await textField4.setValue(`500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자
    500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자
    500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자
    500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자
    500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자`); // 입력할 텍스트 내용으로 수정
      
    // 전송 버튼 클릭하기
    await clickItem(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/send"]');

    // 이모티콘 탭 선택
    await clickItem(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/emoticon_button"]')

    // 이모티콘 더블탭하여 전송
    for (let i = 1; i <= 4; i++) {
      const emoticonIcon = await driver.$(`(//android.widget.ImageView[@resource-id="com.kakao.talk.emoticon:id/emoticon_icon"])[${i}]`);
      await emoticonIcon.touchAction([
        { action: 'tap', x: 0, y: 0 },
        { action: 'tap', x: 0, y: 0 }
        ]);
      }

    // 텍스트 입력
    const textField5 = await driver.$('//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]'); // XPath 값으로 실제 화면에 대한 정보로 수정
    await textField5.setValue(`이모티콘과 함께 전송`); // 입력할 텍스트 내용으로 수정

    // 이모티콘 탭 선탭 후 더블탭으로 이모티콘 전송
    const emoticonIcon = await driver.$(`(//android.widget.ImageView[@resource-id="com.kakao.talk.emoticon:id/emoticon_icon"])[1]`);
    await emoticonIcon.touchAction([
      { action: 'tap', x: 0, y: 0 },
      { action: 'tap', x: 0, y: 0 }
      ]);

    // 기본 이모티콘 전송
    const textField10 = await driver.$('//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]'); // XPath 값으로 실제 화면에 대한 정보로 수정
    await textField10.setValue(`(하하), (하트뿅), (우와), (심각)`);

    // 전송 버튼 클릭하기
    await clickItem(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/send"]');

    // 기본 이모티콘 + 텍스트 입력 전송
    const textField11 = await driver.$('//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]'); // XPath 값으로 실제 화면에 대한 정보로 수정
    await textField11.setValue(`(하하), (하트뿅), (우와), (심각) + 기본이모티콘과 텍스트 같이 전송`);

    // 전송 버튼 클릭하기
    await clickItem(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/send"]');

    /* ------------텍스트 500자 입력 후 이모티콘 진입 시 얼럿 노출 확인 여부에 대한 구현 여부가 가능한지 생각중..... */
    

    /*------------------------------------------------------------------------------------------ */
    // +메뉴 선택하기
    // await clickItem(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 앨범 선택하기
    // await clickItem(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[1]')
    
    // +메뉴 선택하기
    await clickItem(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 카메라 항목 선택
    await clickItem (driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[2]');

    // 사진촬영으로 이동
    await clickItem (driver,'//*[@text="사진 촬영"]');

    // 사진 촬영 시작
    await clickItem(driver, '//android.view.View[@resource-id="com.sec.android.app.camera:id/bottom_background"]');

    // 사진 촬영 확인 후 전송
    await clickItem (driver, '//*[@text="확인"]');
    await clickItem (driver, '//*[@text="전송"]');
    
    //+메뉴 선택하기
    await clickItem(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 카메라 항목 선택
    await clickItem (driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[2]');

   // 동영상 촬영으로 이동
   await clickItem (driver, '//*[@text="동영상 촬영"]');

   // 동영상 촬영 시작 및 종료
   await clickItem (driver, '//android.view.View[@resource-id="com.sec.android.app.camera:id/bottom_background"]');
   // 10초 대기
   await driver.pause(10000);
   await clickItem (driver, '//android.widget.ImageButton[@content-desc="녹화 중지"]');

   // 동영상 확인 후 전송
   await clickItem (driver, '//*[@text="확인"]');
   await clickItem (driver, '//*[@text="전송"]');

    //+메뉴 선택하기
    await clickItem(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 통화하기 선택
    await clickItem (driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[4]');

    // 보이스톡 선책
    await clickItem (driver, '//*[@text="보이스톡"]');
    // 10초 대기
    await driver.pause(10000);
    // 보이스톡 종료
    await clickItem (driver, '//android.widget.Button[@content-desc="통화 종료"]');

    //+메뉴 선택하기
    await clickItem(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 통화하기 선택
    await clickItem (driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[4]');

    // 페이스톡 선책
    await clickItem (driver, '//*[@text="페이스톡"]');
    // 10초 대기
    await driver.pause(10000);
    // 페이스톡 종료
    await clickItem (driver, '//android.widget.Button[@content-desc="통화 종료"]');
    
    //+메뉴 선택하기
    await clickItem(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 예약메시지 선택
    await clickItem(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[6]');

    // 예약메시지 텍스트 필드 선택 후 텍스트 입력 후 예약
    const textField6 = await driver.$('//android.widget.EditText[@resource-id="com.kakao.talk.jordy:id/text_content"]');
    await textField6.setValue("마이그레이션 테스트 예약메시지");

    await clickItem(driver, '//*[@text="예약"]');

    //+메뉴 선택하기
    await clickItem(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 일정 선택하기
    await clickItem (driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[7]');

    // 일정 등록하기
    await clickItem (driver, '//*[@text="일정 등록"]');

    // 일정 제목 텍스트 필드 선택 후 텍스트 입력
    const textField7 = await driver.$('//android.widget.EditText[@resource-id="com.kakao.talk.calendar:id/event_title"]');
    await textField7.setValue("마이그레이션 일정 제목");

    // 일정 저장
    await clickItem (driver, '//*[@text="저장"]');

    //+메뉴 선택하기
    await clickItem(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 일정 선택하기
    await clickItem (driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[7]');

    // 할 일 등록하기
    await clickItem (driver, '//*[@text="할 일 등록"]');

    // 일정 제목 텍스트 필드 선택 후 텍스트 입력
    const textField8 = await driver.$('//android.widget.EditText[@resource-id="com.kakao.talk.jordy:id/content_edit"]');
    await textField8.setValue("마이그레이션 할 일 제목");

    // 일정 저장
    await clickItem (driver, '//*[@text="저장"]');

    //+메뉴 선택하기
    await clickItem(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 지도 선택하기
    await clickItem (driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[8]');

    // 지도 전송하기
    await clickItem (driver, '//android.widget.LinearLayout[@resource-id="com.kakao.talk:id/box_wrap"]');

    // 캡처 선택하기
    await clickItem(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[9]');

    // 캡처 영역 지정
    await clickItem(driver, '//android.widget.LinearLayout[@resource-id="com.kakao.talk:id/container"]/android.widget.LinearLayout');
    await clickItem(driver, '//android.widget.TextView[@resource-id="com.kakao.talk:id/address"]');

    // 저장하기
    await clickItem(driver, '//android.widget.ImageButton[@content-desc="저장하기"]');
    //+메뉴 선택하기
    await clickItem(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 캡처 선택하기
    await clickItem(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[9]');

    // 캡처 영역 지정
    await clickItem(driver, '//android.widget.LinearLayout[@resource-id="com.kakao.talk:id/container"]/android.widget.LinearLayout');
    await clickItem(driver, '//android.widget.TextView[@resource-id="com.kakao.talk:id/address"]');
    // 공유하기
    await clickItem(driver, '//android.widget.ImageButton[@content-desc="공유하기"]');
    await clickItem(driver, '(//android.view.View[@resource-id="com.kakao.talk:id/profile"])[1]');
    const textField9 = await driver.$('//android.widget.EditText[@resource-id="com.kakao.talk:id/edit_text"]');
    await textField9.setValue("마이그레이션 캡처 공유");
    await clickItem(driver, '//*[@text="보내기"]');

    //10초 대기후 시작
    await driver.pause(10000);

    //+메뉴 선택하기
    await clickItem(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 음성메시지 선택
    await clickItem(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[10]');

    // 간편 녹음 버튼 사용 선택
    await clickItem(driver, '//android.widget.CheckBox[@resource-id="com.kakao.talk:id/check_box"]');

    // 음성메시지 녹음 시작
    await clickItem(driver, '//android.widget.ImageButton[@content-desc="녹음 시작"]');
    //10초 대기
    await driver.pause(10000);
    // 전송
    await clickItem(driver, '//android.widget.Button[@content-desc="전송"]');

    // 간편 녹음 버튼 선택 하여 전송
    await clickItem(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/optional_send"]');
    await clickItem(driver, '//android.widget.ImageButton[@resource-id="com.kakao.talk:id/record"]');
    await driver.pause(10000);
    await clickItem(driver, '//android.widget.Button[@content-desc="전송"]');

    //+메뉴 선택하기
    await clickItem(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 카카오 프로필 단일 전송
    await clickItem(driver,'(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[11]');
    await clickItem(driver, '//*[@text="카카오톡 프로필 보내기"]');
    await clickItem(driver, '(//android.widget.RelativeLayout[@resource-id="com.kakao.talk:id/deactive_background"])[1]/android.view.ViewGroup');
    await clickItem(driver, '//*[@text="확인"]');

    // 카카오 프로필 2개 이상 전송
    await clickItem(driver,'(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[11]');
    await clickItem(driver, '//*[@text="카카오톡 프로필 보내기"]');
    await clickItem(driver, '(//android.widget.RelativeLayout[@resource-id="com.kakao.talk:id/deactive_background"])[1]/android.view.ViewGroup');
    await clickItem(driver, '(//android.widget.RelativeLayout[@resource-id="com.kakao.talk:id/deactive_background"])[2]/android.view.ViewGroup');
    await clickItem(driver, '(//android.widget.RelativeLayout[@resource-id="com.kakao.talk:id/deactive_background"])[3]/android.view.ViewGroup');
    await clickItem(driver, '//*[@text="확인"]');

    // 연락처 단일 전송
    await clickItem(driver,'(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[11]');
    await clickItem(driver, '//*[@text="연락처 보내기"]');
    await clickItem(driver, '//*[@text="ㄱ.마그 자동화 연락처"]');
    await clickItem(driver, '//*[@text="전송"]');

    //+메뉴 선택하기
    await clickItem(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 파일 선택하기
    await clickItem(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[12]');

    // 파일에서 선택 후 항목 1 전송
    await clickItem(driver, '//*[@text="파일에서 선택"]');
    await clickItem(driver,'(//android.widget.LinearLayout[@resource-id="com.google.android.documentsui:id/item_root"])[1]/android.widget.LinearLayout');
    await clickItem(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[12]');

    /* 앨범에서 선택하기
    await clickItem(driver, '//*[@text="앨범에서 선택"]');
    await clickItem(driver,'(//android.widget.ImageView[@resource-id="com.android.documentsui:id/icon_thumb"])[1]');
    await clickItem(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[4]');
    */

    // 최근 보낸 파일 항목 전송
    await clickItem(driver,'//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View[4]/android.view.View[1]/android.widget.Button');

    // 최근에 보낸 파일 전체 삭제
    await clickItem(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[12]');
    await clickItem(driver, '//*[@text="전체삭제"]');
    await clickItem(driver, '//*[@text="삭제"]');

    // 뷰 아웃
    await driver.touchAction([
      { action: 'tap', x: 200, y: 100 } ]);

    // +메뉴 다음으로 이동
    await clickItem (driver, '//android.widget.ImageView[@content-desc="다음"]');

    //뮤직 선택하기
    await clickItem(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[1]');
    await clickItem(driver, '//android.widget.EditText[@resource-id="search__word"]');
    await clickItem(driver, '//*[@text="Hype Boy"]');

    // 뮤직 단일 전송 
    await clickItem(driver, '//android.widget.ListView[@resource-id="commonList"]/android.view.View[1]/android.view.View[2]/android.view.View[1]');
    await clickItem(driver, '//android.widget.TextView[@text="보내기1"]');

    //+메뉴 선택하기
    await clickItem(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]')

    //라이브톡 선택
    await clickItem(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[2]');
    await clickItem(driver, '//android.widget.Button[@resource-id="com.kakao.talk.vox:id/livetalk_start_button"]');
    await driver.pause(10000);
    await driver.touchAction([
        { action: 'tap', x: 100, y: 100 }  ]); // 좌표는 화면에서 원하는 위치로 설정
    await clickItem(driver, '//*[@text="종료"]');
    await clickItem(driver, '//*[@text="확인"]');

    // #버튼 제비뽑기 전송
    await clickItem(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/search_sharp_button"]');
    await clickItem(driver, '//android.widget.TextView[@resource-id="com.kakao.talk:id/keyword" and @text="제비뽑기"]');
    await clickItem(driver, '//android.widget.Button[@resource-id="com.kakao.talk.jordy:id/share"]');

    // #버튼 제비뽑기 전송
    await clickItem(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/search_sharp_button"]');
    await clickItem(driver, '//android.widget.TextView[@resource-id="com.kakao.talk:id/keyword" and @text="날씨"]');
    await clickItem(driver, '//android.widget.Button[@resource-id="com.kakao.talk.jordy:id/share"]');
    
    // #버튼 제비뽑기 전송
    await clickItem(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/search_sharp_button"]')
    await clickItem(driver, '//android.widget.TextView[@resource-id="com.kakao.talk:id/keyword" and @text="D-DAY"]');
    await clickItem(driver, '//android.widget.Button[@resource-id="com.kakao.talk.jordy:id/share"]');

    // #버튼 텍스트 직접 입력 전송
    await clickItem(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/search_sharp_button"]')
    const textField12 = await driver.$('//android.widget.MultiAutoCompleteTextView[@content-desc="샵검색, 텍스트 필드"]'); // XPath 값으로 실제 화면에 대한 정보로 수정
    await textField12.setValue(`카카오`); // 입력할 텍스트 내용으로 수정
    await clickItem(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/search"]');
    await clickItem(driver, '//android.widget.Button[@resource-id="com.kakao.talk.jordy:id/share"]');

  } finally {
    await driver.pause(3000);
    await driver.deleteSession();
  }
}

runTest().catch(console.error);