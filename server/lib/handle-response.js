var unirest = require('unirest');

var PATH = "/api/v2/tickets";

async function allocateAgent(ticketData) {

  let speakEasyCodeVsAgentMapping = await $db.get("speakEasyCodeVsAgentMapping")
  console.log("speakEasyCodeVsAgentMapping is  " + JSON.stringify(speakEasyCodeVsAgentMapping));

  var subject = ticketData['data']['ticket']['subject'];
  console.log("the subject is " + subject);

  var agentId = getPreferredAgent(subject, speakEasyCodeVsAgentMapping);

  if (agentId !== null) {
    let iparams = ticketData["iparams"]
    var FD_ENDPOINT = iparams.domainName;
    let API_KEY = iparams.apiKey;
    var URL = "https://" + FD_ENDPOINT + ".freshdesk.com" + PATH + "/" + ticketData['data']['ticket']['id'];
    var fields = {
      'responder_id': agentId
    }
    var Request = unirest.put(URL);
    Request.auth({
      user: API_KEY,
      pass: "X",
      sendImmediately: true
    })
      .type('json')
      .send(fields)
      .end(function (response) {
        console.log(response.body)
        console.log("Response Status : " + response.status)
        if (response.status != 200) {
          console.log("X-Request-Id :" + response.headers['x-request-id']);
        }
      });
  }
  else {
    console.log("can't find any valid speak easy code.. hence can't assign a agent")
  }
}

function getPreferredAgent(subject, speakEasyCodeVsAgentMapping) {
  for (const key in speakEasyCodeVsAgentMapping) {
    if (subject.includes(key)) {
      console.log("agent found details : speakeasy code is : " + key + " agent id " + speakEasyCodeVsAgentMapping[key]);
      agentId = speakEasyCodeVsAgentMapping[key];
      return agentId;
    }
  }
  return null;
}

exports = {
  allocateAgent: allocateAgent
};

