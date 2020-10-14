const { App, ExpressReceiver } = require("@slack/bolt");
const Workflow = require("./startWorkflow.js");
const newWorkflow = require("./startNewWorkflow.js");
const Jokes = require("./joker");
//require("dotenv").config();
const bodyParser = require("body-parser");

let jsonParser = bodyParser.json();

//console.log(process.env.SLACK_SIGNING_SECRET)
//console.log(process.env.SLACK_BOT_TOKEN)

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  endpoints: "/slack/events"
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver
});

const integrationsChannelId = "C018L2CV5U4"; //siia saada kõik teated
const failChannel = "C01CACTJW6S"; //siia kõik failinud deploy actonid

// see kuulab post päringuid ja
function listenToDeploy() {
  receiver.router.post("/hook", jsonParser, async (req, res) => {
    console.log("incoming....")
    console.log(req.body)
    let status = req.body.status;

    // Kõik lähevad integrations channelisse
    try {
      const result = await app.client.chat.postMessage({
        token: process.env.SLACK_BOT_TOKEN,
        channel: integrationsChannelId,
        text: req.body.text,
        attachments: req.body.attachments
      });
      //console.log(result);
    } catch (error) {
      console.error(error);
    }

    //ainult failid lähevad failChannelisse
    if (status === "fail") {
      try {
        const result = await app.client.chat.postMessage({
          token: process.env.SLACK_BOT_TOKEN,
          channel: failChannel,
          text: req.body.text,
          attachments: req.body.attachments
        });
        //console.log(result);
      } catch (error) {
        console.error(error);
      }
    }
    
    //slacki kasutaja nupu vajutusel käima läinud workflow lõpust tevitatakse vajutajat
    //ainult siis kui kasutaja ja channel on slacki-ile omasel kujul
    if (req.body.channel.startsWith("D") && req.body.user.startsWith("U")) {
      try {
        const result = await app.client.chat.postMessage({
          token: process.env.SLACK_BOT_TOKEN,
          channel: req.body.channel,
          text: req.body.PM
        });
        //console.log(result);
      } catch (error) {
        console.error(error);
      }
    }

    res.status(200).end(); // Responding is important
  });
}

listenToDeploy();


// receiver.router.post('/hook', jsonParser, async (req, res) => {
//   console.log(req.body); // Call your action on the request here
//    const integrationsChannelId = 'C018L2CV5U4';
//    let commitLink = `https://github.com/poff-bnff/web/commit/${req.body.commit}`
//    let user 
//    if (req.body.data.slackUserId ===""){
//      user = "arendaja"
//    }else {
//      user = req.body.data.slackUserId
//    }
//    let event = req.body.event
   
//    try {
//    const result = await app.client.chat.postMessage({
//      token: process.env.SLACK_BOT_TOKEN,
//      channel: integrationsChannelId,
//      text: `<@${user}> ehitas ${req.body.workflow}`
//    });
//        //console.log(result);
//  }
//  catch (error) {
//    console.error(error);
//  }

//   res.status(200).end(); // Responding is important
// });

function OneAction(buttonText, actionId, modalText, chatChannel) {
  let OneAction = {
    type: "button",
    action_id: actionId,
    text: {
      type: "plain_text",
      text: buttonText,
      emoji: true,
    },
    value: chatChannel,
    confirm: {
      title: {
        type: "plain_text",
        text: "Kas oled kindel?",
      },
      text: {
        type: "mrkdwn",
        text: modalText,
      },
      confirm: {
        type: "plain_text",
        text: "Jah",
      },
      deny: {
        type: "plain_text",
        text: "Ei",
      },
    },
  };
  return OneAction;
}

function makeHeader(HeaderText) {
  let header = {
    type: "header",
    text: {
      type: "plain_text",
      text: HeaderText,
      emoji: true,
    },
  };
  return header;
}

app.event("app_home_opened", async ({
  event,
  context
}) => {
  let viewObject = {
    type: "home",
    blocks: [
      makeHeader("PÖFF"),
      {
        type: "actions",
        elements: [
          OneAction("Pöff STAGING", "staging_poff", "staging.poff.inscaping.eu/ ehitamine", event.channel),
          OneAction("Pöff LIVE", "live_poff", "poff.ee ehitamine", event.channel),
        ],
      },
      makeHeader("JUSTFILM"),
      {
        type: "actions",
        elements: [
          OneAction("Justfilm STAGING", "staging_just", "staging.justfilm.inscaping.eu/ ehitamine", event.channel),
          OneAction("Justfilm LIVE", "live_just", "justfilm.ee ehitamine", event.channel),
        ],
      },
      makeHeader("SHORTS"),
      {
        type: "actions",
        elements: [
          OneAction("Shorts STAGING", "staging_shorts", "staging.shorts.inscaping.eu/ ehitamine", event.channel),
          OneAction("Shorts LIVE", "live_shorts", "shorts.poff.ee ehitamine", event.channel),
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Alguses STAGING -> vaata üle, kui kõik on õige, siis LIVE.",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: 'Kirjuta "help" vestluses, et saada rohkem infot',
        },
      },
      makeHeader("TEST (ära palun vajuta)"),
      {
        type: "actions",
        elements: [
          OneAction("TEST", "test", "Testin teadaannet", event.channel),
        ],
      },
    ],
  };
  try {
    /* view.publish is the method that your app uses to push a view to the Home tab */
    const result = await app.client.views.publish({
      /* retrieves your xoxb token from context */
      token: context.botToken,
      /* the user that opened your app's app home */
      user_id: event.user,
      /* the view object that appears in the app home*/
      view: viewObject,
    });
  } catch (error) {
    console.error(error);
  }
});

function buttonAction(action_id, workflow, branch) {
  app.action(action_id, async ({action, ack, client, context, body}) => {
    await ack();
    //nupu vajutaja vestluskanal 
    let messagesChannel = action.value;
    let slackUserId = body.user.id;
    try {
      const result = await client.chat.postMessage({
        channel: messagesChannel,
        text: `${action.confirm.text.text} käivitatud. Kui on valmis tuleb teadaanne #integrations channelisse`,
      });
    } catch (error) {
      console.error(error);
    }
    Workflow.Start(workflow, branch);
  });
}

function newButtonAction(action_id, workflow, branch) {
  app.action(action_id, async ({action, ack, client, context, body}) => {
    await ack();
    //nupu vajutaja vestluskanal 
    let messagesChannel = action.value;
    let slackUserId = body.user.id;
    try {
      const result = await client.chat.postMessage({
        channel: messagesChannel,
        text: `${action.confirm.text.text} käivitatud. Kui on valmis tuleb teadaanne #integrations channelisse`,
      });
    } catch (error) {
      console.error(error);
    }
    newWorkflow.Start(workflow, branch, slackUserId, messagesChannel);
    console.log("outgoing....")
  });
}

buttonAction("staging_poff", "2530081", "staging_poff");
buttonAction("live_poff", "2471586", "staging_poff");

buttonAction("staging_just", "2530079", "staging_justfilm");
buttonAction("live_just", "2471584", "staging_justfilm");

buttonAction("staging_shorts", "2530082", "staging_shorts");
buttonAction("live_shorts", "2471581", "staging_shorts");

newButtonAction("test", "2381766", "DeploymentTest");

//id saad pärida postmanis https://api.github.com/repos/poff-bnff/web/actions/workflows

app.message("help", ({say}) => {
  //<@${message.user}>!
  say(`Home sektsioon:

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

app.message("joke", async ({say}) => {
  //await say(`Kas tahad nalja kuulda <@${message.user}>?`);
  //console.log(say);
  Jokes.Chuck(async function log(joke) {
    await say(joke);
  });
});
app.message("momma", async ({say}) => {
  //await say(`Kas tahad nalja kuulda <@${message.user}>?`);
  // console.log(say);
  Jokes.Momma(async function log(joke) {
    await say(joke);
  });
});
app.message("dad", async ({say}) => {
  //await say(`Kas tahad nalja kuulda <@${message.user}>?`);
  // console.log(say);
  Jokes.Dad(async function log(joke) {
    await say(joke);
  });
});
app.message("ron", async ({say}) => {
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