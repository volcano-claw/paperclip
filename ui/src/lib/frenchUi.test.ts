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
    expect(translateUiString("View details")).toBe("Voir les détails");
    expect(translateUiString("Search issues, agents, projects...")).toBe("Rechercher des tickets, agents, projets...");
  });

  it("translates regex-driven runtime strings", () => {
    expect(translateUiString("Approval request created 2m ago")).toBe("Demande d’approbation créée 2m ago");
    expect(translateUiString("3 services running")).toBe("3 services en cours");
    expect(translateUiString("Join Acme Robotics")).toBe("Rejoindre Acme Robotics");
    expect(translateUiString("Failed to disable 1 timer heartbeat: boom")).toBe("Échec de la désactivation d’un heartbeat timer : boom");
    expect(translateUiString("Failed to disable 2 of 5 timer heartbeats. First error: boom")).toBe("Échec de la désactivation de 2 heartbeat(s) timer sur 5. Première erreur : boom");
  });

  it("translates visible auth, invite, approval, and settings strings", () => {
    expect(translateUiString("Invite not available")).toBe("Invitation indisponible");
    expect(translateUiString("This invite may be expired, revoked, or already used.")).toBe("Cette invitation est peut-être expirée, révoquée ou déjà utilisée.");
    expect(translateUiString("Create your Paperclip account")).toBe("Créer ton compte PaperClip");
    expect(translateUiString("Create account and continue")).toBe("Créer le compte et continuer");
    expect(translateUiString("Approvals")).toBe("Approbations");
    expect(translateUiString("Approval confirmed")).toBe("Approbation confirmée");
    expect(translateUiString("Approval not found.")).toBe("Approbation introuvable.");
    expect(translateUiString("Save changes")).toBe("Enregistrer les modifications");
    expect(translateUiString("Saving...")).toBe("Enregistrement...");
    expect(translateUiString("Saved")).toBe("Enregistré");
    expect(translateUiString("Failed to save")).toBe("Échec de l’enregistrement");
    expect(translateUiString("Delete company")).toBe("Supprimer la société");
    expect(translateUiString("Archiving...")).toBe("Archivage...");
  });

  it("translates visible error and status strings in approvals and instance settings", () => {
    expect(translateUiString("Approve failed")).toBe("Échec de l’approbation");
    expect(translateUiString("Reject failed")).toBe("Échec du refus");
    expect(translateUiString("Failed to approve")).toBe("Échec de l’approbation");
    expect(translateUiString("Failed to reject")).toBe("Échec du refus");
    expect(translateUiString("Failed to update heartbeat.")).toBe("Échec de la mise à jour du heartbeat.");
    expect(translateUiString("Failed to disable all heartbeats.")).toBe("Échec de la désactivation de tous les heartbeats.");
    expect(translateUiString("Failed to load scheduler heartbeats.")).toBe("Échec du chargement des heartbeats du scheduler.");
    expect(translateUiString("Failed to sign out.")).toBe("Échec de la déconnexion.");
    expect(translateUiString("Failed to update general settings.")).toBe("Échec de la mise à jour des paramètres généraux.");
    expect(translateUiString("Failed to load general settings.")).toBe("Échec du chargement des paramètres généraux.");
    expect(translateUiString("Failed to update experimental settings.")).toBe("Échec de la mise à jour des paramètres expérimentaux.");
    expect(translateUiString("Failed to load experimental settings.")).toBe("Échec du chargement des paramètres expérimentaux.");
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
