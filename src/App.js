import React, { useState } from 'react';
import './App.css';
import Lesson2Canvas from './lessons/lesson-2'

function App() {
  const [lesson, setLesson] = useState('lesson2')
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => setLesson('lesson2')}>Lesson2</button>
        <button>Lesson3</button>
        <button>Lesson4</button>

      </header>
      {lesson === 'lesson2' && <Lesson2Canvas></Lesson2Canvas>}
    </div>
  );
}

export default App;
