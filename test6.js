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

async function tapElement(driver, accessibilityId) {
  const element = await driver.$(`android=new UiSelector().description("${accessibilityId}")`);
  await element.click();
}

async function findShadowElement(driver, x, y) {
  // 특정 좌표에 있는 엘리먼트 찾기
  const element = await driver.$(`android=new UiSelector().description("YourAccessibilityId")`);
  
  // 특정 좌표에 있는 엘리먼트의 좌표 얻기
  const location = await element.getLocation();

  // 좌표에 대한 쉐도우 DOM 엘리먼트 찾기
  const shadowElement = await driver.shadow$({
    'appium:element': element.elementId,
    using: 'xpath',
    value: `//*[contains(@text, "${location.x + x}") and contains(@text, "${location.y + y}")]`,
  });

  return shadowElement;
}

async function runTest() {
  const driver = await remote(wdOpts);

  try {
    // x:88 y:2006 위치에 숨겨진 쉐도우값 찾기
    const shadowElement = await findShadowElement(driver, 88, 2006);

    // 찾은 쉐도우 DOM 엘리먼트와 상호 작용
    const textValue = await shadowElement.getText();
    console.log('텍스트 값:', textValue);
  } finally {
    await driver.pause(3000);
    await driver.deleteSession();
  }
}

runTest().catch(console.error);