const { remote } = require('webdriverio');

const capabilities = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'Android',
  'appium:appPackage': 'com.kakao.talk',
  'appium:appActivity': '.activity.main.MainActivity',
  'appium:noReset': 'true',
  'appium:autoGrantPermissions': 'true', //Android에서 권한을 자동으로 앱 사용 중에만 허용
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
    // 카카오톡 앱 텍스트로 찾아서 실행
    await clickElement(driver, '//*[@text="카카오톡"]');

    // 5초대기 -> 저 사양 단말을 대비하여 대기 "카카오톡 켜지는 시간에 대한 딜레이 값"
    await driver.pause(5000);

    // 채팅 Xpath 값을 찾아서 클릭
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_tab_icon"])[2]');

    // 대화 시작하기 텍스트 값을 찾아서 클릭
    await clickElement(driver, '//android.widget.Button[@content-desc="대화 시작하기"]');

    // 일반 채팅 텍스트를 찾아서 클릭
    await clickElement(driver, '//android.widget.TextView[@text="일반채팅"]');

    // 첫 번째 유저 클릭 (XPath 값으로 수정)
    await clickElement(driver, '(//android.widget.RelativeLayout[@resource-id="com.kakao.talk:id/deactive_background"])[1]/android.view.ViewGroup');

    // 유저 선택 후 확인 버튼 선택하기
    await clickElement(driver, '//*[@text="확인"]');

    for (let i = 1; i <= 2; i++) {
      // 텍스트 필드를 찾아서 n회 입력
      await setValue(driver, '//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]', `마이그레이션 테스트 텍스트 ${i}회 전송`);

      // 전송 버튼 클릭하기
      await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/send"]');
    }

    // 메시지 롱프레스 동작하기 or 모든 대화방에서 메시지 삭제
    for (let i = 1; i <= 2; i++) {
      await touchAction(driver, `//android.widget.TextView[@resource-id="com.kakao.talk:id/message" and @text="마이그레이션 테스트 텍스트 ${i}회 전송"]`, 'longPress');
      await clickElement(driver, '//*[@text="삭제"]');

      if (i === 1) {
        // 모든 대화방에서 메시지 삭제
        await clickElement(driver, '//*[@text="확인"]');
        await clickElement(driver, '//*[@text="삭제"]');
      }
      else {
        // 이 기기에서 메시지 삭제
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
    await setValue(driver, '//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]', `보이스톡, 페이스톡, 110-1234-1234, 010-1234-5678`);

    // 전송 버튼 클릭하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/send"]');

    // 텍스트만 500자 전송
    await setValue(driver, '//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]', `500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자
  500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자
  500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자
  500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자
  500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자`); // 입력할 텍스트 내용으로 수정

    // 전송 버튼 클릭하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/send"]');

    // 이모티콘 탭 선택
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/emoticon_button"]');

    const downloadText = await driver.$('//*[@text="다운로드"]');
    if (downloadText) {
      try {
        await downloadText.click();
        for (let i = 1; i <= 4; i++) {
          await touchAction(driver, `(//android.widget.ImageView[@resource-id="com.kakao.talk.emoticon:id/emoticon_icon"])[${i}]`, [
            { action: 'tap', x: 0, y: 0 },
            { action: 'tap', x: 0, y: 0 }
          ]);
        }
      } catch (error) {
        for (let i = 1; i <= 4; i++) {
          await touchAction(driver, `(//android.widget.ImageView[@resource-id="com.kakao.talk.emoticon:id/emoticon_icon"])[${i}]`, [
            { action: 'tap', x: 0, y: 0 },
            { action: 'tap', x: 0, y: 0 }
          ]);
        }

      }
    } else {
      for (let i = 1; i <= 4; i++) {
        await touchAction(driver, `(//android.widget.ImageView[@resource-id="com.kakao.talk.emoticon:id/emoticon_icon"])[${i}]`, [
          { action: 'tap', x: 0, y: 0 },
          { action: 'tap', x: 0, y: 0 }
        ]);
      }
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
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 앨범 선택하기
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[1]');

    // 5초 대기 
    await driver.pause(5000);

    // 전체 선택 -> 텍스트 값으로 인식하지 못하여 이 부분은 주석처리
    // await clickElement(driver, '//*[@text="전체"]');
    // x : 92 y : 2115 <- 전체 버튼 위치에 대한 x y에 대한 좌표 값

    // 전체 값을 선택하여 앨범 진입 후 특정좌표 탭 후 스와이프로 사진전송
    try {
      // 탭할 영역의 좌표 설정
      const tapX = 92;
      const tapY = 2115;

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
        { action: 'moveTo', x: 534, y: 1896 },  // 스와이프 거리 및 방향 조절
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

      // 탭할 영역의 좌표 설정
      const tapX2 = 92;
      const tapY2 = 2115;

      // 지정한곳 탭
      await driver.touchAction([
        { action: 'tap', x: tapX2, y: tapY2 },
      ]);

      const media = await driver.$('//*[@text="확인"]');
      if (media) {
        try {
          // 앱 사용 중에만 허용이라는 텍스트가 있으면 클릭 후 사진촬영 시작
          await media.click();
        } catch (error) {
          // 3초 대기
          await clickElement(driver, '//*[@text="사진 묶어보내기"]');
        }
      } else {
        // 3초 대기
        await clickElement(driver, '//*[@text="사진 묶어보내기"]');
      }

      // 롱프레스할 요소의 XPath
      const elementXPath2 = '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/thumbnail"])[2]';

      // 5초 대기 
      await driver.pause(5000);

      // 롱프레스 (Long Press) 및 아래로 스와이프 (Swipe)
      await driver.touchAction([
        { action: 'press', element: await driver.$(elementXPath2) },
        { action: 'moveTo', x: 534, y: 1896 },  // 스와이프 거리 및 방향 조절
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

    const PermissionPopup = await driver.$('//*[@text="앱 사용 중에만 허용"]');
    if (PermissionPopup) {
      try {
        // 앱 사용 중에만 허용이라는 텍스트가 있으면 클릭 후 사진촬영 시작
        await PermissionPopup.click();
        await clickElement(driver, '//*[@text="사진 촬영"]');
      } catch (error) {
        // 앱 사용 중에만 허용 텍스트 값이 없으면 사진촬영
        await clickElement(driver, '//*[@text="사진 촬영"]');
      }
    } else {
      await clickElement(driver, '//*[@text="사진 촬영"]');
    }

    // 사진 촬영 시작
    await clickElement(driver, '//android.view.ViewGroup[@resource-id="com.sec.android.app.camera:id/center_button"]');

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

    // 동영상 촬영 시작 및 종료
    await clickElement(driver, '//android.view.ViewGroup[@resource-id="com.sec.android.app.camera:id/center_button"]');

    // 10초 대기
    await driver.pause(10000);
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.sec.android.app.camera:id/stop_button_icon"]');

    // 동영상 확인 후 전송
    await clickElement(driver, '//*[@text="확인"]');
    await clickElement(driver, '//*[@text="전송"]');

    // 5초 대기 후 + 메뉴 실행
    await driver.pause(5000);

    //+메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 통화하기 선택
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[4]');

    // 보이스톡 선택
    await clickElement(driver, '//*[@text="보이스톡"]');

    // 보이스톡 권한 팝업 발생 시 앱 사용 중에만 허용 선택 후 다음 스탭 실행 발생하지 않을 시에는 다음 스탭 자동 실행
    const PermissionPopup2 = await driver.$('//*[@text="앱 사용 중에만 허용"]');
    if (PermissionPopup2) {
      try {
        await PermissionPopup2.click();
        await clickElement(driver, '//*[@text="허용"]');
        await driver.pause(10000);
      } catch (error) {
        await driver.pause(10000);
      }
    } else {
      await driver.pause(10000);
    }

    // 보이스톡 종료s
    await clickElement(driver, '//android.widget.ImageButton[@content-desc="통화 종료"]');

    //+메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 통화하기 선택
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[4]');

    // 페이스톡 선택
    await clickElement(driver, '//*[@text="페이스톡"]');

    // 페이스톡 첫 진입 시 발생하는 팝업
    const FaceTalk = await driver.$('//*[@text="다시보지않음"]');
    if (FaceTalk) {
      try {
        await FaceTalk.click();
        await driver.pause(10000);
      } catch (error) {
        await driver.pause(10000);

      }
    } else {
      await driver.pause(10000);
    }
    // 10초 대기
    // await driver.pause(10000);

    // 페이스톡 종료
    await clickElement(driver, '//android.widget.ImageButton[@content-desc="통화 종료"]');

    //+메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 예약하기메시지 선택
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[6]');

    // 예약하기메시지 텍스트 필드 선택 후 텍스트 입력 후 예약하기
    await setValue(driver, '//android.widget.EditText[@resource-id="com.kakao.talk.jordy:id/content_edit"]', "마이그레이션 테스트 예약하기메시지");

    // 예약하기 버튼 선택
    await clickElement(driver, '//*[@text="예약하기"]');

    //+메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 일정 선택하기
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[7]');

    // 일정 등록하기
    await clickElement(driver, '//*[@text="일정 등록"]');

    // 일정 제목 텍스트 필드 선택 후 텍스트 입력
    await setValue(driver, '//android.widget.EditText[@resource-id="com.kakao.talk.jordy:id/content_edit"]', "마이그레이션 일정 제목");

    // 일정 등록하기
    await clickElement(driver, '//*[@text="등록하기"]');

    //+메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');
 
    // 할 일 선택하기
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[7]');

    // 할 일 등록하기
    await clickElement(driver, '//*[@text="할 일 등록"]');

    // 일정 제목 텍스트 필드 선택 후 텍스트 입력
    await setValue(driver, '//android.widget.EditText[@resource-id="com.kakao.talk.jordy:id/content_edit"]', "마이그레이션 일정 제목");

    // 일정 등록하기
    await clickElement(driver, '//*[@text="등록하기"]');

    //+메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 지도 선택하기
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[8]');

    // 권한 팝업이 뜰경우 앱 사용 중에만 허용을 선택 권한 팝업이 발생하지 않을 시 지도 선택으로 다음 스탭 시작
    const PermissionPopup3 = await driver.$('//*[@text="앱 사용 중에만 허용"]');
    if (PermissionPopup3) {
      try {
        await PermissionPopup3.click();
        await clickElement(driver, '//android.widget.LinearLayout[@resource-id="com.kakao.talk:id/box_wrap"]');
      } catch (error) {
        await clickElement(driver, '//android.widget.LinearLayout[@resource-id="com.kakao.talk:id/box_wrap"]');

      }
    } else {
      await clickElement(driver, '//android.widget.LinearLayout[@resource-id="com.kakao.talk:id/box_wrap"]');
    }

    // +메뉴 다음으로 이동
    await clickElement(driver, '//android.widget.ImageView[@content-desc="다음"]');

    // 캡처 선택하기
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[1]');

    // 캡처 영역 지정
    await clickElement(driver, '//android.widget.LinearLayout[@resource-id="com.kakao.talk:id/container"]/android.widget.LinearLayout');
    await clickElement(driver, '//android.widget.TextView[@resource-id="com.kakao.talk:id/address"]');

    // 등록하기하기
    await clickElement(driver, '//android.widget.ImageButton[@content-desc="등록하기하기"]');

    //+메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 캡처 선택하기
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[1]');

    // 캡처 영역 지정
    await clickElement(driver, '//android.widget.LinearLayout[@resource-id="com.kakao.talk:id/container"]/android.widget.LinearLayout');
    await clickElement(driver, '//android.widget.TextView[@resource-id="com.kakao.talk:id/address"]');

    // 공유하기
    await clickElement(driver, '//android.widget.ImageButton[@content-desc="공유하기"]');

    // 공유하기 첫 번째 유저 선택
    await clickElement(driver, '(//android.view.View[@resource-id="com.kakao.talk:id/profile"])[1]');

    // 텍스트 필드 값에 "마이그레이션 캡처 공유" 입력
    await setValue(driver, '//android.widget.EditText[@resource-id="com.kakao.talk:id/edit_text"]', "마이그레이션 캡처 공유");

    // 보내기 선택
    await clickElement(driver, '//*[@text="보내기"]');

    //10초 대기후 시작
    await driver.pause(10000);

    //+메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 음성메시지 선택
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[2]');

    // 음성메시지 선택 후 권한 팝업 노출되면 앱 사용 중에만 허용 선택 후 시작 노출되지 않을 경우 다음 스탭 시작
    const PermissionPopup4 = await driver.$('//*[@text="앱 사용 중에만 허용"]');
    if (PermissionPopup4) {
      try {
        await PermissionPopup4.click();
        await clickElement(driver, '//android.widget.CheckBox[@resource-id="com.kakao.talk:id/check_box"]');
      } catch (error) {
        await clickElement(driver, '//android.widget.CheckBox[@resource-id="com.kakao.talk:id/check_box"]');

      }
    } else {
      await clickElement(driver, '//android.widget.CheckBox[@resource-id="com.kakao.talk:id/check_box"]');
    }

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
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[3]');
    await clickElement(driver, '//*[@text="카카오톡 프로필 보내기"]');
    await clickElement(driver, '(//android.widget.RelativeLayout[@resource-id="com.kakao.talk:id/deactive_background"])[1]/android.view.ViewGroup');
    await clickElement(driver, '//*[@text="확인"]');

    // 카카오 프로필 2개 이상 전송
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[3]');
    await clickElement(driver, '//*[@text="카카오톡 프로필 보내기"]');
    await clickElement(driver, '(//android.widget.RelativeLayout[@resource-id="com.kakao.talk:id/deactive_background"])[1]/android.view.ViewGroup');
    await clickElement(driver, '(//android.widget.RelativeLayout[@resource-id="com.kakao.talk:id/deactive_background"])[2]/android.view.ViewGroup');
    await clickElement(driver, '(//android.widget.RelativeLayout[@resource-id="com.kakao.talk:id/deactive_background"])[3]/android.view.ViewGroup');
    await clickElement(driver, '//*[@text="확인"]');

    // 연락처 단일 전송
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[3]');
    await clickElement(driver, '//*[@text="연락처 보내기"]');
    await clickElement(driver, '//*[@text="ㄱ.마그 자동화 연락처"]');
    await clickElement(driver, '//*[@text="전송"]');

    //+메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 파일 선택하기
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[4]');

    // 파일에서 선택 후 항목 1 전송
    await clickElement(driver, '//*[@text="파일에서 선택"]');
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.android.documentsui:id/icon_thumb"])[1]');
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[4]');

    // 앨범에서 선택하기
    await clickElement(driver, '//*[@text="앨범에서 선택"]');

    // 5초대기
    await driver.pause(5000);

    // 앨범 진입 후 특정좌표 탭 후 스와이프로 사진전송
    try {
      // 롱프레스할 요소의 XPath
      const elementXPath = '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/thumbnail"])[2]';

      // 롱프레스 (Long Press) 및 아래로 스와이프 (Swipe)
      await driver.touchAction([
        { action: 'press', element: await driver.$(elementXPath) },
        { action: 'moveTo', x: 534, y: 1896 },  // 스와이프 거리 및 방향 조절
        { action: 'release' },
      ]);

      await clickElement(driver, '//*[@text="전송"]');

      // 20초 대기
      await driver.pause(20000);
    } catch (error) {
      console.error('Error:', error);
    }

    //+메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 파일 선택하기
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[4]');

    // 최근 보낸 파일 항목 전송
    await clickElement(driver, '//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View[4]/android.view.View[1]/android.widget.Button');

    // 최근에 보낸 파일 전체 삭제
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[4]');

    // 전체 삭제 버튼 선택
    await clickElement(driver, '//*[@text="전체삭제"]');

    // 삭제 버튼 선택
    await clickElement(driver, '//*[@text="삭제"]');

    // 뷰 아웃 -> OS별로 좌표값에 대한 불편함때문에 제거 백키로 대체
    /* await driver.touchAction([
      { action: 'tap', x: 100, y: 100 } ]); */

    // 안드로이드 기기 백키로 뷰 아웃
    await driver.pressKeyCode(4);

    // 5초 대기 
    await driver.pause(5000);

    //뮤직 선택하기
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[5]');
    await driver.pause(5000);
    await setValue(driver, '//android.widget.EditText[@resource-id="search__word"]', "Hype boy");
    /* const textField13 = await driver.$('//android.widget.EditText[@resource-id="search__word"]');
    await textField13.setValue("Hype boy") ; */
    await clickElement(driver, '//android.widget.Button[@text="찾기"]');

    // 뮤직 단일 전송 
    await clickElement(driver, '//android.widget.ListView[@resource-id="commonList"]/android.view.View[1]/android.view.View[2]/android.view.View[1]');
    await clickElement(driver, '//android.widget.TextView[@text="보내기1"]');

    // 5초 대기 
    await driver.pause(5000);

    // #버튼 제비뽑기 전송
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/search_sharp_button"]');
    await clickElement(driver, '//android.widget.TextView[@resource-id="com.kakao.talk:id/keyword" and @text="제비뽑기"]');
    await clickElement(driver, '//android.widget.Button[@resource-id="com.kakao.talk.jordy:id/share"]');

    // #버튼 제비뽑기 전송
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/search_sharp_button"]');
    await clickElement(driver, '//android.widget.TextView[@resource-id="com.kakao.talk:id/keyword" and @text="날씨"]');
    await clickElement(driver, '//android.widget.Button[@resource-id="com.kakao.talk.jordy:id/share"]');

    // #버튼 제비뽑기 전송
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/search_sharp_button"]')
    await clickElement(driver, '//android.widget.TextView[@resource-id="com.kakao.talk:id/keyword" and @text="D-DAY"]');
    await clickElement(driver, '//android.widget.Button[@resource-id="com.kakao.talk.jordy:id/share"]');

    // #버튼 텍스트 직접 입력 전송
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/search_sharp_button"]')
    await setValue(driver, '//android.widget.MultiAutoCompleteTextView[@content-desc="샵검색, 텍스트 필드"]', `카카오`);
    /*
    const textField12 = await driver.$('//android.widget.MultiAutoCompleteTextView[@content-desc="샵검색, 텍스트 필드"]'); // XPath 값으로 실제 화면에 대한 정보로 수정
    await textField12.setValue(`카카오`); // 입력할 텍스트 내용으로 수정 */
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/search"]');
    await clickElement(driver, '//android.widget.Button[@resource-id="com.kakao.talk.jordy:id/share"]');

    // 5초 대기
    await driver.pause(5000);

    // 안드로이드 기기 백키로 뷰 아웃
    await driver.pressKeyCode(4);

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
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 앨범 선택하기
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[1]');

    // 5초 대기 
    await driver.pause(5000);

    // 전체 선택
    // await clickElement(driver, '//*[@text="전체"]');
    // x : 92 y : 2115
    try {
      // 탭할 영역의 좌표 설정
      const tapX = 92;
      const tapY = 2115;

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
        { action: 'moveTo', x: 534, y: 1896 },  // 스와이프 거리 및 방향 조절
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

      // 탭할 영역의 좌표 설정
      const tapX2 = 92;
      const tapY2 = 2115;

      // 지정한곳 탭
      await driver.touchAction([
        { action: 'tap', x: tapX2, y: tapY2 },
      ]);

      const media = await driver.$('//*[@text="확인"]');
      if (media) {
        try {
          // 앱 사용 중에만 허용이라는 텍스트가 있으면 클릭 후 사진촬영 시작
          await media.click();
        } catch (error) {
          // 3초 대기
          await clickElement(driver, '//*[@text="사진 묶어보내기"]');
        }
      } else {
        // 3초 대기
        await clickElement(driver, '//*[@text="사진 묶어보내기"]');
      }

      // 롱프레스할 요소의 XPath
      const elementXPath2 = '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/thumbnail"])[2]';

      // 5초 대기 
      await driver.pause(5000);

      // 롱프레스 (Long Press) 및 아래로 스와이프 (Swipe)
      await driver.touchAction([
        { action: 'press', element: await driver.$(elementXPath2) },
        { action: 'moveTo', x: 534, y: 1896 },  // 스와이프 거리 및 방향 조절
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

    // 사진 촬영 시작
    await clickElement(driver, '//android.view.ViewGroup[@resource-id="com.sec.android.app.camera:id/center_button"]');

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

    // 동영상 촬영 시작 및 종료
    await clickElement(driver, '//android.view.ViewGroup[@resource-id="com.sec.android.app.camera:id/center_button"]');

    // 10초 대기
    await driver.pause(10000);
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.sec.android.app.camera:id/stop_button_icon"]');

    // 동영상 확인 후 전송
    await clickElement(driver, '//*[@text="확인"]');
    await clickElement(driver, '//*[@text="전송"]');

    // 10초 대기
    await driver.pause(10000);

    //+메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 통화하기 선택
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[4]');

    // 보이스톡 선책
    await clickElement(driver, '//*[@text="보이스톡"]');

    // 10초 대기    
    await driver.pause(10000);

    // 보이스톡 종료
    await clickElement(driver, '//android.widget.ImageButton[@content-desc="통화 종료"]');

    //+메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 통화하기 선택
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[4]');

    // 페이스톡 선책
    await clickElement(driver, '//*[@text="페이스톡"]');

    // 10초 대기
    await driver.pause(10000);

    // 페이스톡 종료
    await clickElement(driver, '//android.widget.ImageButton[@content-desc="통화 종료"]');

    //+메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 예약하기메시지 선택
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[6]');

    // 예약하기메시지 텍스트 필드 선택 후 텍스트 입력 후 예약하기
    await setValue(driver, '//android.widget.EditText[@resource-id="com.kakao.talk.jordy:id/content_edit"]', "마이그레이션 테스트 예약하기메시지");
    await clickElement(driver, '//*[@text="예약하기"]');

    //+메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 일정 선택하기
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[7]');

    // 일정 등록하기
    await clickElement(driver, '//*[@text="일정 등록"]');

    // 일정 제목 텍스트 필드 선택 후 텍스트 입력
    await setValue(driver, '//android.widget.EditText[@resource-id="com.kakao.talk.jordy:id/content_edit"]', "마이그레이션 일정 제목");

    // 일정 등록하기
    await clickElement(driver, '//*[@text="등록하기"]');

    //+메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 일정 선택하기
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[7]');

    // 할 일 등록하기
    await clickElement(driver, '//*[@text="할 일 등록"]');

    // 일정 제목 텍스트 필드 선택 후 텍스트 입력
    await setValue(driver, '//android.widget.EditText[@resource-id="com.kakao.talk.jordy:id/content_edit"]', "마이그레이션 할 일 제목");

    // 일정 등록하기
    await clickElement(driver, '//*[@text="등록하기"]');

    //+메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 지도 선택하기
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[8]');

    // 지도 전송하기
    await clickElement(driver, '//android.widget.LinearLayout[@resource-id="com.kakao.talk:id/box_wrap"]');

    // +메뉴 다음으로 이동
    await clickElement(driver, '//android.widget.ImageView[@content-desc="다음"]');

    // 캡처 선택하기
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[1]');

    // 캡처 영역 지정
    await clickElement(driver, '//android.widget.LinearLayout[@resource-id="com.kakao.talk:id/container"]/android.widget.LinearLayout');
    await clickElement(driver, '//android.widget.TextView[@resource-id="com.kakao.talk:id/address"]');

    // 등록하기하기
    await clickElement(driver, '//android.widget.ImageButton[@content-desc="등록하기하기"]');

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
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[3]');
    await clickElement(driver, '//*[@text="카카오톡 프로필 보내기"]');
    await clickElement(driver, '(//android.widget.RelativeLayout[@resource-id="com.kakao.talk:id/deactive_background"])[1]/android.view.ViewGroup');
    await clickElement(driver, '//*[@text="확인"]');

    // 카카오 프로필 2개 이상 전송
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[3]');
    await clickElement(driver, '//*[@text="카카오톡 프로필 보내기"]');
    await clickElement(driver, '(//android.widget.RelativeLayout[@resource-id="com.kakao.talk:id/deactive_background"])[1]/android.view.ViewGroup');
    await clickElement(driver, '(//android.widget.RelativeLayout[@resource-id="com.kakao.talk:id/deactive_background"])[2]/android.view.ViewGroup');
    await clickElement(driver, '(//android.widget.RelativeLayout[@resource-id="com.kakao.talk:id/deactive_background"])[3]/android.view.ViewGroup');
    await clickElement(driver, '//*[@text="확인"]');

    // 연락처 단일 전송
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[3]');
    await clickElement(driver, '//*[@text="연락처 보내기"]');
    await clickElement(driver, '//*[@text="ㄱ.마그 자동화 연락처"]');
    await clickElement(driver, '//*[@text="전송"]');

    //+메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 파일 선택하기
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[4]');

    // 파일에서 선택 후 항목 1 전송
    await clickElement(driver, '//*[@text="파일에서 선택"]');
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.android.documentsui:id/icon_thumb"])[1]');
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[4]');

    // 앨범에서 선택하기
    await clickElement(driver, '//*[@text="앨범에서 선택"]');

    // 전체 값을 선택하여 앨범 진입 후 특정좌표 탭 후 스와이프로 사진전송
    try {
      // 롱프레스할 요소의 XPath
      const elementXPath = '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/thumbnail"])[2]';

      // 롱프레스 (Long Press) 및 아래로 스와이프 (Swipe)
      await driver.touchAction([
        { action: 'press', element: await driver.$(elementXPath) },
        { action: 'moveTo', x: 534, y: 1896 },  // 스와이프 거리 및 방향 조절
        { action: 'release' },
      ]);

      await clickElement(driver, '//*[@text="전송"]');

      // 20초 대기
      await driver.pause(20000);
    } catch (error) {
      console.error('Error:', error);
    }

    //+메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 파일 선택하기
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[4]');

    // 10초 대기 파일 전송 딜레이 시간때문에 간혹 전송되지 않는 경우가 있음
    await driver.pause(10000);

    // 최근 보낸 파일 항목 전송
    await clickElement(driver, '//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View[4]/android.view.View[1]/android.widget.Button');

    // 최근에 보낸 파일 전체 삭제
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[4]');
    await clickElement(driver, '//*[@text="전체삭제"]');
    await clickElement(driver, '//*[@text="삭제"]');

    // 5초 대기
    await driver.pause(5000);

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
      { action: 'tap', x: 100, y: 100 }]); // 좌표는 화면에서 원하는 위치로 설정
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

    // 5초 대기
    await driver.pause(5000);

    // 뷰 아웃
    await driver.pressKeyCode(4);

    // + 아이콘을 찾아서 클릭 (XPath 값으로 수정)
    await clickElement(driver, '//android.widget.Button[@content-desc="대화 시작하기"]');

    // 비밀 채팅 텍스트를 찾아서 클릭 (XPath 값으로 수정)
    await clickElement(driver, '//android.widget.TextView[@text="비밀채팅"]');

    // 첫 번째 유저 클릭 (XPath 값으로 수정)
    await clickElement(driver, '(//android.widget.RelativeLayout[@resource-id="com.kakao.talk:id/deactive_background"])[1]/android.view.ViewGroup');

    // 유저 선택 후 확인 버튼 선택하기
    await clickElement(driver, '//*[@text="확인"]');

    for (let i = 1; i <= 2; i++) {
      // 텍스트 필드를 찾아서 n회 입력
      await setValue(driver, '//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]', `마이그레이션 테스트 텍스트 ${i}회 전송`);

      // 전송 버튼 클릭하기
      await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/send"]');
    }

    // 메시지 롱프레스 동작하기 or 모든 대화방에서 메시지 삭제
    await touchAction(driver, `//android.widget.TextView[@resource-id="com.kakao.talk:id/message" and @text="마이그레이션 테스트 텍스트 1회 전송"]`, 'longPress');
    await clickElement(driver, '//*[@text="삭제"]');
    await clickElement(driver, '//*[@text="삭제하기"]');
    await clickElement(driver, '//*[@text="삭제"]');

    // 링크 전송하기
    await setValue(driver, '//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]', `naver.com`);

    // 전송 버튼 클릭하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/send"]');

    // 하이퍼링크 말풍선 전송하기
    await setValue(driver, '//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]', `보이스톡, 페이스톡, 110-1234-1234, 010-1234-5678`);

    // 전송 버튼 클릭하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/send"]');

    // 텍스트만 500자 전송
    await setValue(driver, '//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]', `500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자
  500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자
  500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자
  500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자
  500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자`); // 입력할 텍스트 내용으로 수정

    /* const textField4 = await driver.$('//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]'); // XPath 값으로 실제 화면에 대한 정보로 수정
    await textField4.setValue(`500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자
    500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자
    500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자
    500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자
    500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자`); // 입력할 텍스트 내용으로 수정*/

    // 전송 버튼 클릭하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/send"]');

    // 이모티콘 탭 선택
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/emoticon_button"]');

    try {
      await clickElement(driver, '//*[@text="다운로드"]');
    } catch { }

    for (let i = 1; i <= 4; i++) {
      await touchAction(driver, `(//android.widget.ImageView[@resource-id="com.kakao.talk.emoticon:id/emoticon_icon"])[${i}]`, [
        { action: 'tap', x: 0, y: 0 },
        { action: 'tap', x: 0, y: 0 }
      ]);
    }
    /*
    // 이모티콘 더블탭하여 전송
    for (let i = 1; i <= 4; i++) {
      await touchAction(driver, `(//android.widget.ImageView[@resource-id="com.kakao.talk.emoticon:id/emoticon_icon"])[${i}]`, [
        { action: 'tap', x: 0, y: 0 },
        { action: 'tap', x: 0, y: 0 }
        ]);
      
    /*  const emoticonIcon = await driver.$(`(//android.widget.ImageView[@resource-id="com.kakao.talk.emoticon:id/emoticon_icon"])[${i}]`);
      await emoticonIcon.touchAction([
        { action: 'tap', x: 0, y: 0 },
        { action: 'tap', x: 0, y: 0 }
        ]); 
      }*/

    // 텍스트 입력
    await setValue(driver, '//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]', `이모티콘과 함께 전송`);
    /* const textField5 = await driver.$('//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]'); // XPath 값으로 실제 화면에 대한 정보로 수정
    await textField5.setValue(`이모티콘과 함께 전송`); // 입력할 텍스트 내용으로 수정 */

    // 이모티콘 탭 선탭 후 더블탭으로 이모티콘 전송
    await touchAction(driver, `(//android.widget.ImageView[@resource-id="com.kakao.talk.emoticon:id/emoticon_icon"])[1]`, [
      { action: 'tap', x: 0, y: 0 },
      { action: 'tap', x: 0, y: 0 }
    ]);
    /* const emoticonIcon = await driver.$(`(//android.widget.ImageView[@resource-id="com.kakao.talk.emoticon:id/emoticon_icon"])[1]`);
    await emoticonIcon.touchAction([
      { action: 'tap', x: 0, y: 0 },
      { action: 'tap', x: 0, y: 0 }
      ]); */

    // 기본 이모티콘 전송
    await setValue(driver, '//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]', `(하하), (하트뿅), (우와), (심각)`);
    /* const textField10 = await driver.$('//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]'); // XPath 값으로 실제 화면에 대한 정보로 수정
    await textField10.setValue(`(하하), (하트뿅), (우와), (심각)`); */

    // 전송 버튼 클릭하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/send"]');

    // 기본 이모티콘 + 텍스트 입력 전송
    await setValue(driver, '//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]', `(하하), (하트뿅), (우와), (심각) + 기본이모티콘과 텍스트 같이 전송`);
    /* const textField11 = await driver.$('//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]'); // XPath 값으로 실제 화면에 대한 정보로 수정
    await textField11.setValue(`(하하), (하트뿅), (우와), (심각) + 기본이모티콘과 텍스트 같이 전송`); */

    // 전송 버튼 클릭하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/send"]');

    /* ------------텍스트 500자 입력 후 이모티콘 진입 시 얼럿 노출 확인 여부에 대한 구현 여부가 가능한지 생각중..... */

    // +메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 앨범 선택하기
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[1]');

    // 5초 대기 
    await driver.pause(5000);

    // 전체 선택
    // await clickElement(driver, '//*[@text="전체"]');
    // x : 92 y : 2115

    // 전체 값을 선택하여 앨범 진입 후 특정좌표 탭 후 스와이프로 사진전송
    try {
      // 탭할 영역의 좌표 설정
      const tapX = 92;
      const tapY = 2115;

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
        { action: 'moveTo', x: 534, y: 1896 },  // 스와이프 거리 및 방향 조절
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

    // 1:1 채팅방에서 모든 권한을 앱 사용 중에만 허용해서 노출 안될것으로 생각하여 바로 촬영 시작
    await clickElement(driver, '//*[@text="사진 촬영"]');

    // 사진 촬영 시작
    await clickElement(driver, '//android.view.ViewGroup[@resource-id="com.sec.android.app.camera:id/center_button"]');

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

    // 동영상 촬영 시작 및 종료
    await clickElement(driver, '//android.view.ViewGroup[@resource-id="com.sec.android.app.camera:id/center_button"]');

    // 10초 대기
    await driver.pause(10000);
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.sec.android.app.camera:id/stop_button_icon"]');

    // 동영상 확인 후 전송
    await clickElement(driver, '//*[@text="확인"]');
    await clickElement(driver, '//*[@text="전송"]');

    // 10초 대기
    await driver.pause(10000);

    // 뷰 아웃 백키
    await driver.pressKeyCode(4);

    // 오픈 채팅탭으로 이동
    await clickElement(driver, '//*[@text="오픈채팅"]');

    // 첫 번째 오픈채팅방 선택
    await clickElement(driver, '(//android.widget.LinearLayout[@resource-id="com.kakao.talk:id/title"])[1]/android.widget.LinearLayout[1]/android.view.ViewGroup');

    // +메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 앨범 선택하기
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[1]');

    // 오픈채팅방 앨범 진입 시 불법촬영물 등 식별 및 게재 제한 팝업 확인
    const PermissionPopup5 = await driver.$('//*[@text="확인"]');
    if (PermissionPopup5) {
      try {
        await PermissionPopup5.click();
        await driver.pause(10000);
      } catch (error) {
        await driver.pause(10000);
      }
    } else {
      await driver.pause(10000);
    }

    // 지정한곳 탭
    try {
      // 탭할 영역의 좌표 설정
      const tapX = 92;
      const tapY = 2115;

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
        { action: 'moveTo', x: 534, y: 1896 },  // 스와이프 거리 및 방향 조절
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

      // 탭할 영역의 좌표 설정
      const tapX2 = 92;
      const tapY2 = 2115;

      // 지정한곳 탭
      await driver.touchAction([
        { action: 'tap', x: tapX2, y: tapY2 },
      ]);

      const media = await driver.$('//*[@text="확인"]');
      if (media) {
        try {
          // 확인이라는 텍스트가 선택
          await media.click();
          await clickElement(driver, '//*[@text="사진 묶어보내기"]');
        } catch (error) {
          await clickElement(driver, '//*[@text="사진 묶어보내기"]');
        }
      } else {
        await clickElement(driver, '//*[@text="사진 묶어보내기"]');
      }

      // 롱프레스할 요소의 XPath
      const elementXPath2 = '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/thumbnail"])[2]';

      // 5초 대기 
      await driver.pause(5000);

      // 롱프레스 (Long Press) 및 아래로 스와이프 (Swipe)
      await driver.touchAction([
        { action: 'press', element: await driver.$(elementXPath2) },
        { action: 'moveTo', x: 534, y: 1896 },  // 스와이프 거리 및 방향 조절
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

    // 사진 촬영 시작
    await clickElement(driver, '//android.view.ViewGroup[@resource-id="com.sec.android.app.camera:id/center_button"]');

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

    // 동영상 촬영 시작 및 종료
    await clickElement(driver, '//android.view.ViewGroup[@resource-id="com.sec.android.app.camera:id/center_button"]');
    // 10초 대기
    await driver.pause(10000);
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.sec.android.app.camera:id/stop_button_icon"]');

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
    const VoiceRoompermission = await driver.$('//*[@text="동의"]');
    if (VoiceRoompermission) {
      try {
        await VoiceRoompermission.click();
        await driver.pause(20000);
      } catch (error) {
        await driver.pause(20000);

      }
    } else {
      await driver.pause(20000);
    }

    // 만들기 선택 후 생성
    await clickElement(driver, '//*[@text="만들기"]');


    // 데이터 알림 팝업 발생 다시보지않음 선택 후 20초 대기
    const VoiceRoom = await driver.$('//*[@text="다시보지않음"]');
    if (VoiceRoom) {
      try {
        await VoiceRoom.click();
        await driver.pause(20000);
      } catch (error) {
        await driver.pause(20000);

      }
    } else {
      await driver.pause(20000);
    }

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

    // 등록하기하기
    await clickElement(driver, '//android.widget.ImageButton[@content-desc="등록하기하기"]');

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

    // 파일 전송
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.android.documentsui:id/icon_thumb"])[1]');

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