const { remote } = require('webdriverio');

const capabilities = {
    platformName: 'iOS',
    'appium:automationName': 'XCUITest',
    'appium:udid': '00008120-001159681490A01E',  // 여기에 실제 기기의 UDID를 입력하세요
    'appium:bundleId': 'com.iwilab.KakaoTalk',
    'appium:noReset': 'true',
    'appium:autoAcceptAlerts': 'true',  // iOS에서 알림을 자동으로 허용
    'appium:platformVersion': '17.2.1',
    'appium:deviceName': 'iPhone15Plus',
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
    // 채팅 아이콘을 찾아서 클릭 (Accessibility ID 값으로 수정)
    //await clickElement(driver, '//XCUIElementTypeButton[@name="com.kakao.tabbaritem.chats"]');

    // + 아이콘을 찾아서 클릭 (Accessibility ID 값으로 수정)
    //await clickElement(driver, '//XCUIElementTypeButton[@name="새로운 채팅"]');

    // 일반채팅을 찾아서 클릭
    //await clickElement(driver, '//XCUIElementTypeButton[@name="일반채팅"]');

    // 대화상대 선택에서 첫번째 유저 선택
    //await clickElement(driver, '(//XCUIElementTypeCell[@name="선택안됨, 4731, 즐겨찾기, 라디오 버튼"])[1]/XCUIElementTypeImage');

    // 확인 텍스트를 선택 Xpath : //XCUIElementTypeStaticText[@name="1 확인"]
    await clickElement(driver, '~1 확인');

    
  
    } finally {
      await driver.pause(3000); // 테스트를 확인하기 위해 잠시 기다림
      await driver.deleteSession();
    }
  }
  
  runTest().catch(console.error);