// A small Node.js test script to test the logic
const fs = require('fs');
const appJsCode = fs.readFileSync('mockup/app.js', 'utf-8');

// Mock a lightweight browser environment
global.window = {};
global.document = {
    getElementById: () => ({ innerHTML: '' }) // mock DOM element
};

// Expose variables for testing
global.alert = console.log;

// Evaluate app.js logic globally
const codeToEval = appJsCode + `;
    global.currentState = currentState;
    global.mockData = mockData;
    global.handleIntelligentNavigation = handleIntelligentNavigation;
`;
eval(codeToEval);

console.log("=== Testing Navigation State ===");

console.log(`Current View before test: ${global.currentState.view}`);

// Test Scenario A: Click on a historical document (DOC1-V1)
console.log("-> Clicking Historical Document DOC1-V1...");
global.handleIntelligentNavigation('DOC1-V1');
console.log(`Expected: I15, Got: ${global.currentState.view}`);
if (global.currentState.view !== 'I15') throw new Error("Test Failed");

// Test Scenario B: Click on an active document (DOC2-V1)
console.log("-> Clicking Active Document DOC2-V1...");
global.handleIntelligentNavigation('DOC2-V1');
console.log(`Expected: I11, Got: ${global.currentState.view}`);
if (global.currentState.view !== 'I11') throw new Error("Test Failed");

// Test Scenario A: Click on a historical sub-process (None available, so let's mock one temporarily)
global.mockData.subProcessos.push({ id: 'SP2-V1', status: 'Inativo', donos: [], documentosId: [] });
console.log("-> Clicking Historical Sub-process SP2-V1...");
global.handleIntelligentNavigation('SP2-V1');
console.log(`Expected: I14, Got: ${global.currentState.view}`);
if (global.currentState.view !== 'I14') throw new Error("Test Failed");

// Test Scenario B: Click on an active sub-process (SP1-V1)
console.log("-> Clicking Active Sub-process SP1-V1...");
global.handleIntelligentNavigation('SP1-V1');
console.log(`Expected: I7, Got: ${global.currentState.view}`);
if (global.currentState.view !== 'I7') throw new Error("Test Failed");

console.log("=== All tests passed! ===");
