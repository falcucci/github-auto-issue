import { createParser } from "eventsource-parser";

import optionsStorage from "../options-storage";

export async function fetchSSE(options) {
  const { onMessage, body } = options;
  const { personalToken } = await optionsStorage.getAll();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const prompt = `I will give you an issue title and I want you to describe it in two paragraphs with blank lines between them in a consistent and technical way without repeat yourself: \n${body}`;

  const payload = {
    model: "text-davinci-003",
    prompt,
    temperature: 1,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 4000,
    stream: true,
    n: 1,
  };

  const res = await fetch(
    "https://api.openai.com/v1/completions",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${personalToken}`,
      },
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  let counter = 0;
  const stream = new ReadableStream({
    async start(controller) {
      // callback
      function onParse(event) {
        if (event.type === "event") {
          const data = event.data;
          if (data === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const text = json.choices[0].text;
            if (counter < 2 && (text.match(/\n/) || []).length) {
              // this is a prefix character (i.e., "\n\n"), do nothing
              return;
            }

            onMessage(text);
            const queue = encoder.encode(text);
            controller.enqueue(queue);
            counter++;
          } catch (e) {
            // maybe parse error
            controller.error(e);
          }
        }
      }

      // stream response (SSE) from OpenAI may be fragmented into multiple chunks
      // this ensures we properly read chunks and invoke an event for each SSE event stream
      const parser = createParser(onParse);
      for await (const chunk of res.body) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
}
