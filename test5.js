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
    // 사진 스와이프로 30개 선택
    // await clickItem(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/thumbnail"])[2]');
    /*
    const element = await driver.$('(//android.widget.ImageView[@resource-id="com.kakao.talk:id/thumbnail"])[2]');
    const otherElement = await driver.$('(//android.widget.ImageView[@resource-id="com.kakao.talk:id/thumbnail"])[31]');
    await element.touchAction([
      'longPress',
      { action: 'moveTo', element: otherElement },
      'release'
    ])
    */

    // 카메라 항목 선택
    // await clickElement (driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[2]');
    //  const PermissionPopup = await driver.$('//*[@text="허용"]')
    //  console.log('@@@@@@@@@@@@@', PermissionPopup, PermissionPopup.getLocation, PermissionPopup.eventNames);
    //  PermissionPopup.eventNames

    // const PermissionPopup = await driver.$('//*[@text="허용"]');
    // console.log("@@@@@@@@@@@@@", PermissionPopup, PermissionPopup.ELEMENT.toString);
    // xpath 값 = const PermissionPopup = await driver.$('//android.widget.Button[@resource-id="com.android.packageinstaller:id/permission_allow_button"]');
    /*
    const PermissionPopup = await driver.$('//*[@text="허용"]');
    
    if (PermissionPopup === error) {
      // 노출되지 않을 시 사진 촬영으로 이동
      await clickElement(driver,'//*[@text="사진 촬영"]');
    }
    else{
      // 허용이라는 텍스트가 있을 때 클릭
      await PermissionPopup.click();
      await clickElement(driver,'//*[@text="사진 촬영"]');
    }
    */
    /*
    const PermissionPopup = await driver.$('//*[@text="허용"]');
   
    if (PermissionPopup) {
      try {
          await PermissionPopup.click();
          await clickElement(driver, '//*[@text="사진 촬영"]');
      } catch (error) {
          await clickElement(driver, '//*[@text="사진 촬영"]');
      }
  } else {
      await clickElement(driver, '//*[@text="사진 촬영"]');
  }


  
    // 사진 촬영 시작
    await clickElement (driver, '//GLButton[@content-desc="NONE" and @text="셔터"]');

    // 사진촬영 후 5초 대기
    await driver.pause(5000);

    // 사진 촬영 확인 후 전송
    await clickElement (driver, '//*[@text="확인"]');
    await clickElement (driver, '//*[@text="전송"]');
    

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
*/
    /*
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
    
        /* const textField4 = await driver.$('//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]'); // XPath 값으로 실제 화면에 대한 정보로 수정
        await textField4.setValue(`500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자
        500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자
        500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자
        500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자
        500자500자500자500자500자500자500자500자500자500자500자500자500자500자500자`); // 입력할 텍스트 내용으로 수정*/
    /*
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
    /*
    // 텍스트 입력
    await setValue(driver, '//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]', `이모티콘과 함께 전송`);
    /* const textField5 = await driver.$('//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]'); // XPath 값으로 실제 화면에 대한 정보로 수정
    await textField5.setValue(`이모티콘과 함께 전송`); // 입력할 텍스트 내용으로 수정 */
    /*
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
    // await setValue(driver, '//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]', `(하하), (하트뿅), (우와), (심각)`);
    /* const textField10 = await driver.$('//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]'); // XPath 값으로 실제 화면에 대한 정보로 수정
    await textField10.setValue(`(하하), (하트뿅), (우와), (심각)`); */

    // 전송 버튼 클릭하기
    // await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/send"]');

    // 기본 이모티콘 + 텍스트 입력 전송
    // await setValue(driver, '//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]', `(하하), (하트뿅), (우와), (심각) + 기본이모티콘과 텍스트 같이 전송`);
    /* const textField11 = await driver.$('//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]'); // XPath 값으로 실제 화면에 대한 정보로 수정
    await textField11.setValue(`(하하), (하트뿅), (우와), (심각) + 기본이모티콘과 텍스트 같이 전송`); */

    // 전송 버튼 클릭하기
    // await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/send"]');

    /* ------------텍스트 500자 입력 후 이모티콘 진입 시 얼럿 노출 확인 여부에 대한 구현 여부가 가능한지 생각중..... */


    /*------------------------------------------------------------------------------------------ */
    // +메뉴 선택하기
    // await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 앨범 선택하기
    // await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[1]')

    // +메뉴 선택하기
    // await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 카메라 항목 선택
    /*
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[2]');

    const PermissionPopup = await driver.$('//*[@text="허용"]');
    if (PermissionPopup) {
      try {
        // 허용이라는 텍스트가 있으면 클릭 후 사진촬영 시작
        await PermissionPopup.click();
        await clickElement(driver, '//*[@text="사진 촬영"]');
      } catch (error) {
        // 허용 텍스트 값이 없으면 사진촬영
        await clickElement(driver, '//*[@text="사진 촬영"]');
      }
    } else {
      await clickElement(driver, '//*[@text="사진 촬영"]');
    }

    // 사진 촬영 시작
    await clickElement(driver, '//GLButton[@content-desc="NONE" and @text="셔터"]')

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
    await clickElement(driver, '//GLButton[@content-desc="NONE" and @text="녹화"]');

    // 10초 대기
    await driver.pause(10000);
    await clickElement(driver, '//GLButton[@content-desc="NONE" and @text="중지"]');

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

    // 보이스톡 권한 팝업 발생 시 허용 선택 후 다음 스탭 실행 발생하지 않을 시에는 다음 스탭 자동 실행
    const PermissionPopup2 = await driver.$('//*[@text="허용"]');
    if (PermissionPopup2) {
      try {
        await PermissionPopup2.click();
        await driver.pause(10000);
      } catch (error) {
        await driver.pause(10000);
      }
    } else {
      await driver.pause(10000);
    }

    // 10초 대기
    // await driver.pause(10000);

    // 보이스톡 종료
    await clickElement(driver, '//android.widget.Button[@content-desc="통화 종료"]');

    //+메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 통화하기 선택
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[4]');

    // 페이스톡 선택
    await clickElement(driver, '//*[@text="페이스톡"]');

    const FaceTalk = await driver.$('//*[@text="확인"]');
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
    await clickElement(driver, '//android.widget.Button[@content-desc="통화 종료"]');

    //+메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 예약메시지 선택
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[6]');

    // 예약메시지 텍스트 필드 선택 후 텍스트 입력 후 예약
    await setValue(driver, '//android.widget.EditText[@resource-id="com.kakao.talk.jordy:id/text_content"]', "마이그레이션 테스트 예약메시지");
    /* const textField6 = await driver.$('//android.widget.EditText[@resource-id="com.kakao.talk.jordy:id/text_content"]');
    await textField6.setValue("마이그레이션 테스트 예약메시지"); */

    //await clickElement(driver, '//*[@text="예약"]');

    //+메뉴 선택하기
    //await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 일정 선택하기
    //await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[7]');

    // 일정 등록하기
    //await clickElement(driver, '//*[@text="일정 등록"]');

    // 일정 제목 텍스트 필드 선택 후 텍스트 입력
    // await setValue(driver, '//android.widget.EditText[@resource-id="com.kakao.talk.calendar:id/event_title"]', "마이그레이션 일정 제목");
    /* const textField7 = await driver.$('//android.widget.EditText[@resource-id="com.kakao.talk.calendar:id/event_title"]');
    await textField7.setValue("마이그레이션 일정 제목"); */

    // 일정 저장
    // await clickElement(driver, '//*[@text="저장"]');

    //+메뉴 선택하기
    // await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 일정 선택하기
    // await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[7]');

    // 할 일 등록하기
    // await clickElement(driver, '//*[@text="할 일 등록"]');

    // 일정 제목 텍스트 필드 선택 후 텍스트 입력
    // await setValue(driver, '//android.widget.EditText[@resource-id="com.kakao.talk.jordy:id/content_edit"]', "마이그레이션 할 일 제목");
    /* const textField8 = await driver.$('//android.widget.EditText[@resource-id="com.kakao.talk.jordy:id/content_edit"]');
    await textField8.setValue("마이그레이션 할 일 제목"); */

    /*

    // +메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 앨범 선택하기
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[1]');

    // 5초 대기 
    await driver.pause(5000);

    // 전체 선택
    // await clickElement(driver, '//*[@text="전체"]');
    // x : 88 y : 2006
    try {
      // 탭할 영역의 좌표 설정
      const tapX = 88;
      const tapY = 2006;

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
      const tapX2 = 88;
      const tapY2 = 2006;

      // 지정한곳 탭
      await driver.touchAction([
        { action: 'tap', x: tapX2, y: tapY2 },
      ]);

      const media = await driver.$('//*[@text="확인"]');
      if (media) {
        try {
          // 허용이라는 텍스트가 있으면 클릭 후 사진촬영 시작
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
    */
    // 키워드 알림 선택
    // await clickElement(driver, '//android.widget.Button[@resource-id="com.kakao.talk:id/title" and @text="키워드 알림"]');

    // 키워드 알림 ON
    await clickElement(driver, '//android.widget.Switch[@resource-id="com.kakao.talk:id/switch_button"]');

    // 키워드 알림 추가
    for (let i = 1; i <= 10; i++) {
        await clickElement(driver, '//android.widget.EditText');
        await setValue(driver, '//android.widget.EditText', `마이그레이션 키워드 테스트 ${i}회 추가`);
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