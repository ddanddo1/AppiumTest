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

async function tapElement(driver, accessibilityId) {
  const element = await driver.$(`android=new UiSelector().description("${accessibilityId}")`);
  await element.click();
}

async function runTest() {
  const driver = await remote(wdOpts);

  try {

    // 탭할 영역의 좌표 설정
    const tapX = 91;
    const tapY = 2210;

   // +메뉴 선택하기
   await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

   // 앨범 선택하기
   await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[1]');

   // 10초 대기 
   await driver.pause(10000);

   // 전체 선택
   // await clickElement(driver, '//*[@text="전체"]');
   // x : 88 y : 2006

   // 전체 값을 선택하여 앨범 진입 후 특정좌표 탭 후 스와이프로 사진전송
   try {
     // 특정 좌표 탭 (Tap)
     await driver.touchAction([
       { action: 'tap', x: tapX, y: tapY },
     ]);

     // 5초 대기 
     await driver.pause(5000);

     // 롱프레스할 요소의 XPath
     const elementXPath = '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/thumbnail"])[2]';

     // 롱프레스 (Long Press) 및 아래로 스와이프 (Swipe)
     await driver.touchAction([
       { action: 'press', element: await driver.$(elementXPath) },
       { action: 'moveTo', x: 534, y: 2090 },  // 스와이프 거리 및 방향 조절
       { action: 'release' },
     ]);

     await clickElement(driver, '//*[@text="전송"]');

     // 20초 대기
     await driver.pause(20000);
   } catch (error) {
     console.error('Error:', error);
   }

   // +메뉴 선택하기
   await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

   // 카메라 항목 선택
   await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[2]');

   // 1:1 채팅방에서 모든 권한을 허용해서 노출 안될것으로 생각하여 바로 촬영 시작
   await clickElement(driver, '//*[@text="사진 촬영"]');

   // 3초 대기
   await driver.pause(3000);

   // 사진 촬영 시작
   await clickElement(driver, '//android.widget.RelativeLayout[@resource-id="com.sec.android.app.camera:id/bottom_area"]')

   // 사진촬영 후 5초 대기
   await driver.pause(5000);

   // 사진 촬영 확인 후 전송
   await clickElement(driver, '//*[@text="확인"]');
   await clickElement(driver, '//*[@text="전송"]');

   // 동영상 전송 후 5초 대기
   await driver.pause(5000);

   //+메뉴 선택하기
   await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

   // 카메라 항목 선택
   await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[2]');

   // 동영상 촬영으로 이동
   await clickElement(driver, '//*[@text="동영상 촬영"]');

   // 3초 대기
   await driver.pause(3000);

   // 동영상 촬영 시작 및 종료
   await clickElement(driver, '//android.widget.RelativeLayout[@resource-id="com.sec.android.app.camera:id/bottom_area"]');

   // 10초 대기
   await driver.pause(10000);
   await clickElement(driver, '//android.widget.RelativeLayout[@resource-id="com.sec.android.app.camera:id/bottom_area"]');

   // 동영상 확인 후 전송
   await clickElement(driver, '//*[@text="확인"]');
   await clickElement(driver, '//*[@text="전송"]');

   // 10초 대기
   await driver.pause(10000);

   // 뷰 아웃 백키
   await driver.pressKeyCode(4);

   // 5초 대기
   await driver.pause(5000);

   // 오픈 채팅탭으로 이동
   await clickElement(driver, '//*[@text="오픈채팅"]');

   // 첫 번째 오픈채팅방 선택
   await clickElement(driver, '(//android.widget.LinearLayout[@resource-id="com.kakao.talk:id/title"])[1]/android.widget.LinearLayout[1]/android.view.ViewGroup');

   // +메뉴 선택하기
   await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

   // 앨범 선택하기
   await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[1]');

   // 오픈채팅방 앨범 진입 시 불법촬영물 등 식별 및 게재 제한 팝업 확인

   // 권한 팝업이 뜰경우 허용을 선택 권한 팝업이 발생하지 않을 시 지도 선택으로 다음 스탭 시작
   try {
     // 확인이라는 텍스트가 있으면 클릭
     await clickElement(driver, '//*[@text="확인"]');
   } catch (error) { }

   //10초 대기
   await driver.pause(10000);

   // 지정한곳 탭
   try {
     // 특정 좌표 탭 (Tap)
     await driver.touchAction([
       { action: 'tap', x: tapX, y: tapY },
     ]);

     // 5초 대기 
     await driver.pause(5000);

     // 롱프레스할 요소의 XPath
     const elementXPath = '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/thumbnail"])[2]';

     // 롱프레스 (Long Press) 및 아래로 스와이프 (Swipe)
     await driver.touchAction([
       { action: 'press', element: await driver.$(elementXPath) },
       { action: 'moveTo', x: 534, y: 2090 },  // 스와이프 거리 및 방향 조절
       { action: 'release' },
     ]);

     await clickElement(driver, '//*[@text="전송"]');

     // 20초 대기
     await driver.pause(20000);
   } catch (error) {
     console.error('Error:', error);
   }

   try {
     // +메뉴 선택하기
     await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

     // 앨범 선택하기
     await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[1]');

     // 5초 대기 
     await driver.pause(5000);

     // 지정한곳 탭
     await driver.touchAction([
       { action: 'tap', x: tapX, y: tapY },
     ]);


     try {
       // 확인 이라는 텍스트가 있으면 클릭
       await clickElement(driver, '//*[@text="확인"]');
     } catch (error) { }

     // 사진 묶어서 보내시 선택
     await clickElement(driver, '//*[@text="사진 묶어보내기"]');


     // 롱프레스할 요소의 XPath
     const elementXPath2 = '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/thumbnail"])[2]';

     // 5초 대기 
     await driver.pause(5000);

     // 롱프레스 (Long Press) 및 아래로 스와이프 (Swipe)
     await driver.touchAction([
       { action: 'press', element: await driver.$(elementXPath2) },
       { action: 'moveTo', x: 534, y: 2090 },  // 스와이프 거리 및 방향 조절
       { action: 'release' },
     ]);

     // 전송 선택
     await clickElement(driver, '//*[@text="전송"]');

     // 20초 대기
     await driver.pause(20000);
   } catch (error) {

   }

   // +메뉴 선택하기
   await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

   // 카메라 항목 선택
   await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[2]');

   // 사진촬영으로 이동
   await clickElement(driver, '//*[@text="사진 촬영"]');

   // 3초 대기
   await driver.pause(3000);

   // 사진 촬영 시작
   await clickElement(driver, '//android.widget.RelativeLayout[@resource-id="com.sec.android.app.camera:id/bottom_area"]')

   // 3초 대기 후 전송
   await driver.pause(3000);
   // 사진 촬영 확인 후 전송
   await clickElement(driver, '//*[@text="확인"]');
   // 3초 대기 후 전송
   await driver.pause(3000);
   await clickElement(driver, '//*[@text="전송"]');

   //+메뉴 선택하기
   await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

   // 카메라 항목 선택
   await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[2]');

   // 동영상 촬영으로 이동
   await clickElement(driver, '//*[@text="동영상 촬영"]');

   // 3초 대기
   await driver.pause(3000);

   // 동영상 촬영 시작 및 종료
   await clickElement(driver, '//android.widget.RelativeLayout[@resource-id="com.sec.android.app.camera:id/bottom_area"]');
   // 10초 대기
   await driver.pause(10000);
   await clickElement(driver, '//android.widget.RelativeLayout[@resource-id="com.sec.android.app.camera:id/bottom_area"]');

   // 동영상 확인 후 전송
   await clickElement(driver, '//*[@text="확인"]');
   await clickElement(driver, '//*[@text="전송"]');

   // 10초 대기
   await driver.pause(10000);

   //+메뉴 선택하기
   await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

   // 보이스룸 항목 선택
   await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[4]');

   // 클린한 서비스 이용을 위한 음성 수집 동의 팝업 동의 선택 후 20초 대기
   try {
     // 동의라는 텍스트가 있으면 클릭
     await clickElement(driver, '//*[@text="동의"]');
   } catch (error) { }

   // 20초 대기
   await driver.pause(20000);

   // 만들기 선택 후 생성
   await clickElement(driver, '//*[@text="만들기"]');


   // 데이터 알림 팝업 발생 다시보지않음 선택 후 20초 대기
   try {
     // 동의라는 텍스트가 있으면 클릭
     await clickElement(driver, '//*[@text="다시보지않음"]');
   } catch (error) { }

   // 20초대기
   await driver.pause(20000);

   // 보이스룸 나가기 및 종료
   await clickElement(driver, '//android.widget.ImageButton[@content-desc="보이스룸 나가기"]');
   await clickElement(driver, '//android.widget.Button[@resource-id="com.kakao.talk:id/ok"]');

   // 지도 선택하기
   await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[5]');

   // 지도 전송하기
   await clickElement(driver, '//android.widget.LinearLayout[@resource-id="com.kakao.talk:id/box_wrap"]');

   // 캡처 선택하기
   await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[6]');

   // 캡처 영역 지정
   await clickElement(driver, '(//android.widget.FrameLayout[@resource-id="com.kakao.talk:id/voxroom_message_btn"])[1]/android.widget.RelativeLayout');
   await clickElement(driver, '//android.widget.LinearLayout[@resource-id="com.kakao.talk:id/location"]/android.widget.FrameLayout/android.view.View');

   // 저장하기
   await clickElement(driver, '//android.widget.ImageButton[@content-desc="저장하기"]');

   //+메뉴 선택하기
   await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

   // 캡처 선택하기
   await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[6]');

   // 캡처 영역 지정
   await clickElement(driver, '(//android.widget.FrameLayout[@resource-id="com.kakao.talk:id/voxroom_message_btn"])[1]/android.widget.RelativeLayout');
   await clickElement(driver, '//android.widget.LinearLayout[@resource-id="com.kakao.talk:id/location"]/android.widget.FrameLayout/android.view.View');

   // 공유하기
   await clickElement(driver, '//android.widget.ImageButton[@content-desc="공유하기"]');
   await clickElement(driver, '(//android.view.View[@resource-id="com.kakao.talk:id/profile"])[1]');
   await setValue(driver, '//android.widget.EditText[@resource-id="com.kakao.talk:id/edit_text"]', "마이그레이션 캡처 공유");
   /* const textField9 = await driver.$('//android.widget.EditText[@resource-id="com.kakao.talk:id/edit_text"]');
   await textField9.setValue("마이그레이션 캡처 공유"); */
   await clickElement(driver, '//*[@text="보내기"]');

   //10초 대기후 시작
   await driver.pause(10000);

   //+메뉴 선택하기
   await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

   // 음성메시지 선택
   await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[7]');

   // 간편 녹음 버튼 사용 선택
   // await clickElement(driver, '//android.widget.CheckBox[@resource-id="com.kakao.talk:id/check_box"]');

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
   await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[8]');
   await clickElement(driver, '//*[@text="카카오톡 프로필 보내기"]');
   await clickElement(driver, '(//android.widget.RelativeLayout[@resource-id="com.kakao.talk:id/deactive_background"])[1]/android.view.ViewGroup');
   await clickElement(driver, '//*[@text="확인"]');

   // 카카오 프로필 2개 이상 전송
   await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[8]');
   await clickElement(driver, '//*[@text="카카오톡 프로필 보내기"]');
   await clickElement(driver, '(//android.widget.RelativeLayout[@resource-id="com.kakao.talk:id/deactive_background"])[1]/android.view.ViewGroup');
   await clickElement(driver, '(//android.widget.RelativeLayout[@resource-id="com.kakao.talk:id/deactive_background"])[2]/android.view.ViewGroup');
   await clickElement(driver, '(//android.widget.RelativeLayout[@resource-id="com.kakao.talk:id/deactive_background"])[3]/android.view.ViewGroup');
   await clickElement(driver, '//*[@text="확인"]');

   // 연락처 단일 전송
   await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[8]');
   await clickElement(driver, '//*[@text="연락처 보내기"]');
   await clickElement(driver, '//*[@text="ㄱ.마그 자동화 연락처"]');
   await clickElement(driver, '//*[@text="전송"]');

   //+메뉴 선택하기
   await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

   // 다음 메뉴로 이동
   await clickElement(driver, '//android.widget.ImageView[@content-desc="다음"]');

   // 파일 선택
   await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[1]');

   try {
     // 확인 이라는 텍스트가 있으면 클릭
     await clickElement(driver, '//*[@text="확인"]');
   } catch (error) { }

   // 파일 전송
   await clickElement(driver, '(//android.widget.LinearLayout[@resource-id="com.google.android.documentsui:id/item_root"])[1]/android.widget.LinearLayout/android.widget.LinearLayout');

   // 뮤직 선택
   await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[2]');
   await driver.pause(5000);
   await setValue(driver, '//android.widget.EditText[@resource-id="search__word"]', "Hype boy");
   await clickElement(driver, '//android.widget.Button[@text="찾기"]');

   // 뮤직 단일 전송 
   await clickElement(driver, '//android.widget.ListView[@resource-id="commonList"]/android.view.View[1]/android.view.View[2]/android.view.View[1]');
   await clickElement(driver, '//android.widget.TextView[@text="보내기1"]');

   // 5초 대기 
   await driver.pause(5000);

   // #버튼 제비뽑기 전송
   await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/search_sharp_button"]');
   await clickElement(driver, '//android.widget.TextView[@resource-id="com.kakao.talk:id/keyword" and @text="제비뽑기"]');
   await driver.pause(3000);
   await clickElement(driver, '//android.widget.Button[@resource-id="com.kakao.talk.jordy:id/share"]');

   // #버튼 날씨 전송
   await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/search_sharp_button"]');
   await clickElement(driver, '//android.widget.TextView[@resource-id="com.kakao.talk:id/keyword" and @text="날씨"]');
   await clickElement(driver, '//android.widget.Button[@resource-id="com.kakao.talk.jordy:id/share"]');

   // #버튼 D-day 전송
   await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/search_sharp_button"]');
   await clickElement(driver, '//android.widget.TextView[@resource-id="com.kakao.talk:id/keyword" and @text="D-DAY"]');
   await clickElement(driver, '//android.widget.Button[@resource-id="com.kakao.talk.jordy:id/share"]');

   // #버튼 텍스트 직접 입력 전송
   await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/search_sharp_button"]');
   await setValue(driver, '//android.widget.MultiAutoCompleteTextView[@content-desc="샵검색, 텍스트 필드"]', `카카오`);
   await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/search"]');
   await clickElement(driver, '//android.widget.Button[@resource-id="com.kakao.talk.jordy:id/share"]');

   // 5초 대기
   await driver.pause(5000);

   // 백 키
   await driver.pressKeyCode(4);

   // 설정으로 이동
   await clickElement(driver, '//android.widget.ImageView[@content-desc="옵션 더보기"]');

   // 전체 설정 선택
   await clickElement(driver, '//*[@text="전체 설정"]');

   // 알림 선택
   await clickElement(driver, '//*[@text="알림"]');

   // 알림음 선택
   await clickElement(driver, '//*[@text="알림음"]');

   // 알림음 "카톡왔어" 선택  <- 바꾸고싶은 알림음으로 변경
   await clickElement(driver, '//*[@text="카톡왔어"]');

   // 확인 선택
   await clickElement(driver, '//*[@text="확인"]');

   // 키워드 알림 선택
   await clickElement(driver, '//android.widget.Button[@resource-id="com.kakao.talk:id/title" and @text="키워드 알림"]');

   // 키워드 알림 ON
   await clickElement(driver, '//android.widget.Switch[@resource-id="com.kakao.talk:id/switch_button"]');

   // 키워드 알림 추가
   for (let i = 1; i <= 3; i++) {
     await clickElement(driver, '//android.widget.EditText');
     await setValue(driver, '//android.widget.EditText', `키워드 테스트 ${i}회 추가`);
     await clickElement(driver, '//android.widget.Button[@content-desc="키워드 추가"]');
   }

   // 백키 두번 실행
   await driver.pressKeyCode(4);
   await driver.pause(5000);
   await driver.pressKeyCode(4);
   await driver.pause(5000);

   // 개인/보안 진입
   await clickElement(driver, '(//android.widget.FrameLayout[@resource-id="com.kakao.talk:id/title_layout"])[2]');

   // 화면 잠금 선택
   await clickElement(driver, '(//android.widget.FrameLayout[@resource-id="com.kakao.talk:id/title_layout"])[4]');

   // 비밀번호 선택
   await clickElement(driver, '//android.widget.RadioButton[@resource-id="com.kakao.talk:id/btn_radio" and @text="비밀번호"]');

   // 0000설정
   await clickElement(driver, '//android.widget.Button[@resource-id="com.kakao.talk:id/keypad_0"]');
   await driver.pause(3000);
   await clickElement(driver, '//android.widget.Button[@resource-id="com.kakao.talk:id/keypad_0"]');
   await driver.pause(3000);
   await clickElement(driver, '//android.widget.Button[@resource-id="com.kakao.talk:id/keypad_0"]');
   await driver.pause(3000);
   await clickElement(driver, '//android.widget.Button[@resource-id="com.kakao.talk:id/keypad_0"]');
   await driver.pause(3000);

   // 5초 대기 후 0000 비밀번호 재입력
   await driver.pause(5000);
   await clickElement(driver, '//android.widget.Button[@resource-id="com.kakao.talk:id/keypad_0"]');
   await driver.pause(3000);
   await clickElement(driver, '//android.widget.Button[@resource-id="com.kakao.talk:id/keypad_0"]');
   await driver.pause(3000);
   await clickElement(driver, '//android.widget.Button[@resource-id="com.kakao.talk:id/keypad_0"]');
   await driver.pause(3000);
   await clickElement(driver, '//android.widget.Button[@resource-id="com.kakao.talk:id/keypad_0"]');
   await driver.pause(3000);


 } finally {
   await driver.pause(3000);
   await driver.deleteSession();
 }
}

runTest().catch(console.error);