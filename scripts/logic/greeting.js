
/* Greeting Logic - Time-based greeting functionality
 * Displays appropriate greetings based on time of day
 */

export function initGreeting() {
  displayGreeting();
  console.log('Greeting system initialized');
}

// Time calculation helpers
function getCurrentHour() {
  return new Date().getHours();
}

function isMorning(hour) {
  return hour >= 6 && hour < 12;
}

function isAfternoon(hour) {
  return hour >= 12 && hour < 18;
}

function isEvening(hour) {
  return hour >= 18 && hour < 22;
}

function isNight(hour) {
  return hour >= 22 || hour < 6;
}

// Greeting message helpers
function getMorningGreeting() {
  return "Günaydın";
}

function getAfternoonGreeting() {
  return "İyi günler";
}

function getEveningGreeting() {
  return "İyi akşamlar";
}

function getNightGreeting() {
  return "İyi geceler";
}

function getTimeBasedGreeting() {
  const hour = getCurrentHour();
  
  if (isMorning(hour)) {
    return getMorningGreeting();
  } else if (isAfternoon(hour)) {
    return getAfternoonGreeting();
  } else if (isEvening(hour)) {
    return getEveningGreeting();
  } else {
    return getNightGreeting();
  }
}

// Display helpers
function formatGreetingMessage(greeting) {
  return `${greeting}! Toolvana'ya hoş geldiniz.`;
}

function logGreeting(greeting) {
  const message = formatGreetingMessage(greeting);
  console.log(message);
}

function findGreetingElement() {
  return document.querySelector('.greeting-display');
}

function updateGreetingUI(greeting) {
  const greetingElement = findGreetingElement();
  if (greetingElement) {
    greetingElement.textContent = formatGreetingMessage(greeting);
  }
}

function displayGreeting() {
  const greeting = getTimeBasedGreeting();
  logGreeting(greeting);
  updateGreetingUI(greeting);
}

export function getCurrentGreeting() {
  return getTimeBasedGreeting();
}
