// Require the Bolt package (github.com/slackapi/bolt)
const { App, ExpressReceiver } = require("@slack/bolt");
const Workflow = require("./startWorkflow.js");
const Jokes = require("./joker");
const bodyParser = require("body-parser")


// Initialize your own ExpressReceiver
const receiver = new ExpressReceiver({ signingSecret: process.env.SLACK_SIGNING_SECRET, endpoints: '/slack/events' });

// Specify your receiver as the custom receiver for the bolt App
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver
});

let jsonParser = bodyParser.json()

function OneAction(buttonText, actionId, modalText, chatChannel) {
  let OneAction = {
    type: "button",
    action_id: actionId,
    text: {
      type: "plain_text",
      text: buttonText,
      emoji: true
    },
    value: chatChannel,
  };
  return OneAction;
}

function makeHeader(HeaderText) {
  let header = {
    type: "header",
    text: {
      type: "plain_text",
      text: HeaderText,
      emoji: true
    }
  };
  return header;
}

app.event("app_home_opened", async ({ event, context }) => {
  let viewObject = {
    type: "home",
    blocks: [
      makeHeader("HeaderText"),
      {
        type: "actions",
        elements: [
          OneAction("TEST", "test", "modalText", event.channel),
        ]
      },
    ]
  };

  try {
    /* view.publish is the method that your app uses to push a view to the Home tab */
    const result = await app.client.views.publish({
      /* retrieves your xoxb token from context */
      token: context.botToken,
      /* the user that opened your app's app home */
      user_id: event.user,

      /* the view object that appears in the app home*/
      view: viewObject
    });
  } catch (error) {
    console.error(error);
  }
});



function ListenToGithub (path, messagesChannel, client, domeen){
  receiver.router.post(path, jsonParser, (req, res) => {
  console.log(req.body) // Call your action on the request here
  //anna tagasidet
  client.chat.postMessage({
      channel: messagesChannel,
  //slacki kasutaja (saatsin kaasa workflow käivitamisel) == display name
      text: `slack-i kasutaja: <@${req.body.slackUserId}> Github workflow message: ${req.body.text}`
    });
    //tekita nupp
    
  // You're working with an express req and res now.
  res.status(200).end() // Responding is important

});

}



app.action("test", async ({ ack, action, client, payload, body, context }) => {
  // Acknowledge the action
  await ack();
  let messagesChannel = action.value;
//see käivitab github-is workflow ja annab kaasa käivitanud kasutaja nime ja pathi mis vastust kuulab
  let slackUserId = body.user.id
  Workflow.Start("manuaalne.yml", "DeploymentTest", slackUserId, body.trigger_id);
  try {
    const result = await client.chat.postMessage({
      channel: messagesChannel,
      text: `<@${body.user.id}>, alustasin ${action.action_id}-i lehe ehitamist. Annan märku kui on valmis.`
    });
    console.log()
  } catch (error) {
    console.error(error);
  }
  //kasutan slackboti action trigger_id-d et luua unikaalne path github-i requesti vastuvõtmiseks
  ListenToGithub (`/${body.trigger_id}`, messagesChannel, client, "pöff.ee")

});


app.message("joke", async ({ message, say, payload, body, context }) => {
  //await say(`Kas tahad nalja kuulda <@${message.user}>?`);
  console.log(say);
  Jokes.Chuck(async function log(joke) {
    await say(joke);
    console.log(message)
  });
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();

