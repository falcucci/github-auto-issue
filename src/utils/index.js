import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";

export async function fetchSSE(options) {
  const { onMessage, body } = options;
  let counter = 0;
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const prompt =
    `I will give you an issue title and I want you to describe it in two paragraphs with blank lines between them in a consistent and technical way without repeat yourself: \n${body}`;

  const payload = {
    model: "text-davinci-003",
    prompt,
    temperature: 0.5,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 200,
    stream: true,
    n: 1,
  };

  const personalToken = "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

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

const init = async () => {
  await domLoaded;
  await elementReady(".edit-comment-hide");
  observe(".edit-comment-hide", {
    add: element => {
      element.append("text");
      const issueDiv = select(".edit-comment-hide");
      issueDiv.append("text");
    },
  });

  const stream = await fetchSSE();
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  const { value, done } = await reader.read();
  if (done) {
    console.log("Stream complete");
    return;
  }
  const chunkValue = decoder.decode(value);
  console.log(chunkValue);
};
