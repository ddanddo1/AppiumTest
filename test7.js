const { remote } = require('webdriverio');

const capabilities = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'Android',
  'appium:appPackage': 'com.kakao.talk',
  'appium:appActivity': '.activity.main.MainActivity',
  'appium:noReset': 'true',
  'appium:autoGrantPermissions': 'true', //Android에서 권한을 자동으로 앱 사용 중에만 허용
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
     // 엘리먼트 찾기
     const todoInputField = await driver.$('//android.widget.EditText[@resource-id="your_actual_resource_id"]');
     console.log(await todoInputField.getText()); // 엘리먼트의 텍스트 확인
 
     // 텍스트 입력이 지원되는지 확인하기 위해 다른 텍스트 필드에 대해서도 setValue를 시도
     await setValue(driver, '//android.widget.EditText[@resource-id="other_field_resource_id"]', 'Test');
 
     // 기타 작업 수행...
 
   } catch (error) {
     console.error('테스트 중 오류 발생:', error);


  } finally {
    await driver.pause(3000);
    await driver.deleteSession();
  }
}

runTest().catch(console.error);