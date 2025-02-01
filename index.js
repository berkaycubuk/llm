#!/usr/bin/env node
import ollama from 'ollama';

async function generate(prompt) {
  const response = await ollama.generate({
      prompt,
      model: 'llama3.2:latest',
  });

  return response.response;
}

if (process.stdin.isTTY) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
      console.error('Usage: llm prompt');
      process.exit(1);
  }

  const prompt = args[0];

  console.log(await generate(prompt));
} else {
  // If there is piped input, read from stdin
  let inputData = '';

  // Collect data from stdin
  process.stdin.on('data', (chunk) => {
    inputData += chunk.toString();
  });

  // When the input ends, process the collected data
  process.stdin.on('end', () => {
    generate(inputData).then(res => {
      console.log(res);
    })
  });
}

