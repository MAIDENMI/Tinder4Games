#!/usr/bin/env node

import { exec } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🎮 Tinder for Games - Launch Options\n');

const options = [
  { number: '1', name: 'iOS Simulator', command: 'open -a Simulator' },
  { number: '2', name: 'Default Browser', command: 'open http://10.0.0.235:3000' },
  { number: '3', name: 'Chrome Browser', command: 'open -a "Google Chrome" http://10.0.0.235:3000' },
  { number: '4', name: 'Safari Browser', command: 'open -a Safari http://10.0.0.235:3000' },
  { number: '5', name: 'Copy URL to Clipboard', command: 'echo "http://10.0.0.235:3000" | pbcopy' },
  { number: '6', name: 'Show QR Code (for mobile)', command: 'echo "Scan this URL on your phone: http://10.0.0.235:3000"' },
  { number: '7', name: 'Exit', command: 'exit' }
];

options.forEach(option => {
  console.log(`${option.number}. ${option.name}`);
});

console.log('\nSelect an option:');

rl.on('line', (input) => {
  const selection = input.trim();
  const option = options.find(opt => opt.number === selection);
  
  if (option) {
    if (option.command === 'exit') {
      console.log('👋 Goodbye!');
      rl.close();
      return;
    }
    
    console.log(`\n🚀 Opening ${option.name}...`);
    
    if (option.command.includes('echo')) {
      console.log(option.command.split('"')[1]);
    } else {
      exec(option.command, (error, stdout, stderr) => {
        if (error) {
          console.error(`❌ Error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`⚠️  Warning: ${stderr}`);
        }
        if (stdout) {
          console.log(`✅ ${stdout}`);
        }
        
        if (option.number === '1') {
          console.log('\n📱 iOS Simulator opened!');
          console.log('📝 Next steps:');
          console.log('   1. Tap Safari in the simulator');
          console.log('   2. Go to: http://10.0.0.235:3000');
          console.log('   3. Add to Home Screen for app-like experience');
        } else if (option.number === '5') {
          console.log('📋 URL copied to clipboard!');
          console.log('📱 Paste it in your phone\'s browser');
        } else if (option.number === '6') {
          console.log('\n📱 To open on your phone:');
          console.log('   1. Make sure your phone is on the same WiFi');
          console.log('   2. Open browser and go to: http://10.0.0.235:3000');
          console.log('   3. Add to Home Screen for best experience');
        }
      });
    }
  } else {
    console.log('❌ Invalid option. Please select 1-7.');
  }
  
  console.log('\nSelect another option (or 7 to exit):');
});

rl.on('close', () => {
  process.exit(0);
}); 