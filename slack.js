function sendSlackMessage(massage){
    var myHeaders = new Headers();
    myHeaders.append("Content-type", "application/json; charset=utf-8");
    myHeaders.append("Authorization", "Bearer xoxb-6749966071905-6732968189718-5buYiY2kyexG5oumBcNY5Tz3");
    
    var raw = `{\n  \"channel\": \"C06MPJ95A2E\",\n  \"text\": \"${massage}\"\n}`;
    
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

sendSlackMessage('자동화 테스트 완료');
