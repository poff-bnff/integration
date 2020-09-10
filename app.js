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

app.message("help", ({ message, say }) => {
  //<@${message.user}>!
  say(`
nupu vajutamise käivitab lehe ehitamise vastvasse serverisse, mis võtab aega kuni 5 minutit

# integrations channelisse tuleb teadaanne kui ehitamine on õnnestunud

Kui sul on ootamise ajal igav, siis bot räägib nalju kui küsid joke, dad või momma. :)`);
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
          OneAction("Pöff DEV", "dev_poff", "dev.inscaping.eu ehitamine", event.channel),
          OneAction("Pöff STAGING", "staging_poff", "poff_staging.inscaping.eu ehitamine", event.channel),
          OneAction("Pöff LIVE", "live_poff", "poff_live.inscaping.eu ehitamine", event.channel)
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
    //StartWorkflow("staging_poff.yaml", "staging_poff");

    //kui workflow on lõpetanud siis kirjuta uuesti äppi
  });
}


buttonAction("staging_poff", "manuaalne.yml", "DeploymentTest");
buttonAction("dev_poff", "manuaalne.yml", "DeploymentTest");
buttonAction("live_poff", "manuaalne.yml", "DeploymentTest");

// app.action("staging_justfilm", async ({ action, ack, respond }) => {
//   await ack();
//   //StartWorkflow("staging_justfilm.yaml", "staging_justfilm");
//   await respond(
//     "Eelvaate ehitamine käivitatud. Valmis lehte näed paari minuti pärast: https://staging.justfilm.ee"
//   );
// });
// app.action("staging_industry", async ({ action, ack, respond }) => {
//   await ack();
//   //StartWorkflow("staging_industry.yaml", "staging_industry");
//   await respond(
//     "Eelvaate ehitamine käivitatud. Valmis lehte näed paari minuti pärast: https://staging.industry.poff.ee"
//   );
// });
// app.action("staging_shorts", async ({ action, ack, respond }) => {
//   await ack();
//   //StartWorkflow("staging_shorts.yaml", "staging_shorts");
//   await respond(
//     "Eelvaate ehitamine käivitatud. Valmis lehte näed paari minuti pärast: https://staging.shorts.poff.ee"
//   );
// });
// app.action("staging_kinoff", async ({ action, ack, respond }) => {
//   await ack();
//   //StartWorkflow("staging_kinoff.yml", "staging_kinoff");
//   await respond(
//     "Eelvaate ehitamine käivitatud. Valmis lehte näed paari minuti pärast: https://staging.kinoff.ee"
//   );
// });


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
