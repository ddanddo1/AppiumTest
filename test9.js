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

  async function runTest() {
    const driver = await remote(wdOpts);
  
    try {
        await driver.tou
        
     
    }
    finally {
      await driver.pause(3000);
      await driver.deleteSession();
    }
  }
  
  runTest().catch(console.error);