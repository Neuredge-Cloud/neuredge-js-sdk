import Neuredge from '../dist';

async function main() {
    // Initialize the client without /v1 in baseUrl
    const neuredge = new Neuredge({
        apiKey: 'nrkey_239f055f1a3acc1b576e91e6489b7a6c',
        baseUrl: 'http://127.0.0.1:8787' // Remove /v1 since it's handled internally
    });

    const summary = await neuredge.text.summarize(
        'Workers AI allows you to run machine learning models, on the Cloudflare network, from your own code – whether that be from Workers, Pages, or anywhere via the Cloudflare API. With the launch of Workers AI, Cloudflare is slowly rolling out GPUs to its global network. This enables you to build and deploy ambitious AI applications that run near your users, wherever they are.'
    );

    const translation = await neuredge.text.translate(
        'Hello, how are you?',
        'es', // target language
        'en'  // source language (optional)
    );

    const sentiment = await neuredge.text.analyzeSentiment(
        'I absolutely love this product!'
      );

      const customImage = await neuredge.image.generate(
        'A magical forest with glowing mushrooms',
        {
          mode: 'standard',
          width: 1024,
          height: 768,
          guidance: 8.5,
          negativePrompt: 'dark, scary, spooky',
        }
      );

    console.log("SUMMARY - ", summary);
    console.log("TRANSLATION - ", translation);
    console.log("SENTIMENT - ", sentiment);
    console.log("CUSTOM IMAGE - ", customImage);
}

main().catch(console.error);