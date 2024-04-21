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
     // +메뉴 선택하기
    await clickElement(driver, '//android.widget.ImageView[@resource-id="com.kakao.talk:id/media_send_button"]');

    // 앨범 선택하기
    await clickElement(driver, '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/iv_icon"])[1]');

    // 5초 대기 
    await driver.pause(5000);

    // 전체 선택
    // await clickElement(driver, '//*[@text="전체"]');
    // x : 88 y : 2006

    // 탭할 영역의 좌표 설정
     const tapX = 233;
     const tapY = 2088;

     

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

      // 20초대기
      await driver.pause(20000);
    } catch (error) {
      console.error('Error:', error);
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