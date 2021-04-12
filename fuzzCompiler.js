const prompt = require("prompt-sync")();
var fs = require('fs');

const compile = (fileName, showTape) => {
  // -- Initialize Comiler vars --//
  let tape = Array(16).fill(0);
  let pointer = 0;
  let isLooping = false;
  let loopStack = [];
  let innerLoops = 0;

  // -- Load BF file -- //
  fs.readFile(fileName, 'utf8', function(err, data) {
      if (err) throw err;
      runCompile(data); //Call compilation function with loaded data
  });

  // -- The 8 brainf*ck options -- //
  const incPointer = "✨".charCodeAt();     // > Move pointer right
  const decPointer = "⭐".charCodeAt();     // < Move pointer left
  const Increment = "🦄".charCodeAt();      // + Increase pointer
  const Decrement = "🎀".charCodeAt();      // - Decrease pointer
  const Output = "❤️".charCodeAt();         // . Output value in pointer
  const Input = "💕".charCodeAt();          // , Input char from user
  const leftBrace = "[".charCodeAt();       // [ Go to next instruction if != 0
  const rightBrace = "]".charCodeAt();      // ] Go to previous brace if != 0

  // -- Compilation function -- //
  const runCompile = (inputData) => {
    for (let i = 0; i < inputData.length; i++) {
      const char = inputData[i].charCodeAt();
  
      if (isLooping) {
        char.charCodeAt() === leftBrace ? innerLoops++
          : innerLoops === 0 ? (isLooping = false)
          : innerLoops--;
      }
  
      switch (char) {
        case Increment:
          tape[pointer]++;
          break;
        case Decrement:
          tape[pointer]--;
          break;
        case incPointer:
          pointer++;
          tape[pointer] = tape[pointer] || 0;
          break;
        case decPointer:
          pointer--;
          tape[pointer] = tape[pointer] || 0;
          break;
        case Output:
          console.log(String.fromCharCode(tape[pointer]));
          break;
        case Input:
          tape[pointer] = prompt()[0].charCodeAt();
          break;
        case leftBrace:
          tape[pointer] === 0 ? (isLooping = true) : loopStack.push(i);
          break;
        case rightBrace:
          tape[pointer] !== 0
            ? (i = loopStack[loopStack.length - 1])
            : loopStack.pop();
          break;
      }
    }
    showTape &&
      console.log(
        "====================================================\nTape: " +
          tape +
          "\n===================================================="
      );
  }
}



// -- Compiler Input -- //
compile("helloWorld.bf", true);
