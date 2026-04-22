// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import {
  applyFrenchUiTranslations,
  startFrenchUiTranslator,
  translateUiString,
} from "./frenchUi";

describe("translateUiString", () => {
  it("translates common PaperClip UI labels to French", () => {
    expect(translateUiString("Approve")).toBe("Approuver");
    expect(translateUiString("Reject")).toBe("Refuser");
    expect(translateUiString("Company Settings")).toBe("Paramètres de l’entreprise");
  });

  it("preserves unknown strings", () => {
    expect(translateUiString("Custom user content")).toBe("Custom user content");
  });
});

describe("applyFrenchUiTranslations", () => {
  it("translates text nodes and common accessibility attributes", () => {
    document.body.innerHTML = `
      <main>
        <button aria-label="Approve" title="Reject">Approve</button>
        <input placeholder="Search" aria-label="Settings" />
        <span>Loading...</span>
      </main>
    `;

    applyFrenchUiTranslations(document.body);

    expect(document.querySelector("button")?.textContent).toBe("Approuver");
    expect(document.querySelector("button")?.getAttribute("aria-label")).toBe("Approuver");
    expect(document.querySelector("button")?.getAttribute("title")).toBe("Refuser");
    expect(document.querySelector("input")?.getAttribute("placeholder")).toBe("Rechercher");
    expect(document.querySelector("input")?.getAttribute("aria-label")).toBe("Paramètres");
    expect(document.querySelector("span")?.textContent).toBe("Chargement...");
  });
});

describe("startFrenchUiTranslator", () => {
  it("translates future DOM updates via mutation observer", async () => {
    document.body.innerHTML = `<div id="app"></div>`;

    const stop = startFrenchUiTranslator(document);
    const app = document.getElementById("app");
    if (!app) throw new Error("missing app root");

    app.innerHTML = `<button>Approve</button>`;
    await vi.waitFor(() => {
      expect(app.textContent).toContain("Approuver");
    });

    stop();
  });
});
