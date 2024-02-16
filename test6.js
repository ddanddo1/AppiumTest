const { remote } = require('webdriverio');
const { touchAction } = require('webdriverio/build/commands/browser');

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

try {

  // 백 키
  await driver.pressKeyCode(4);
  
  
} finally {
  await driver.pause(3000);
  await driver.deleteSession();
}


runTest().catch(console.error);