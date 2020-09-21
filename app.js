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
      makeHeader("PÖFF"),
      {
        type: "actions",
        elements: [
          OneAction(
            "Pöff STAGING",
            "staging_poff",
            "staging.poff.inscaping.eu/ ehitamine",
            event.channel
          ),
          OneAction(
            "Pöff LIVE",
            "live_poff",
            "poff.ee/ ehitamine",
            event.channel
          )
        ]
      },
      makeHeader("JUSTFILM"),
      {
        type: "actions",
        elements: [
          OneAction(
            "Justfilm STAGING",
            "staging_just",
            "staging.justfilm.inscaping.eu/ ehitamine",
            event.channel
          ),
          OneAction(
            "Justfilm LIVE",
            "live_just",
            "justfilm.inscaping.eu/ ehitamine",
            event.channel
          )
        ]
      },
      makeHeader("SHORTS"),
      {
        type: "actions",
        elements: [
          OneAction(
            "Shorts STAGING",
            "staging_shorts",
            "staging.shorts.inscaping.eu/ ehitamine",
            event.channel
          ),
          OneAction(
            "Shorts LIVE",
            "live_shorts",
            "shorts.inscaping.eu/ ehitamine",
            event.channel
          )
        ]
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: 'Alguses STAGING -> vaata üle, kui kõik on õige, siis LIVE.'
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: 'Kirjuta "help" vestluses, et saada rohkem infot'
        }
      }
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
        text: `${action.confirm.text.text} käivitatud. Kui on valmis tuleb teadaanne #integrations channelisse`
      });
    } catch (error) {
      console.error(error);
    }

    Workflow.Start(workflow, branch);

    //kui workflow on lõpetanud siis kirjuta uuesti äppi
    //käivitab workflow github-is ja hakkab kuulama
    //github saadab actioni lõpus post päringu ja selle peale saadab äpp messagesChennelisse sõnumi
  });
}

buttonAction("staging_poff", "2530081", "staging_poff");
buttonAction("live_poff", "2471586", "staging_poff");

buttonAction("staging_just", "staging_justfilm.yml", "staging_justfilm");
buttonAction("live_just", "stage_2_live_justfilm.yml", "staging_justfilm");

buttonAction("staging_shorts", "staging_shorts.yml", "staging_shorts");
buttonAction("live_shorts", "stage_2_live_shorts.yml", "staging_shorts");

app.message("help", ({ message, say }) => {
  //<@${message.user}>!
  say(`
Home sektsioon:

STAGING nupu vajutamisel:
  - tõmmatakse Strapist värske info
  - ehitatakse vastav leht 

LIVE nupu vajutamisel
  - ehitatakse live domeenile see, mis on stagingus

Selleks, et värkse info Strapist live lehele jõuaks peab alati ehitama alguses stagingu ja alles siis live-i.

Kui leht on valmis tuleb teadaanne # integrations channelisse. Ehitamine võib võtta aega kuni 5 minutit. 

Kui # integration channeli teadaanne anna märku ebaõnnestumisest võta ühendust arendajatega. 

# integration channel on avalik -> sõnumeid näevad kõik, kes seal on

Messages tab siin on privaatne ainult sina ja deployBot näete.

Kui sul on ootamise ajal igav, siis deployBot räägib nalju kui küsid joke, dad või momma. :)`);
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
