const { remote } = require('webdriverio');

const capabilities = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'Android',
  'appium:appPackage': 'com.kakao.talk',
  'appium:appActivity': '.activity.main.MainActivity',
  'appium:noReset': 'true',
  'appium:autoGrantPermissions': 'true'
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

async function touchAction(driver, xpath, action) {
  const element = await driver.$(xpath);
  await element.touchAction(action);
}

async function setValue(driver, xpath, value) {
  const element = await driver.$(xpath);
  await element.setValue(value);
}

async function runTest() {
  const driver = await remote(wdOpts);

  try {
    try {

      //    // See https://webdriver.io/docs/api/browser/action/
      // await driver
      // // a. Create the event
      // .action('pointer')
      // // b. Move finger into start position
      // .move(92, 2115) // This can also be written as .move({ x:x, y:y }) which allows you to add more options
      // // c. Finger comes down into contact with screen
      // .down() // This can also be written as .down({ button:0 }) which allows you to add more options
      // // d. Perform the action, in this flow the finger will stay on the screen, this is normally not a good flow because you are "stuck"
      // .up()
      // .perform()


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

      // 탭할 영역의 좌표 설정
      const tapX = 92;
      const tapY = 2123;

      // 특정 좌표 탭 (Tap)
      await driver.touchAction([
        { action: 'tap', x: tapX, y: tapY },
      ]);


      // // 특정 좌표 탭 (Tap)
      // await driver.touchPerform([
      //   { action: 'press', options: {x: tapX, y: tapY} },
      // ]);

      // // 누르고 1초 대기
      // await driver.pause(1000);

      // // 누름 해제하기 (Release)
      // await driver.touchPerform([
      //   { action: 'release' },
      // ]);

      //  // 5초 대기 
      //  await driver.pause(5000);

      // // 롱프레스할 요소의 XPath
      // const elementXPath = '(//android.widget.ImageView[@resource-id="com.kakao.talk:id/thumbnail"])[2]';

      // // 롱프레스 (Long Press) 및 아래로 스와이프 (Swipe)
      // await driver.touchPerform([
      //   { action: 'press', element: await driver.$(elementXPath) },
      //   { action: 'moveTo', x: 534, y: 1896 },  // 스와이프 거리 및 방향 조절
      //   { action: 'release' },
      // ]);

      // await clickElement(driver, '//*[@text="전송"]');

      // // 20초 대기
      // await driver.pause(20000);
    } catch (error) {
      console.error('Error:', error);
    }

  } finally {
    await driver.pause(3000);
    await driver.deleteSession();
  }

}
runTest().catch(console.error);
