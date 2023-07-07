import { useState } from 'react'
import './App.css'
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

function App() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setLoading] = useState(false);

  const textCompletion = async (text) => {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{"role": "system", "content": text}, {role: "user", content: "Hello world"}],
    });
    return completion;
  }

  const onClick = (e) => {
    e.preventDefault();
    setLoading(true);
    if (prompt.length > 0) {
      textCompletion(prompt)
      .then((completion) => {
        setResult(completion?.data?.choices[0]?.message?.content);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setResult("Something has went wrong! :(")
        console.log(err);
      })
    }
  }

  const onInputChange = (e) => {
    e.preventDefault();
    setPrompt(e.target.value);
  }
  return (
    <div className='layout'>
      <h1 className='heading'>Ask me anything</h1>
      <div className='answer-box'>
        {isLoading ? "typing..." : result}
      </div>
      <div className='input-area'>
        <input placeholder="Ask me anything..." className="prompt-input" value={prompt} onChange={onInputChange}/>
        <button className='send-btn' onClick={onClick}>Send</button>
      </div>
    </div>
  )
}

export default App
