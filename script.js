/* Assignment 6 — all page behavior uses jQuery. */
$(function () {
  "use strict";

  const initialParty = [
    { id: "balcony", name: "Balcony", floor: 2, guests: [
      { name: "Aigerim", color: "green", time: "20:45", aitu: true, things: ["cup", "crumbs"] },
      { name: "Aliya", color: "black", time: "21:15", aitu: false, things: ["phone", "cup"] },
      { name: "Madina", color: "green", time: "22:10", aitu: false, things: ["phone", "bag", "crumbs"] },
      { name: "Ivan", color: "black", time: "20:10", aitu: true, things: ["cup"] }
    ]},
    { id: "hall", name: "Hall", floor: 2, guests: [
      { name: "Arman", color: "yellow", time: "20:35", aitu: false, things: ["bag", "glasses"] },
      { name: "Sophia", color: "purple", time: "21:20", aitu: true, things: ["phone"] },
      { name: "Dias", color: "green", time: "19:45", aitu: true, things: [] },
      { name: "Bekzat", color: "purple", time: "20:55", aitu: false, things: ["bag", "cup", "crumbs"] },
      { name: "Aruzhan", color: "blue", time: "21:50", aitu: true, things: ["phone"] },
      { name: "Saule", color: "green", time: "21:25", aitu: true, things: ["glasses"] }
    ]},
    { id: "kitchen", name: "Kitchen", floor: 1, guests: [
      { name: "Nurlan", color: "red", time: "19:40", aitu: true, things: ["phone", "cup"] },
      { name: "Emma", color: "black", time: "20:15", aitu: false, things: ["bag"] },
      { name: "Timur", color: "green", time: "21:05", aitu: true, things: ["phone", "bag", "crumbs"] },
      { name: "Sergey", color: "yellow", time: "20:50", aitu: false, things: [] },
      { name: "Yerlan", color: "red", time: "21:40", aitu: true, things: ["glasses", "phone"] },
      { name: "Kamila", color: "green", time: "20:05", aitu: false, things: ["cup"] }
    ]},
    { id: "living-room", name: "Living room", floor: 1, guests: [
      { name: "Daniel", color: "blue", time: "19:55", aitu: true, things: ["glasses"] },
      { name: "Zarina", color: "green", time: "21:10", aitu: false, things: ["bag", "phone", "crumbs"] },
      { name: "Natasha", color: "yellow", time: "20:30", aitu: true, things: [] },
      { name: "Askar", color: "black", time: "21:00", aitu: true, things: ["phone"] },
      { name: "Inkar", color: "purple", time: "20:20", aitu: false, things: ["bag"] }
    ]}
  ];

  const thingIcons = {
    phone: "▯",
    glasses: "♧",
    bag: "♙",
    cup: "☕",
    crumbs: "▧"
  };

  const thingNames = {
    phone: "a phone",
    glasses: "glasses",
    bag: "a bag",
    cup: "a cup",
    crumbs: "cake crumbs"
  };

  const caseDescriptions = [
    "Who is in the hall?",
    "Who is dressed in yellow or purple?",
    "Which AITU students are upstairs?",
    "Who has glasses or a bag?",
    "Who came with nothing at all?",
    "Who has a phone but no bag?",
    "Who arrived between 20:30 and 21:00, both times included?",
    "Who arrived after 21:00 and is not an AITU student?",
    "Who stands right next to Askar?",
    "Who stands last in each room?",
    "Who stands third in each room?",
    "Who stands after Timur in his room?",
    "Who stands right before someone in black?",
    "In which room is Aruzhan?",
    "Which rooms have fewer than 6 guests?",
    "In which rooms does somebody have a cup, but nobody wears glasses?",
    "Who came first to each room?",
    "Add Miras between Askar and Inkar.",
    "Natasha leaves the party.",
    "Who took the cake?"
  ];

  const caseTitles = [
    "Hall guests",
    "Yellow or purple",
    "AITU upstairs",
    "Glasses or bag",
    "Nothing at all",
    "Phone, no bag",
    "20:30–21:00",
    "After 21:00, non-AITU",
    "Next to Askar",
    "Last in each room",
    "Third in each room",
    "After Timur",
    "Before black",
    "Aruzhan's room",
    "Rooms under 6",
    "Cup, no glasses",
    "First in each room",
    "Miras arrives",
    "Natasha leaves",
    "Find the thief"
  ];

  const selectorExamples = [
    "$(`.room[data-room=\"hall\"] .guest-card`)",
    "$(\".guest-card.color-yellow, .guest-card.color-purple\")",
    "$(\".floor[data-floor=\\'2\\'] .guest-card.is-aitu\")",
    "$(\".guest-card.has-glasses, .guest-card.has-bag\")",
    "$(\".guest-card[data-things=\\'\\']\")",
    "$(\".guest-card.has-phone:not(.has-bag)\")",
    "$(\".guest-card\").filter(function(){ /* time 20:30–21:00 */ })",
    "$(\".guest-card\").filter(function(){ /* after 21:00 and not .is-aitu */ })",
    "$(\".guest-card[data-name=\\'Askar\\']\").siblings(\".guest-card\").filter(/* immediate neighbors */)",
    "$(\".guests > .guest-card:last-child\")",
    "$(\".guests > .guest-card:nth-child(3)\")",
    "$(\".guest-card[data-name=\\'Timur\\']\").nextAll(\".guest-card\")",
    "$(\".guest-card.color-black\").prev(\".guest-card\")",
    "$(\".guest-card[data-name=\\'Aruzhan\\']\").closest(\".room\")",
    "$(\".room\").filter(function(){ return $(this).find(\".guest-card\").length < 6; })",
    "$(\".room\").filter(/* has .has-cup and no .has-glasses */)",
    "$(\".room .guest-card\").filter(/* earliest time in each room */)",
    "$(\".guest-card[data-name=\\'Askar\\']\") + insertAfter() — add Miras",
    "$(\".guest-card[data-name=\\'Natasha\\']\").fadeOut()",
    "$(\".floor[data-floor=\\'1\\'] .guest-card.has-crumbs:not(.has-cup)\").filter(/* time and AITU neighbor */)"
  ];

  let party = copyParty(initialParty);
  let sortState = {};
  let currentGuestName = null;
  let spotlightTimer = null;

  const $caseButtons = $("#caseButtons");
  const $result = $("#result");
  const $modal = $("#guestModal");
  const $modalCard = $("#guestCard");

  function copyParty(source) {
    return source.map(room => ({
      id: room.id,
      name: room.name,
      floor: room.floor,
      guests: room.guests.map((guest, index) => ({
        ...guest,
        things: [...guest.things],
        order: guest.order ?? index
      }))
    }));
  }

  function timeNumber(time) {
    const parts = time.split(":").map(Number);
    return parts[0] * 60 + parts[1];
  }

  function roomById(id) {
    return party.find(room => room.id === id);
  }

  function guestByName(name) {
    for (const room of party) {
      const found = room.guests.find(guest => guest.name === name);
      if (found) return found;
    }
    return null;
  }

  function escapeHtml(value) {
    return String(value).replace(
      /[&<>"']/g,
      ch => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[ch])
    );
  }

  function thingText(guest) {
    if (!guest.things.length) return "Nothing";

    if (guest.things.length === 1) {
      return "Has " + thingNames[guest.things[0]];
    }

    return "Has " +
      guest.things.map(thing => thingNames[thing]).join(" and ");
  }

  function roomHtml(room) {
    return `<section class="room" data-room="${room.id}" data-floor="${room.floor}">
      <div class="room-heading">
        <h3>${escapeHtml(room.name)}</h3>
        <div class="room-tools">
          <button type="button" class="sort-button" data-sort-room="${room.id}">
            Sort by time
          </button>
        </div>
      </div>
      <div class="guests" data-guests-room="${room.id}"></div>
    </section>`;
  }

  function guestHtml(guest, room) {
    const things = guest.things
      .map(
        thing =>
          `<span class="thing" title="${thingNames[thing]}" aria-label="${thingNames[thing]}">${thingIcons[thing]}</span>`
      )
      .join("");

    const classes = [
      "guest-card",
      `color-${guest.color}`,
      ...guest.things.map(thing => `has-${thing}`),
      ...(guest.aitu ? ["is-aitu"] : [])
    ].join(" ");

    const dataThings = guest.things.join(",");
    const seed = encodeURIComponent(guest.name);

    return `<button
      type="button"
      class="${classes}"
      data-name="${escapeHtml(guest.name)}"
      data-room="${room.id}"
      data-floor="${room.floor}"
      data-color="${guest.color}"
      data-time="${guest.time}"
      data-aitu="${guest.aitu}"
      data-things="${dataThings}"
      style="--ring:var(--${guest.color})"
      aria-label="Inspect ${escapeHtml(guest.name)}">

      <span class="avatar-wrap">
        <img
          class="avatar"
          src="https://api.dicebear.com/9.x/open-peeps/svg?seed=${seed}"
          alt="Avatar of ${escapeHtml(guest.name)}"
          loading="lazy">

        ${
          guest.aitu
            ? '<span class="aitu-badge" title="AITU student">🎓</span>'
            : ""
        }
      </span>

      <span class="guest-name">${escapeHtml(guest.name)}</span>
      <span class="guest-time">◷ ${guest.time}</span>
      <span class="things">${things}</span>
    </button>`;
  }

  function renderParty() {
    $("#floor-1, #floor-2").empty();

    party
      .filter(room => room.floor === 2)
      .forEach(room => $("#floor-2").append(roomHtml(room)));

    party
      .filter(room => room.floor === 1)
      .forEach(room => $("#floor-1").append(roomHtml(room)));

    party.forEach(room => {
      const $container = $(`[data-guests-room="${room.id}"]`);

      room.guests.forEach(guest => {
        $container.append(guestHtml(guest, room));
      });
    });

    sortState = {};
  }

  function buildCaseButtons() {
    caseDescriptions.forEach((description, index) => {
      $caseButtons.append(`
        <button
          class="case-button"
          type="button"
          data-case="${index + 1}"
          title="${escapeHtml(description)}">

          <strong>${index + 1}</strong>
          <span>${escapeHtml(caseTitles[index])}</span>
        </button>
      `);
    });
  }

  function clearSpotlight() {
    if (spotlightTimer) {
      clearTimeout(spotlightTimer);
      spotlightTimer = null;
    }

    $(".guest-card, .room")
      .stop(true, true)
      .removeClass("spotlight-dim spotlight-match jumping")
      .css("opacity", 1);
  }

  function resetResult() {
    $result.empty().append("<p>Choose a case to start investigating.</p>");
  }

  function formatNames($items, kind) {
    const names = [];

    $items.each(function () {
      const $item = $(this);

      names.push(
        kind === "room"
          ? $item.find(".room-heading h3").text()
          : $item.attr("data-name")
      );
    });

    return names;
  }

  function showResult(caseNo, $items, kind, message) {
    const names = formatNames($items, kind);
    const noun = kind === "room" ? "room" : "guest";
    const plural = names.length === 1 ? noun : noun + "s";

    $result
      .empty()
      .append(
        `<h3>Case ${caseNo}: ${escapeHtml(
          caseTitles[caseNo - 1]
        )}</h3>`
      )
      .append(
        `<p class="case-question">
          <strong>Question:</strong>
          ${escapeHtml(caseDescriptions[caseNo - 1])}
        </p>`
      )
      .append(
        `<p>
          <strong>Answer:</strong>
          ${escapeHtml(message || "Found")}
          <span class="result-count">
            ${names.length} ${plural}
          </span>.
        </p>`
      );

    if (names.length) {
      const $list = $("<ul></ul>");

      names.forEach(name => {
        $list.append($("<li></li>").text(name));
      });

      $result.append($list);
    } else {
      $result.append("<p>No matching results.</p>");
    }

    /* CHANGED:
       Removed the extra explanatory text.
       Only the jQuery selector/method is shown. */
    $result.append(
      `<div class="selector-answer">
        <h4>jQuery selector / method</h4>
        <code></code>
      </div>`
    );

    $result
      .find(".selector-answer code")
      .text(selectorExamples[caseNo - 1] || "jQuery selector");
  }

  function spotlight($items, kind) {
    clearSpotlight();

    const selector = kind === "room" ? ".room" : ".guest-card";
    const $all = $(selector);

    $all.stop(true, true).fadeTo(300, 0.2);

    $items
      .stop(true, true)
      .fadeTo(300, 1)
      .addClass("spotlight-match");

    if (kind === "room") {
      $items.each(function () {
        $(this)
          .find(".guest-card")
          .stop(true, true)
          .fadeTo(300, 1)
          .addClass("spotlight-match");
      });
    }

    $items.each(function () {
      const $item = $(this);

      if (kind === "room") return;

      $item
        .stop(true, true)
        .animate({ top: -8 }, 130)
        .animate({ top: 0 }, 130);
    });
  }

  function getCaseResult(caseNo) {
    let $items = $();
    let kind = "guest";
    let message = "Found";

    switch (caseNo) {
      case 1:
        $items = $(".room[data-room='hall'] .guest-card");
        break;

      case 2:
        $items = $(".guest-card.color-yellow")
          .add($(".guest-card.color-purple"));
        break;

      case 3:
        $items = $(".floor[data-floor='2'] .guest-card.is-aitu");
        break;

      case 4:
        $items = $(".guest-card.has-glasses")
          .add($(".guest-card.has-bag"));
        break;

      case 5:
        $items = $(".guest-card[data-things='']");
        break;

      case 6:
        $items = $(".guest-card.has-phone:not(.has-bag)");
        break;

      case 7:
        $items = $(".guest-card").filter(function () {
          const t = timeNumber($(this).attr("data-time"));

          return (
            t >= timeNumber("20:30") &&
            t <= timeNumber("21:00")
          );
        });
        break;

      case 8:
        $items = $(".guest-card").filter(function () {
          return (
            timeNumber($(this).attr("data-time")) >
              timeNumber("21:00") &&
            !$(this).hasClass("is-aitu")
          );
        });
        break;

      case 9: {
        const $askar = $(".guest-card[data-name='Askar']");

        $items = $askar
          .prev(".guest-card")
          .add($askar.next(".guest-card"));

        break;
      }

      case 10:
        $items = $(".guests > .guest-card:last-child");
        break;

      case 11:
        $items = $(".guests > .guest-card:nth-child(3)");
        break;

      case 12:
        $items = $(".guest-card[data-name='Timur']")
          .nextAll(".guest-card");
        break;

      case 13:
        $items = $(".guest-card.color-black")
          .prev(".guest-card");
        break;

      case 14:
        $items = $(".guest-card[data-name='Aruzhan']")
          .closest(".room");

        kind = "room";
        message = "Aruzhan is in";
        break;

      case 15:
        $items = $(".room").filter(function () {
          return $(this).find(".guest-card").length < 6;
        });

        kind = "room";
        message = "Rooms with fewer than 6 guests:";
        break;

      case 16:
        $items = $(
          ".room:has(.guest-card.has-cup):not(:has(.guest-card.has-glasses))"
        );

        kind = "room";
        message = "Rooms with a cup but no glasses:";
        break;

      case 17:
        $items = $(".room")
          .find(".guest-card")
          .filter(function () {
            const $guest = $(this);
            const ownTime = timeNumber(
              $guest.attr("data-time")
            );

            return (
              $guest
                .prevAll(".guest-card")
                .add($guest.nextAll(".guest-card"))
                .filter(function () {
                  return (
                    timeNumber($(this).attr("data-time")) <
                    ownTime
                  );
                }).length === 0
            );
          });

        break;

      case 20:
        $items = $(".floor[data-floor='1'] .guest-card.has-crumbs:not(.has-cup)")
          .filter(function () {
            const $guest = $(this);
            const t = timeNumber($guest.attr("data-time"));

            const nextIsAitu =
              $guest.next(".guest-card.is-aitu").length > 0;

            const prevIsAitu =
              $guest.prev(".guest-card.is-aitu").length > 0;

            return (
              t > timeNumber("21:00") &&
              t < timeNumber("21:30") &&
              (nextIsAitu || prevIsAitu)
            );
          });

        message = "The thief matching every clue is";
        break;
    }

    return {
      $items,
      kind,
      message
    };
  }

  function runCase(caseNo) {
    closeModal(true);
    clearSpotlight();

    $(".case-button")
      .removeClass("active")
      .filter(`[data-case="${caseNo}"]`)
      .addClass("active");

    renderParty();

    if (caseNo === 18) {
      addMiras();
      return;
    }

    if (caseNo === 19) {
      removeNatasha();
      return;
    }

    const result = getCaseResult(caseNo);

    spotlight(result.$items, result.kind);

    showResult(
      caseNo,
      result.$items,
      result.kind,
      result.message
    );
  }

  function addMiras() {
    const living = roomById("living-room");

    if (!living) return;

    const existing = guestByName("Miras");

    if (existing) {
      const $existing = $(".guest-card[data-name='Miras']");

      spotlight($existing, "guest");

      showResult(
        18,
        $existing,
        "guest",
        "Miras is already at the party:"
      );

      return;
    }

    const miras = {
      name: "Miras",
      color: "blue",
      time: "21:20",
      aitu: true,
      things: ["phone"],
      order: 3.5
    };

    const askarIndex = living.guests.findIndex(
      guest => guest.name === "Askar"
    );

    living.guests.splice(
      askarIndex + 1,
      0,
      miras
    );

    renderParty();

    const $askar = $(".guest-card[data-name='Askar']");
    const $miras = $(".guest-card[data-name='Miras']");

    $miras.hide();

    $miras
      .insertAfter($askar)
      .fadeIn(450);

    const $found = $miras;

    spotlight($found, "guest");

    showResult(
      18,
      $found,
      "guest",
      "Added between Askar and Inkar:"
    );
  }

  function removeNatasha() {
    const $natasha =
      $(".guest-card[data-name='Natasha']");

    if (!$natasha.length) {
      showResult(
        19,
        $natasha,
        "guest",
        "Natasha has already left:"
      );

      return;
    }

    spotlight($natasha, "guest");

    showResult(
      19,
      $natasha,
      "guest",
      "Leaving the party:"
    );

    const natashaRoom =
      roomById($natasha.attr("data-room"));

    if (natashaRoom) {
      natashaRoom.guests =
        natashaRoom.guests.filter(
          guest => guest.name !== "Natasha"
        );
    }

    $natasha
      .stop(true, true)
      .fadeOut(500, function () {
        $(this).remove();
      });
  }

  function openGuestCard(name, $source) {
    const guest = guestByName(name);

    if (!guest) return;

    if (currentGuestName) {
      closeModal(true);
    }

    currentGuestName = name;

    const room = party.find(item =>
      item.guests.some(person =>
        person.name === name
      )
    );

    const items = guest.things.length
      ? guest.things
          .map(
            thing =>
              `<span class="thing">
                ${thingIcons[thing]}
                ${thingNames[thing]}
              </span>`
          )
          .join(" ")
      : "Nothing";

    const destinationButtons =
      party
        .filter(item => item.id !== room.id)
        .map(
          item =>
            `<button
              class="move-button"
              type="button"
              data-move-to="${item.id}">
              Move to ${escapeHtml(
                item.name.toLowerCase()
              )}
            </button>`
        )
        .join("");

    $modalCard.html(`
      <div class="modal-head">
        <div class="modal-profile">
          <div
            class="modal-avatar"
            style="--ring:var(--${guest.color})">

            <img
              src="https://api.dicebear.com/9.x/open-peeps/svg?seed=${encodeURIComponent(
                guest.name
              )}"
              alt="Avatar of ${escapeHtml(guest.name)}">
          </div>

          <div>
            <h2 id="modalName">
              ${escapeHtml(guest.name)}
            </h2>

            <p>
              ${escapeHtml(room.name)}
              · ${guest.color} clothing
            </p>
          </div>
        </div>

        <button
          class="modal-close"
          type="button"
          aria-label="Close guest card">
          ✕
        </button>
      </div>

      <div class="modal-details">
        <div class="detail-line">
          Came at <strong>${guest.time}</strong>
        </div>

        <div class="detail-line">
          ${
            guest.aitu
              ? "AITU student"
              : "Not an AITU student"
          }
        </div>

        <div class="detail-line">
          ${items}
        </div>
      </div>

      <h3 class="move-heading">
        Move this guest to another room
      </h3>

      <div class="move-buttons">
        ${destinationButtons}
      </div>

      <p class="modal-note">
        Press Esc or click outside this card to close it.
      </p>
    `);

    $modal
      .attr("aria-hidden", "false")
      .addClass("open");

    $modalCard.css({
      display: "block",
      transform: "scale(0.08)",
      opacity: 0.08
    });

    const origin =
      $source.find(".avatar-wrap").offset();

    const modalCenter = {
      left:
        ($(window).width() -
          $modalCard.outerWidth()) / 2,

      top:
        ($(window).height() -
          $modalCard.outerHeight()) / 2
    };

    if (origin) {
      $modalCard.css({
        transformOrigin: `
          ${Math.max(
            0,
            Math.min(
              100,
              ((origin.left + 25 - modalCenter.left) /
                $modalCard.outerWidth()) *
                100
            )
          )}%
          ${Math.max(
            0,
            Math.min(
              100,
              ((origin.top + 25 - modalCenter.top) /
                $modalCard.outerHeight()) *
                100
            )
          )}%
        `
      });
    }

    $modalCard
      .stop(true, true)
      .animate(
        { opacity: 1 },
        {
          duration: 360,

          step: function (now) {
            $(this).css(
              "transform",
              `scale(${Math.max(0.08, now)})`
            );
          },

          complete: function () {
            $(this).css({
              transform: "scale(1)",
              opacity: 1
            });
          }
        }
      );
  }

  function closeModal(immediate) {
    if (!$modal.hasClass("open")) {
      currentGuestName = null;
      return;
    }

    const finish = function () {
      $modal
        .removeClass("open")
        .attr("aria-hidden", "true");

      $modalCard
        .hide()
        .empty()
        .css({
          transform: "scale(0.08)",
          opacity: 1
        });

      currentGuestName = null;
    };

    if (immediate) {
      $modalCard.stop(true, true);
      finish();
      return;
    }

    $modalCard
      .stop(true, true)
      .animate(
        { opacity: 0.08 },
        {
          duration: 220,

          step: function (now) {
            $(this).css(
              "transform",
              `scale(${Math.max(0.08, now)})`
            );
          },

          complete: finish
        }
      );
  }

  function capturePositions($cards) {
    const positions = new Map();

    $cards.each(function () {
      positions.set(this, $(this).offset());
    });

    return positions;
  }

  function animateReflow($cards, oldPositions) {
    $cards.each(function () {
      const $card = $(this);
      const oldPos = oldPositions.get(this);
      const newPos = $card.offset();

      if (!oldPos || !newPos) return;

      const dx =
        oldPos.left - newPos.left;

      const dy =
        oldPos.top - newPos.top;

      if (Math.abs(dx) + Math.abs(dy) < 2) {
        return;
      }

      $card
        .stop(true, true)
        .css({
          position: "relative",
          left: dx,
          top: dy
        });

      $card.animate(
        {
          left: 0,
          top: 0
        },
        430,
        function () {
          $(this).css({
            position: "",
            left: "",
            top: ""
          });
        }
      );
    });
  }

  function moveGuest(name, destinationId) {
    const guest = guestByName(name);

    if (!guest) return;

    const sourceRoom =
      party.find(room =>
        room.guests.some(
          item => item.name === name
        )
      );

    const destination =
      roomById(destinationId);

    if (
      !sourceRoom ||
      !destination ||
      sourceRoom.id === destination.id
    ) {
      return;
    }

    const $source =
      $(`.guest-card[data-name="${name}"]`);

    const $sourceList =
      $source.closest(".guests");

    const oldPositions =
      capturePositions(
        $sourceList.children(".guest-card")
      );

    const $destinationList =
      $(`[data-guests-room="${destination.id}"]`);

    const destPositions =
      capturePositions(
        $destinationList.children(".guest-card")
      );

    const from = $source.offset();

    const $clone =
      $source
        .clone()
        .addClass("flying-clone")
        .appendTo("body");

    $clone.css({
      position: "absolute",
      left: from.left,
      top: from.top,
      width: $source.outerWidth(),
      zIndex: 2000,
      pointerEvents: "none",
      margin: 0
    });

    sourceRoom.guests =
      sourceRoom.guests.filter(
        item => item.name !== name
      );

    guest.order =
      destination.guests.length
        ? Math.max(
            ...destination.guests.map(
              item => item.order
            )
          ) + 1
        : 0;

    destination.guests.push(guest);

    $source
      .stop(true, true)
      .animate(
        {
          opacity: 0,
          width: 0,
          marginLeft: 0,
          marginRight: 0
        },
        360,
        function () {
          $(this).remove();
        }
      );

    animateReflow(
      $sourceList.children(".guest-card"),
      oldPositions
    );

    const $targetAnchor =
      $destinationList
        .children(".guest-card")
        .last();

    const target =
      $targetAnchor.length
        ? $targetAnchor.offset()
        : $destinationList.offset();

    const targetX =
      target.left +
      ($targetAnchor.length
        ? $targetAnchor.outerWidth()
        : 0);

    const targetY = target.top;

    $clone
      .stop(true, true)
      .animate(
        {
          left: targetX,
          top: targetY,
          opacity: 0.35
        },
        520,
        function () {
          $(this).remove();

          const $newCard =
            $(guestHtml(guest, destination));

          $destinationList.append($newCard);

          $newCard.css({
            opacity: 0.3,
            position: "relative",
            top: 8
          });

          $newCard.animate(
            {
              opacity: 1,
              top: 0
            },
            300,
            function () {
              $(this).css({
                position: "",
                top: ""
              });
            }
          );

          animateReflow(
            $destinationList.children(".guest-card"),
            destPositions
          );

          closeModal(true);

          $result.empty().append(
            `<h3>Guest moved</h3>
             <p>
               <strong>${escapeHtml(name)}</strong>
               moved from
               ${escapeHtml(sourceRoom.name)}
               to
               ${escapeHtml(destination.name)}.
               The party data has been updated.
             </p>`
          );
        }
      );
  }

  function sortRoom(roomId) {
    const room = roomById(roomId);

    if (!room) return;

    const $list =
      $(`[data-guests-room="${roomId}"]`);

    const oldPositions =
      capturePositions(
        $list.children(".guest-card")
      );

    const isSorted =
      Boolean(sortState[roomId]);

    if (!isSorted) {
      room.guests.sort(
        (a, b) =>
          timeNumber(a.time) -
          timeNumber(b.time)
      );
    } else {
      room.guests.sort(
        (a, b) => a.order - b.order
      );
    }

    sortState[roomId] = !isSorted;

    room.guests.forEach(guest => {
      $list.append(
        $list.children(
          `.guest-card[data-name="${guest.name}"]`
        )
      );
    });

    animateReflow(
      $list.children(".guest-card"),
      oldPositions
    );

    $(`[data-sort-room="${roomId}"]`).text(
      sortState[roomId]
        ? "Restore order"
        : "Sort by time"
    );
  }

  buildCaseButtons();
  renderParty();

  function runGuestSearch() {
    const query =
      $.trim($("#guestSearch").val()).toLowerCase();

    const type =
      $("#searchType").val();

    clearSpotlight();
    closeModal(true);

    if (!query) {
      $result.empty().append(
        "<p>Type a value first, for example a name, color, room, item, floor, time, or AITU.</p>"
      );

      return;
    }

    const $matches =
      $(".guest-card").filter(function () {
        const $guest = $(this);

        const roomName =
          $guest
            .closest(".room")
            .find(".room-heading h3")
            .text()
            .toLowerCase();

        const values = {
          all: [
            $guest.attr("data-name"),
            $guest.attr("class"),
            $guest.attr("data-room"),
            roomName,
            $guest.attr("data-floor"),
            $guest.attr("data-color"),
            $guest.attr("data-time"),
            $guest.attr("data-aitu"),
            $guest.attr("data-things")
          ].join(" "),

          name:
            $guest.attr("data-name"),

          class:
            $guest.attr("class") +
            " " +
            $guest.attr("data-color"),

          room:
            roomName +
            " " +
            $guest.attr("data-room"),

          floor:
            $guest.attr("data-floor"),

          thing:
            $guest.attr("data-things") +
            " " +
            $guest.attr("class"),

          aitu:
            $guest.attr("data-aitu") +
            " " +
            $guest.attr("class"),

          time:
            $guest.attr("data-time")
        };

        return String(
          values[type] || values.all
        )
          .toLowerCase()
          .includes(query);
      });

    spotlight($matches, "guest");

    $result
      .empty()
      .append("<h3>Guest search results</h3>")
      .append(
        $(
          `<p>
            Search type:
            <strong>
              ${escapeHtml(
                $("#searchType option:selected").text()
              )}
            </strong>
            · Matches:
            <strong>${$matches.length}</strong>
          </p>`
        )
      );

    if ($matches.length) {
      const $list = $("<ul></ul>");

      $matches.each(function () {
        const $g = $(this);

        $list.append(
          $("<li></li>").text(
            `${$g.attr("data-name")} — ` +
            `${$g.closest(".room")
              .find(".room-heading h3")
              .text()}, ` +
            `floor ${$g.attr("data-floor")}, ` +
            `${$g.attr("data-color")}, ` +
            `${$g.attr("data-time")}`
          )
        );
      });

      $result.append($list);
    } else {
      $result.append(
        "<p>No guests matched. Try another word or search type.</p>"
      );
    }

    /* CHANGED:
       Removed the paragraph:
       "The page reads guest data attributes..."
       Only the jQuery selector remains. */
    $result.append(
      '<div class="selector-answer">' +
        '<h4>jQuery selector</h4>' +
        '<code></code>' +
      '</div>'
    );

    const snippets = {
      all:
        '$(".guest-card").filter(function(){ /* search all guest details */ })',

      name:
        '$(".guest-card[data-name]").filter(function(){ /* match guest name */ })',

      class:
        '$(".guest-card.color-green, .guest-card.has-phone")',

      room:
        '$(".room[data-room=\'hall\'] .guest-card")',

      floor:
        '$(".floor[data-floor=\'2\'] .guest-card")',

      thing:
        '$(".guest-card.has-phone, .guest-card.has-bag, .guest-card.has-cup")',

      aitu:
        '$(".guest-card.is-aitu")',

      time:
        '$(".guest-card[data-time]").filter(function(){ /* compare data-time */ })'
    };

    $result
      .find(".selector-answer code")
      .text(
        snippets[type] || snippets.all
      );
  }

  $("#searchBtn").on(
    "click",
    runGuestSearch
  );

  $("#guestSearch").on(
    "keydown",
    function (event) {
      if (event.key === "Enter") {
        runGuestSearch();
      }
    }
  );

  $caseButtons.on(
    "click",
    ".case-button",
    function () {
      runCase(
        Number(
          $(this).attr("data-case")
        )
      );
    }
  );

  $("#clearBtn").on(
    "click",
    function () {
      clearSpotlight();
      closeModal(true);

      party = copyParty(initialParty);

      renderParty();

      $(".case-button")
        .removeClass("active");

      resetResult();
    }
  );

  $(document).on(
    "click",
    ".guest-card",
    function (event) {
      if (
        $(event.target)
          .closest(".thing")
          .length
      ) {
        return;
      }

      event.preventDefault();

      openGuestCard(
        $(this).attr("data-name"),
        $(this)
      );
    }
  );

  $(document).on(
    "click",
    ".sort-button",
    function (event) {
      event.stopPropagation();

      sortRoom(
        $(this).attr("data-sort-room")
      );
    }
  );

  $modal.on(
    "click",
    function (event) {
      if (event.target === this) {
        closeModal(false);
      }
    }
  );

  $modalCard.on(
    "click",
    ".modal-close",
    function () {
      closeModal(false);
    }
  );

  $modalCard.on(
    "click",
    ".move-button",
    function () {
      if (currentGuestName) {
        moveGuest(
          currentGuestName,
          $(this).attr("data-move-to")
        );
      }
    }
  );

  $(document).on(
    "keydown",
    function (event) {
      if (event.key === "Escape") {
        closeModal(false);
      }
    }
  );
});