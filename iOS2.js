const { remote } = require('webdriverio');

const capabilities = {
    platformName: 'iOS',
    'appium:automationName': 'XCUITest',
    'appium:udid': '7603F054-A2D2-4B60-8FE3-0A66162E0259',  // 여기에 실제 기기의 UDID를 입력하세요
    'appium:noReset': 'true',
    'appium:autoAcceptAlerts': 'true',  // iOS에서 알림을 자동으로 허용
    'appium:platformVersion': '16.2',
    'appium:deviceName': 'iPhone14Plus',
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
  
  async function runTest() {
    console.log(1);

    const driver = await remote(wdOpts);
    console.log(2);
  
    try {
      // 카카오톡 텍스트 클릭
      await clickElement(driver, 'Settings');
      console.log(3);
  
    } finally {
      await driver.pause(3000); // 테스트를 확인하기 위해 잠시 기다림
      await driver.deleteSession();
    }
  }
  
  runTest().catch(console.error);