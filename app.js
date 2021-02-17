const { App, ExpressReceiver } = require("@slack/bolt");
const newWorkflow = require("./startNewWorkflow.js");
//require("dotenv").config();
const bodyParser = require("body-parser");

let jsonParser = bodyParser.json();

//console.log(process.env.SLACK_SIGNING_SECRET)
//console.log(process.env.SLACK_BOT_TOKEN)
//fail channel, integration channel, webhook to github secrets???

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
    if (status === "failure") {
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
    if (req.body.channel && req.body.user){
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
    }

    res.status(200).end(); // Responding is important
  });
}

listenToDeploy();

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
          OneAction("Pöff STAGING", "staging_poff", "staging.poff.inscaping.eu ehitamine", event.channel),
          OneAction("Pöff LIVE", "live_poff", "poff.ee ehitamine", event.channel),
        ],
      },
      makeHeader("JUSTFILM"),
      {
        type: "actions",
        elements: [
          OneAction("Justfilm STAGING", "staging_just", "staging.justfilm.inscaping.eu ehitamine", event.channel),
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
      makeHeader("INDUSTRY"),
      {
        type: "actions",
        elements: [
          OneAction("Industry STAGING", "staging_industry", "staging.industry.inscaping.eu ehitamine", event.channel),
          OneAction("Industry LIVE", "live_industry", "industry.poff.ee ehitamine", event.channel),
        ],
      },
      makeHeader("KINOFF"),
      {
        type: "actions",
        elements: [
          OneAction("Kinoff STAGING", "staging_kinoff", "staging.kinoff.inscaping.eu ehitamine", event.channel),
          OneAction("Kinoff LIVE", "live_kinoff", "kinoff.poff.ee ehitamine", event.channel),
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
      // makeHeader("TEST (ära palun vajuta)"),
      // {
      //   type: "actions",
      //   elements: [
      //     OneAction("TEST", "test", "Testin teadaannet", event.channel),
      //   ],
      // },
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

function newButtonAction(action_id, workflow, branch) {
  app.action(action_id, async ({action, ack, client, context, body}) => {
    await ack();
    //nupu vajutaja vestluskanal
    let messagesChannel = action.value;
    let slackUserId = body.user.id;
    try {
      const result = await client.chat.postMessage({
        channel: messagesChannel,
        text: `${action.confirm.text.text} käivitatud. Kui on valmis annan sulle märku.`,
      });
    } catch (error) {
      console.error(error);
    }
    console.log("outgoing....")
    newWorkflow.Start(workflow, branch, slackUserId, messagesChannel);
  });
}

newButtonAction("staging_poff", "5828091", "staging_poff");
newButtonAction("live_poff", "5828086", "staging_poff");

newButtonAction("staging_just", "5828089", "staging_justfilm");
newButtonAction("live_just", "5828084", "staging_justfilm");

newButtonAction("staging_shorts", "5828092", "staging_shorts");
newButtonAction("live_shorts", "5828087", "staging_shorts");

newButtonAction("staging_industry", "5828088", "staging_industry");
newButtonAction("live_industry", "5828083", "staging_industry");

newButtonAction("staging_kinoff", "5828090", "staging_kinoff");
newButtonAction("live_kinoff", "5828085", "staging_kinoff");

// newButtonAction("test", "2381766", "DeploymentTest");

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

Messages tab siin on privaatne ainult sina ja deployBot näete.`);
});


(async () => {
  // Start your app
  const port = process.env.PORT || 3003
  await app.start(port);
  console.log("⚡️ Bolt app is running at", port);
})();