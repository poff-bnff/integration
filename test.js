const ChannelId = 'C018L2CV5U4';

(async () => {
      try {
    // Call chat.postMessage with the built-in client
    const result = await client.chat.postMessage({
      channel: ChannelId,
      text: `Test 1 2 3`
    });
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }

  })();



// {
//   id: '',
//   buildNumber: '',
//   startTime: '',
//   initiator: '',
//   commit: '',
//   domain: '',
//   user: '',
//   succeeding: ''
// }
