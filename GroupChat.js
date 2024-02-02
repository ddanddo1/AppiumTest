const { remote } = require('webdriverio');

const capabilities = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'Android',
  'appium:appPackage': 'com.kakao.talk',
  'appium:appActivity': '.activity.main.MainActivity',
  'appium:noReset': 'true'
};

const wdOpts = {
  // process.env.APPIUM_HOST 의 값은 무엇일까?
  // 이 프로세스 실행되는 프로그램 env= 환경 변수 환경변수 중에 APPIUM_HOST 값이 있으면 실행시켜라 || env가 설정이 안되어 있어서 로컬호스트가 실행
  // 문자열인 process.env.APPIUM_PORT 값을 10진수로 바꿔달라 값이 null값이면 4723 host를 불러와라
  hostname: process.env.APPIUM_HOST || 'localhost',
  port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
  logLevel: 'info',
  capabilities,
};

// async를 더블클릭하면 await까지 찾아준다. 이 함수가 비동기로 돌아간다 runtest를 하고 나서 
// remote의 리턴형은 비동기이기 때문에 await가 있으면 다 실행되고 난 값이 넘어온다
async function runTest() {
  const driver = await remote(wdOpts);
  try {
    // 패키지명과 액티비티명을 찾아서 수정
    const kakaoTalkIcon = await driver.$('//*[@text="카카오톡"]');
    await kakaoTalkIcon.click();

    // 채팅 아이콘을 찾아서 클릭
    const chatTab = await driver.$('//*[@text="채팅"]');
    await chatTab.click();

    // + 아이콘을 찾아서 클릭 (XPath 값으로 수정)
    const plusMenuIcon = await driver.$('//android.widget.Button[@content-desc="대화 시작하기"]');
    await plusMenuIcon.click();

    // 일반 채팅 텍스트를 찾아서 클릭 (XPath 값으로 수정)
    const normalChat = await driver.$('//android.widget.TextView[@text="일반채팅"]');
    await normalChat.click();

    // 첫 번째 유저 클릭 (XPath 값으로 수정)
    const firstUser = await driver.$('(//android.widget.RelativeLayout[@resource-id="com.kakao.talk:id/deactive_background"])[1]/android.view.ViewGroup');
    await firstUser.click();

    // 두 번째 유저 클릭 (XPath 값으로 수정)
    const secondUser = await driver.$('(//android.widget.RelativeLayout[@resource-id="com.kakao.talk:id/deactive_background"])[2]/android.view.ViewGroup');
    await secondUser.click();

    // 유저 선택 후 다음 버튼 선택하기
    const UserSelect = await driver.$('//*[@text="다음"]');
    await UserSelect.click();

    // 그룹채팅방 정보 설정 확인 텍스트 찾아서 선택
    const ChatSetting = await driver.$('//*[@text="확인"]');
    await ChatSetting.click();


    // for문으로 텍스트 2번 전송
    for (let i = 1; i <= 2; i++) {
      // 텍스트 필드를 찾아서 1회 입력
      const textField = await driver.$('//android.widget.MultiAutoCompleteTextView[@resource-id="com.kakao.talk:id/message_edit_text"]'); // XPath 값으로 실제 화면에 대한 정보로 수정
      await textField.setValue(`마이그레이션 테스트 텍스트 ${i}회 전송`); // 입력할 텍스트 내용으로 수정

      // 전송 버튼 클릭하기
      const SendSelect = await driver.$('//android.widget.ImageView[@resource-id="com.kakao.talk:id/send"]');
      await SendSelect.click();

      

    }
  }


  finally {
    await driver.pause(3000);
    await driver.deleteSession();
  }
}

runTest().catch(console.error);

