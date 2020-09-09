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
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

//app.event('app_home_opened', ({ event, say }) => {
//   say(`Tere hommikust, <@${event.user}>!`);
//});

app.event("app_home_opened", async ({ event, context }) => {
  try {
    /* view.publish is the method that your app uses to push a view to the Home tab */
    const result = await app.client.views.publish({
      /* retrieves your xoxb token from context */
      token: context.botToken,
      /* the user that opened your app's app home */
      user_id: event.user,

      /* the view object that appears in the app home*/
      view: {
        type: "home",
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "PÖFF ",
              emoji: true
            }
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                action_id: "test",
                text: {
                  type: "plain_text",
                  text: "Ehita eelvaade",
                  emoji: true
                },
                confirm: {
                  title: {
                    type: "plain_text",
                    text: "Kas oled kindel?"
                  },
                  text: {
                    type: "mrkdwn",
                    text: "manuaalne.yml"
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
              },

              {
                type: "button",
                action_id: "test2",
                text: {
                  type: "plain_text",
                  text: "Ehita live",
                  emoji: true
                },
                confirm: {
                  title: {
                    type: "plain_text",
                    text: "Kas oled kindel?"
                  },
                  text: {
                    type: "mrkdwn",
                    text: "poff.ee domeenile värske infoga lehe ehitamine"
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
              }
            ]
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text:
                "Eelvaade on <https://poff.staging.ee|siin.> Live leht on <https://poff.ee|siin.> "
            }
          }
        ]
      }
    });
  } catch (error) {
    console.error(error);
  }
});

//workspace T01A76UKPKN
//channel C01A11E0D8S

let makingBotsForSlackChannel = "C01A11E0D8S";
let messagesChatChannel = "D019Y8U2361"

app.action("test", async ({ ack, payload, body, context, action, client }) => {
  // Acknowledge the action
  await ack();
  //console.log(`${body.user.username} vajutas ${payload.text.text} (action: ${payload.action_id}) nuppu`);
  try {
    // Call chat.postMessage with the built-in client
    const result = await client.chat.postMessage({
      token: context.botToken,
      channel: messagesChatChannel,
      //text: `${body.user.username} vajutas ${payload.text.text} (action: ${payload.action_id}) nuppu`
      text: `${action.confirm.text.text} käivitatud.`
      
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
  Workflow.Start("manuaalne.yml", "DeploymentTest")

});

app.action("test2", async ({ ack, payload, body, context, action }) => {
  // Acknowledge the action
  await ack();
  //selle vastuse peaks saatma siis kui github saadab vastuse
  console.log(
    `${body.user.name} vajutas ${payload.text.text} (action: ${payload.action_id}) nuppu`
  );

  //Workflow.Start("manuaalne.yml", "master")

  //  await say(`<@${body.user.id}> clicked the button`);
});

// channel: D019Y8U2361

app.message("joke", async ({ message, say, payload, body, context }) => {
  //await say(`Kas tahad nalja kuulda <@${message.user}>?`);
  console.log(say)
  Jokes.Chuck(async function log(joke){
       await say(joke)
  })
});
app.message("momma", async ({ message, say, payload, body, context }) => {
  //await say(`Kas tahad nalja kuulda <@${message.user}>?`);
  console.log(say)
  Jokes.Momma(async function log(joke){
       await say(joke)
  })
});
app.message("dad", async ({ message, say, payload, body, context }) => {
  //await say(`Kas tahad nalja kuulda <@${message.user}>?`);
  console.log(say)
  Jokes.Dad(async function log(joke){
       await say(joke)
  })
});
app.message("ron", async ({ message, say, payload, body, context }) => {
  //await say(`Kas tahad nalja kuulda <@${message.user}>?`);
  console.log(say)
  Jokes.Ron(async function log(joke){
       await say(`Ron Swanson: "${joke}"`)
  })
});




(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
