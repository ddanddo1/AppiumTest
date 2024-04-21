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

          // 3초대기
          await driver.pause(5000);
    
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
    
          //5초 대기
          await driver.pause(5000);
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
  }
  catch (e) {
    console.log(e);
    sendSlackMessage(`error: ${getErrorLineNumber(e)} Line, ${e.message}`);
  }
  finally {
    await driver.pause(3000);
    await driver.deleteSession();
  }
}

runTest().catch(console.error);