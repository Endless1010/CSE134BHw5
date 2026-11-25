// <cat-fact-panel>: shows a cat fact from https://catfact.ninja/fact.
//
// - Builds its own interface with DOM methods (no innerHTML, so remote text is
//   always inserted with textContent).
// - Observed attribute `compact`: when present, the details line is hidden.
//   The page toggles it from a button outside the element (cat-fact-controls.js).
// - Starts with a local sample fact so the widget is never empty; the button
//   inside the element requests a new fact from the API.
// - Uses CSS custom properties (--panel-*) with fallbacks, set from styles.css.

const API_URL = "https://catfact.ninja/fact";
const REQUEST_TIMEOUT_MS = 8000;

const SAMPLE_FACTS = [
  "Cats sleep for about two thirds of their lives.",
  "A group of cats is called a clowder.",
  "Cats have a third eyelid, called the haw, that helps protect their eyes."
];

class CatFactPanel extends HTMLElement {
  static get observedAttributes() {
    return ["compact"];
  }

  constructor() {
    super();
    this.factCount = 0;
    this.requestId = 0;
    this.built = false;
  }

  connectedCallback() {
    if (!this.built) {
      this.build();
      this.built = true;
    }
    this.showFact(SAMPLE_FACTS[0], "sample");
    this.setStatus("Showing a sample fact. Select the button for a live one.", "idle");
    this.updateCompact();
  }

  attributeChangedCallback(name) {
    // Fires for attribute changes even before the interface exists.
    if (name === "compact" && this.built) {
      this.updateCompact();
    }
  }

  build() {
    this.heading = document.createElement("h3");
    this.heading.textContent = "Cat fact";
    this.heading.id = "cat-fact-heading";

    this.factText = document.createElement("p");
    this.factText.className = "cat-fact-text";

    this.details = document.createElement("p");
    this.details.className = "cat-fact-details";

    this.button = document.createElement("button");
    this.button.type = "button";
    this.button.textContent = "Tell me something about cats";
    this.button.addEventListener("click", () => this.loadFact());

    this.status = document.createElement("p");
    this.status.className = "cat-fact-status";
    this.status.setAttribute("role", "status");

    this.replaceChildren(this.heading, this.factText, this.details, this.button, this.status);
    this.setAttribute("role", "group");
    this.setAttribute("aria-labelledby", this.heading.id);
  }

  updateCompact() {
    // The details line is the visible difference between the two modes.
    this.details.hidden = this.hasAttribute("compact");
  }

  showFact(text, source) {
    this.factText.textContent = text;
    this.details.textContent =
      source === "sample"
        ? `Sample fact · ${text.length} characters`
        : `From catfact.ninja · ${text.length} characters · fact ${this.factCount} this visit`;
  }

  setStatus(message, state) {
    this.status.textContent = message;
    this.status.dataset.state = state;
  }

  async loadFact() {
    // Only the newest request may update the page.
    const myId = ++this.requestId;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    this.button.disabled = true;
    this.setStatus("Loading a cat fact…", "loading");

    try {
      const response = await fetch(API_URL, {
        headers: { Accept: "application/json" },
        signal: controller.signal
      });
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      const data = await response.json();
      if (typeof data?.fact !== "string" || data.fact.trim() === "") {
        throw new Error("Expected a fact in the response.");
      }
      if (myId !== this.requestId) {
        return;
      }
      this.factCount += 1;
      this.showFact(data.fact.trim(), "live");
      this.setStatus("New cat fact loaded.", "success");
      this.button.textContent = "Another cat fact";
    } catch (error) {
      if (myId !== this.requestId) {
        return;
      }
      console.error("Could not load a cat fact.", error);
      const reason = error.name === "AbortError" ? "The request timed out." : "Could not load a cat fact.";
      this.setStatus(`${reason} Check your connection and try again.`, "error");
      this.button.textContent = "Try again";
    } finally {
      clearTimeout(timer);
      if (myId === this.requestId) {
        this.button.disabled = false;
      }
    }
  }
}

customElements.define("cat-fact-panel", CatFactPanel);
