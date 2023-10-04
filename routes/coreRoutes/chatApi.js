const express = require('express');
const axios = require('axios');
const { admin, db } = require('@/firebaseDB');
require('dotenv').config({ path: '.variables.env' });
//your own api key from OpenAIApi
const apiKey = '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';

async function requestOpenAI(message) {
  const response = await axios.post(
    'https://api.openai.com/v1/completions',
    {
      prompt: `
        You: Your name is ShoolepAI,
        You: You are artificial intelligence, you answer exactly like chatGPT and openai,
        Me: I am a person who asks about various things
        
        Me: What is a fish?
        You: A fish is an animal species that lives in an aquatic environment and its body is covered with scales. Many types of fish are found in water such as rivers, lakes, seas and oceans. Fish are an important source of food for humans and are also important for the ecosystem of aquatic habitats.
      
        Me: ${message}, ., ?, !,
        You:  
       `,
      max_tokens: 50,
      temperature: 0,
      frequency_penalty: 0.0,
      top_p: 1,
      model: 'text-davinci-003',
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );
  return response.data?.choices[0].text;
}
function updateUserRequestCount({ userId, userChatRequestCount }) {
  if (!userChatRequestCount) {
    userChatRequestCount = 1;
  } else {
    userChatRequestCount++;
  }
  return db.doc(`users/${userId}`).update({ userChatRequestCount });
}
const router = express.Router();
const USER_FREE_REQUEST_LIMIT = parseInt(process.env.USER_FREE_REQUEST_LIMIT);

router.route('/chat').post(async (req, res) => {
  try {
    const user = await admin.auth().verifyIdToken(req.headers.authorization);
    const { message } = req.body;
    const userDocSnapshot = await db.doc(`users/${user.user_id}`).get();
    let userChatRequestCount = userDocSnapshot.data().userChatRequestCount;

    if (user.stripeRole) {
      const subsDocs = await admin
        .firestore()
        .collection(`users/${user.user_id}/subscriptions`)
        .where('status', 'in', ['trialing', 'active'])
        .get();
      const subDoc = subsDocs.docs[0];
      const interval = subDoc.data().items[0].price.recurring.interval;
      let requestLimit = parseInt(subDoc.data().items[0].price.product.metadata.requestsLimit);
      if (interval === 'year') {
        requestLimit *= 12;
      }
      if (userChatRequestCount >= requestLimit) {
        res
          .status(200)
          .json({ message: 'You have reached your limit! please subscribe to our plans' });
      } else {
        const responseMessage = await requestOpenAI(message);
        await updateUserRequestCount({ userId: user.user_id, userChatRequestCount });
        res.status(200).json({ message: responseMessage });
      }
    } else {
      if (userChatRequestCount >= USER_FREE_REQUEST_LIMIT) {
        res
          .status(200)
          .json({ message: 'You have reached your limit! please subscribe to our plans' });
      } else {
        const responseMessage = await requestOpenAI(message);
        await updateUserRequestCount({ userId: user.user_id, userChatRequestCount });
        res.status(200).json({ message: responseMessage });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: error.message });
  }
});

module.exports = router;
