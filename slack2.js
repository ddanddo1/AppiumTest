function sendSlackMessage(message){
    var myHeaders = new Headers();
    myHeaders.append("Content-type", "application/json; charset=utf-8");
    myHeaders.append("Authorization", "Bearer xoxb-6737288415267-6737381495430-VbudiILwACEwwN9JOVSiggTR");
    
    var raw = `{\n  \"channel\": \"C06MP8Q4ZNX\",\n  \"text\": \"${message}\"\n}`;
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch("https://slack.com/api/chat.postMessage", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
}

sendSlackMessage2('자동화 테스트 완료');