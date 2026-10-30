ASSIGNMENT 6 — SELECTOR DETECTIVE + THE PARTY IN MOTION

Files:
- index.html
- style.css
- script.js

TASK 1
1. The party is stored as a JavaScript array: 4 rooms, floor numbers, and guests from left to right.
2. The page is built from the array with jQuery. Each guest card stores information in CSS classes and data-* attributes.
3. Cases 1–20 are buttons. Each case displays: Question, Answer, number of results, names, and the jQuery selector/method used.
4. The cases search the rendered DOM, not the party array.
5. Search also lets you find guests by name/data-name, CSS class/color, room/data-room, floor/data-floor, belongings/classes, AITU status, or arrival time/data-time.
6. Cases 18 and 19 change the party with fadeIn/fadeOut/remove.

TASK 2
- Spotlight: matched guests stay bright; other guests fade to 20% in 0.3s. Room results spotlight the room's guests.
- Guest card: click a guest; details open from the avatar with jQuery animation. Esc or outside click closes it.
- Move: choose another room. The guest flies to the new room and the party array is updated.
- Sort by time: each room can be sorted earliest-to-latest and restored to picture order.
- Fast clicks: animations use stop(true, true) to prevent effect queues.

IMPORTANT
- jQuery is loaded from the official CDN in index.html, so an internet connection is needed.
- No CSS transitions or @keyframes are used for the assignment effects.
- Open index.html with VS Code Live Server for the easiest testing.
