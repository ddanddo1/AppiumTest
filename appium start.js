const { AppiumServiceBuilder } = require('appium');
const { remote } = require('webdriverio');

const appiumService = new AppiumServiceBuilder()
  .usingPort(4723) // Appium 서버 포트 설정
  .withCapabilities({
    platformName: 'Android',
    automationName: 'UiAutomator2',
    uiautomator2ServerLaunchTimeout: 50000, // 서버 시작을 대기할 시간(ms)
    // 'systemPort'를 사용하여 UiAutomator2의 특정 버전을 지정합니다.
    // 예: systemPort: 8201
  })
  .build();

async function runTest() {
  await appiumService.start();

  const driver = await remote(wdOpts);

  try {
    // 여기에 테스트 코드 추가
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

  } finally {
    await driver.deleteSession();
    await appiumService.stop();
  }
}
