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


    /*------------------------------------------------------------------------------------------ */
    // +메뉴 선택하기
    // await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 앨범 선택하기
    // await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[1]')

    /*----------------------앨범 스와이프 동작으로 30 개 선택에 대한 구현이 어려워 찾는중...-------------------- */

    // +메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 카메라 항목 선택
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[2]');
    
    // 1:1 채팅방에서 모든 권한을 허용해서 노출 안될것으로 생각하여 바로 촬영 시작
    await clickElement(driver, '//*[@text="사진 촬영"]');

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

  } finally {
    await driver.pause(3000);
    await driver.deleteSession();
  }
}

runTest().catch(console.error);