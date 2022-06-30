var client;

init();

async function init() {
  client = await app.initialized();
}

async function generateSpeakeasyCode() {
  const agentDetail = await client.data.get('loggedInUser');
  const {
    loggedInUser
  } = agentDetail;
  var key = "speak_easy_" + loggedInUser.id
  var speakEasyCodeVsAgentMapping = await client.db.get("speakEasyCodeVsAgentMapping")
  if (key in speakEasyCodeVsAgentMapping) {
    console.log('log', "key is there");
  }
  else {
    console.log('log', "key is not there... storing in db");
    client.db.update("speakEasyCodeVsAgentMapping","set", {
      [key]: loggedInUser.id
    });
  }
  document.getElementById("apptext").innerHTML = "Your speakeasy code is " + key;
}
