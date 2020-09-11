//AKTIIVNE APP
// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");
const Workflow = require("./startWorkflow.js");
const Jokes = require("./joker");
require('dotenv').config()

//console.log(process.env.SLACK_SIGNING_SECRET)
//console.log(process.env.SLACK_BOT_TOKEN)

let makingBotsForSlackChannel = "C01A11E0D8S";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

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
    confirm: {
      title: {
        type: "plain_text",
        text: "Kas oled kindel?"
      },
      text: {
        type: "mrkdwn",
        text: modalText
      },
      confirm: {
        type: "plain_text",
        text: "Jah"
      },
      deny: {
        type: "plain_text",
        text: "Ei"
      }
    }
  };
  return OneAction;
}

function makeHeader(HeaderText) {
  let header ={
        type: "header",
        text: {
          type: "plain_text",
          text: HeaderText,
          emoji: true
        }
      }
  return header;
}

app.event("app_home_opened", async ({ event, context }) => {
    let viewObject = {
    type: "home",
    blocks: [
      makeHeader("PÖFF")
      ,
      {
        type: "actions",
        elements: [
          OneAction("Pöff STAGING", "staging_poff", "poff_staging.inscaping.eu ehitamine", event.channel),
          OneAction("Pöff LIVE", "live_poff", "poff_live.inscaping.eu ehitamine", event.channel)
        ]
      },
      makeHeader("JUST")
      ,
      {
        type: "actions",
        elements: [
          OneAction("Just STAGING", "staging_just", "staging.poff.just.ee ehitamine", event.channel),
          OneAction("Just LIVE", "live_just", "poff.just.ee ehitamine", event.channel)
        ]
      },
      makeHeader("SHORTS")
      ,
      {
        type: "actions",
        elements: [
          OneAction("Shorts STAGING", "staging_shorts", "staging.poff.shorts.ee ehitamine", event.channel),
          OneAction("Shorts LIVE", "live_shorts", "poff.shorts.ee ehitamine", event.channel)
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

function buttonAction(action_id, workflow, branch) {
  app.action(action_id, async ({ action, ack, client, context }) => {
    await ack();

    let messagesChannel = action.value;

    try {
      const result = await client.chat.postMessage({
        channel: messagesChannel,
        text: `${action.confirm.text.text} võtab aega kuni 5 minutit.`
      });
    } catch (error) {
      console.error(error);
    }

    //Workflow.Start("manuaalne.yml", "DeploymentTest")
    //Workflow.Start(workflow, branch)
    //StartWorkflow("staging_poff.yaml", "staging_poff");

    //kui workflow on lõpetanud siis kirjuta uuesti äppi
  });
}


buttonAction("staging_poff", "manuaalne.yml", "DeploymentTest");
buttonAction("live_poff", "manuaalne.yml", "DeploymentTest");

buttonAction("staging_just", "manuaalne.yml", "DeploymentTest");
buttonAction("live_just", "manuaalne.yml", "DeploymentTest");

buttonAction("staging_shorts", "manuaalne.yml", "DeploymentTest");
buttonAction("live_shorts", "manuaalne.yml", "DeploymentTest");

app.message("help", ({ message, say }) => {
  //<@${message.user}>!
  say(`
nupu vajutamise käivitab lehe ehitamise vastavale domeenile, mis võtab aega kuni 5 minutit

# integrations channelist saad näha kui ehitamine on õnnestunud

Kui sul on ootamise ajal igav, siis bot räägib nalju kui küsid joke, dad või momma. :)`);
});

app.message("joke", async ({ message, say, payload, body, context }) => {
  //await say(`Kas tahad nalja kuulda <@${message.user}>?`);
  console.log(say);
  Jokes.Chuck(async function log(joke) {
    await say(joke);
  });
});
app.message("momma", async ({ message, say, payload, body, context }) => {
  //await say(`Kas tahad nalja kuulda <@${message.user}>?`);
  console.log(say);
  Jokes.Momma(async function log(joke) {
    await say(joke);
  });
});
app.message("dad", async ({ message, say, payload, body, context }) => {
  //await say(`Kas tahad nalja kuulda <@${message.user}>?`);
  console.log(say);
  Jokes.Dad(async function log(joke) {
    await say(joke);
  });
});
app.message("ron", async ({ message, say, payload, body, context }) => {
  //await say(`Kas tahad nalja kuulda <@${message.user}>?`);
  console.log(say);
  Jokes.Ron(async function log(joke) {
    await say(`Ron Swanson: "${joke}"`);
  });
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();