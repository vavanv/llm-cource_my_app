import { useEffect, useState } from 'react';
import { Button } from './components/ui/button';

function App() {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error('Error fetching message:', err));
  }, []);

  return (
    <div className="p-4">
      <p className="font-bold text-3xl">{message}</p>
      <Button onClick={() => alert('Button clicked!')}>Click me!</Button>
    </div>
  );
}

export default App;
