
const { spawn } = require('child_process');
const child = spawn('tsc', []);

// use child.stdout.setEncoding('utf8'); if you want text chunks
child.stdout.on('data', (chunk) => {
  // data from standard output is here as buffers
	console.log("chunk", chunk.toString("utf8"));
});

// since these are streams, you can pipe them elsewhere
//child.stderr.pipe(dest);

child.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
