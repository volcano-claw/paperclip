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

  it("translates broader workspace, invite, project, and issue strings", () => {
    expect(translateUiString("Accept invite")).toBe("Accepter l’invitation");
    expect(translateUiString("Authentication failed")).toBe("Échec de l’authentification");
    expect(translateUiString("Create Issue")).toBe("Créer un ticket");
    expect(translateUiString("New Agent")).toBe("Nouvel agent");
    expect(translateUiString("New issue")).toBe("Nouveau ticket");
    expect(translateUiString("Project name")).toBe("Nom du projet");
    expect(translateUiString("Project workspace")).toBe("Espace de travail du projet");
    expect(translateUiString("Workspace name")).toBe("Nom de l’espace de travail");
    expect(translateUiString("Workspace ID")).toBe("ID de l’espace de travail");
    expect(translateUiString("Workspace commands JSON")).toBe("Commandes JSON de l’espace de travail");
    expect(translateUiString("Select company")).toBe("Choisir une société");
    expect(translateUiString("No assignee")).toBe("Aucun assigné");
    expect(translateUiString("No projects found.")).toBe("Aucun projet trouvé.");
    expect(translateUiString("Search projects...")).toBe("Rechercher des projets...");
    expect(translateUiString("Search issues...")).toBe("Rechercher des tickets...");
    expect(translateUiString("Search assignees...")).toBe("Rechercher des assignés...");
    expect(translateUiString("Join request approved")).toBe("Demande d’entrée approuvée");
    expect(translateUiString("Join request rejected")).toBe("Demande d’entrée refusée");
    expect(translateUiString("Invite metadata unavailable")).toBe("Métadonnées d’invitation indisponibles");
  });

  it("translates broader failure and workspace status strings", () => {
    expect(translateUiString("Comment failed")).toBe("Échec du commentaire");
    expect(translateUiString("Copy failed")).toBe("Échec de la copie");
    expect(translateUiString("Save failed")).toBe("Échec de l’enregistrement");
    expect(translateUiString("Cancel failed")).toBe("Échec de l’annulation");
    expect(translateUiString("Export failed")).toBe("Échec de l’export");
    expect(translateUiString("Issue update failed")).toBe("Échec de la mise à jour du ticket");
    expect(translateUiString("Routine run failed")).toBe("Échec de l’exécution de la routine");
    expect(translateUiString("Run failed")).toBe("Échec de l’exécution");
    expect(translateUiString("Tool failed")).toBe("Échec de l’outil");
    expect(translateUiString("Workspace job completed.")).toBe("Tâche d’espace de travail terminée.");
    expect(translateUiString("Workspace service started.")).toBe("Service d’espace de travail démarré.");
    expect(translateUiString("Workspace service stopped.")).toBe("Service d’espace de travail arrêté.");
    expect(translateUiString("Workspace service restarted.")).toBe("Service d’espace de travail redémarré.");
    expect(translateUiString("Workspace commands JSON must be a JSON object.")).toBe("Les commandes JSON de l’espace de travail doivent être un objet JSON.");
    expect(translateUiString("Failed to create invite")).toBe("Échec de la création de l’invitation");
    expect(translateUiString("Failed to create agent")).toBe("Échec de la création de l’agent");
    expect(translateUiString("Failed to load workspace")).toBe("Échec du chargement de l’espace de travail");
    expect(translateUiString("Failed to control workspace commands.")).toBe("Échec du contrôle des commandes de l’espace de travail.");
    expect(translateUiString("Failed to approve join request")).toBe("Échec de l’approbation de la demande d’entrée");
    expect(translateUiString("Failed to reject join request")).toBe("Échec du refus de la demande d’entrée");
  });

  it("translates broader invite, routing, and dashboard strings", () => {
    expect(translateUiString("Create Account")).toBe("Créer un compte");
    expect(translateUiString("Agent name")).toBe("Nom de l’agent");
    expect(translateUiString("Close workspace")).toBe("Fermer l’espace de travail");
    expect(translateUiString("Could not save")).toBe("Impossible d’enregistrer");
    expect(translateUiString("Copy issue as markdown")).toBe("Copier le ticket en markdown");
    expect(translateUiString("Issues by Priority")).toBe("Tickets par priorité");
    expect(translateUiString("Issues by Status")).toBe("Tickets par statut");
    expect(translateUiString("Search inbox…")).toBe("Rechercher dans la boîte de réception…");
    expect(translateUiString("Search models...")).toBe("Rechercher des modèles...");
    expect(translateUiString("Select model (required)")).toBe("Choisir un modèle (obligatoire)");
    expect(translateUiString("Routine title")).toBe("Titre de la routine");
    expect(translateUiString("Project default")).toBe("Projet par défaut");
    expect(translateUiString("Existing isolated workspace")).toBe("Espace de travail isolé existant");
    expect(translateUiString("New isolated workspace")).toBe("Nouvel espace de travail isolé");
    expect(translateUiString("Reuse existing workspace")).toBe("Réutiliser l’espace de travail existant");
    expect(translateUiString("A company admin")).toBe("Un admin de société");
    expect(translateUiString("Accept bootstrap invite")).toBe("Accepter l’invitation bootstrap");
    expect(translateUiString("Accept company invite")).toBe("Accepter l’invitation entreprise");
    expect(translateUiString("Claim ownership")).toBe("Revendiquer la propriété");
    expect(translateUiString("Company not found")).toBe("Société introuvable");
  });

  it("translates additional frequent failure states and workspace labels", () => {
    expect(translateUiString("Execution workspace")).toBe("Espace de travail d’exécution");
    expect(translateUiString("Failed runs")).toBe("Exécutions échouées");
    expect(translateUiString("Failed to accept invite")).toBe("Échec de l’acceptation de l’invitation");
    expect(translateUiString("Failed to archive issue")).toBe("Échec de l’archivage du ticket");
    expect(translateUiString("Failed to archive project")).toBe("Échec de l’archivage du projet");
    expect(translateUiString("Failed to build export package.")).toBe("Échec de la génération du paquet d’export.");
    expect(translateUiString("Failed to claim board ownership")).toBe("Échec de la revendication de propriété du board");
    expect(translateUiString("Failed to close workspace")).toBe("Échec de la fermeture de l’espace de travail");
    expect(translateUiString("Failed to create company")).toBe("Échec de la création de la société");
    expect(translateUiString("Failed to create routine")).toBe("Échec de la création de la routine");
    expect(translateUiString("Failed to load invites.")).toBe("Échec du chargement des invitations.");
    expect(translateUiString("Failed to load join requests.")).toBe("Échec du chargement des demandes d’entrée.");
    expect(translateUiString("Failed to load profile.")).toBe("Échec du chargement du profil.");
    expect(translateUiString("Failed to load users.")).toBe("Échec du chargement des utilisateurs.");
    expect(translateUiString("Failed to remove member")).toBe("Échec de la suppression du membre");
    expect(translateUiString("Failed to render Mermaid diagram.")).toBe("Échec du rendu du diagramme Mermaid.");
    expect(translateUiString("Failed to load workspace operations.")).toBe("Échec du chargement des opérations d’espace de travail.");
  });

  it("translates advanced workspace, budget, and onboarding labels", () => {
    expect(translateUiString("Select revision")).toBe("Choisir une révision");
    expect(translateUiString("Agent paused by budget")).toBe("Agent mis en pause par le budget");
    expect(translateUiString("Agent heartbeats blocked by budget")).toBe("Heartbeats de l’agent bloqués par le budget");
    expect(translateUiString("A hosted workspace tracked by external reference.")).toBe("Un espace de travail hébergé suivi par une référence externe.");
    expect(translateUiString("Change project color")).toBe("Changer la couleur du projet");
    expect(translateUiString("Clipboard access was denied.")).toBe("L’accès au presse-papiers a été refusé.");
    expect(translateUiString("Delete this workspace repo?")).toBe("Supprimer ce dépôt d’espace de travail ?");
    expect(translateUiString("Delete this workspace local folder?")).toBe("Supprimer ce dossier local d’espace de travail ?");
    expect(translateUiString("Create secret from current plain value")).toBe("Créer un secret à partir de la valeur actuelle en clair");
    expect(translateUiString("Default workspace")).toBe("Espace de travail par défaut");
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
