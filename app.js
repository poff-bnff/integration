//AKTIIVNE APP
// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");
const Workflow = require("./startWorkflow.js");
const Jokes = require("./joker");
require('dotenv').config()

//console.log(process.env.SLACK_SIGNING_SECRET)
//console.log(process.env.SLACK_BOT_TOKEN)

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});


app.message("help", ({ message, say }) => {
  //<@${message.user}>!
  say(`kirjuta vestlusesse
  poff - pöffi lehe ehitamiseks
  veel ei tööta
  (just - justi lehtede ehitamiseks)
  (industry - industry lehtede ehitamiseks)
  (shorts - shortsi lehtede ehitamiseks)
  (kinoff - kinoffi lehtede ehitamiseks)
nupu vajutamise käivitab lehe ehitamise vastvasse serverisse, mis võtab aega kuni 5 minutit
# integrations channelist saad näha kui ehitamine on õnnestunud`);
});

app.message("poff", async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "PÖFF-i eelvaate (poff_staging.inscaping.eu) ehitamiseks ->",
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Ehita PÖFF staging",
            emoji: true,
          },
          action_id: "staging_poff",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "DEV-i (dev.inscaping.eu) ehitamiseks ->",
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Ehita dev",
            emoji: true,
          },
          action_id: "dev_poff",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "PÖFF live-i (poff_live.inscaping.eu) ehitamiseks ->",
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Ehita PÖFF live",
            emoji: true,
          },
          action_id: "live_poff",
        },
      },
    ],
  });
});

app.message("just", async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "JUSTFILM-i eelvaate (staging.justfilm.ee) ehitamiseks ->",
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Ehita JUSTFILM-i eelvaade",
            emoji: true,
          },
          action_id: "staging_justfilm",
        },
      },
    ],
  });
});

app.message("industry", async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "INDUSTRY eelvaate (staging.industry.poff.ee) ehitamiseks ->",
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Ehita INDUSTRY eelvaade",
            emoji: true,
          },
          action_id: "staging_industry",
        },
      },
    ],
  });
});

app.message("shorts", async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "SHORTS-i eelvaate (staging.shorts.poff.ee) ehitamiseks ->",
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Ehita SHORTS-i eelvaade",
            emoji: true,
          },
          action_id: "staging_shorts",
        },
      },
    ],
  });
});

app.message("kinoff", async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "KINOFF eelvaate (staging.kinoff.ee) ehitamiseks ->",
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Ehita KINOFF eelvaade",
            emoji: true,
          },
          action_id: "staging_kinoff",
        },
      },
    ],
  });
});

app.action("staging_poff", async ({ action, ack, respond }) => {
  await ack();
  Workflow.Start("manuaalne.yml", "master");
  //StartWorkflow("staging_poff.yaml", "staging_poff");
  await respond(
    "Eelvaate ehitamine käivitatud. Valmis lehte näed paari minuti pärast: https://poff_staging.inscaping.eu/"
  );
});
app.action("dev_poff", async ({ action, ack, respond }) => {
  await ack();
  Workflow.Start("manuaalne.yml", "master");
  //StartWorkflow("main.yml", "master");
  await respond(
    "Eelvaate ehitamine käivitatud. Valmis lehte näed paari minuti pärast: https://dev.inscaping.eu/"
  );
});
app.action("live_poff", async ({ action, ack, respond }) => {
  await ack();
  Workflow.Start("manuaalne.yml", "master");
  //StartWorkflow("stage_2_live_poff.yml", "staging_poff");
  await respond(
    "Eelvaate ehitamine käivitatud. Valmis lehte näed paari minuti pärast: https://poff_live.inscaping.eu/"
  );
});

app.action("staging_justfilm", async ({ action, ack, respond }) => {
  await ack();
  //StartWorkflow("staging_justfilm.yaml", "staging_justfilm");
  await respond(
    "Eelvaate ehitamine käivitatud. Valmis lehte näed paari minuti pärast: https://staging.justfilm.ee"
  );
});
app.action("staging_industry", async ({ action, ack, respond }) => {
  await ack();
  //StartWorkflow("staging_industry.yaml", "staging_industry");
  await respond(
    "Eelvaate ehitamine käivitatud. Valmis lehte näed paari minuti pärast: https://staging.industry.poff.ee"
  );
});
app.action("staging_shorts", async ({ action, ack, respond }) => {
  await ack();
  //StartWorkflow("staging_shorts.yaml", "staging_shorts");
  await respond(
    "Eelvaate ehitamine käivitatud. Valmis lehte näed paari minuti pärast: https://staging.shorts.poff.ee"
  );
});
app.action("staging_kinoff", async ({ action, ack, respond }) => {
  await ack();
  //StartWorkflow("staging_kinoff.yml", "staging_kinoff");
  await respond(
    "Eelvaate ehitamine käivitatud. Valmis lehte näed paari minuti pärast: https://staging.kinoff.ee"
  );
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
