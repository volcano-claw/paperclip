const EXACT_TRANSLATIONS = new Map<string, string>([
  ["Approve", "Approuver"],
  ["Approving...", "Approbation..."],
  ["Reject", "Refuser"],
  ["Rejecting...", "Refus..."],
  ["Request revision", "Demander une révision"],
  ["Loading...", "Chargement..."],
  ["Search", "Rechercher"],
  ["Settings", "Paramètres"],
  ["Company Settings", "Paramètres de l’entreprise"],
  ["Company settings", "Paramètres de l’entreprise"],
  ["Instance Settings", "Paramètres de l’instance"],
  ["Dashboard", "Tableau de bord"],
  ["Companies", "Entreprises"],
  ["Company", "Entreprise"],
  ["Agents", "Agents"],
  ["Projects", "Projets"],
  ["Goals", "Objectifs"],
  ["Inbox", "Boîte de réception"],
  ["Activity", "Activité"],
  ["Costs", "Coûts"],
  ["Routines", "Routines"],
  ["Workspaces", "Espaces de travail"],
  ["Access", "Accès"],
  ["Invites", "Invitations"],
  ["Skills", "Compétences"],
  ["General", "Général"],
  ["Experimental", "Expérimental"],
  ["Adapters", "Adaptateurs"],
  ["Plugins", "Plugins"],
  ["Profile", "Profil"],
  ["Heartbeats", "Battements"],
  ["Pause", "Mettre en pause"],
  ["Resume", "Reprendre"],
  ["Budget", "Budget"],
  ["Overview", "Vue d’ensemble"],
  ["Issues", "Tickets"],
  ["Configuration", "Configuration"],
  ["Runtime logs", "Journaux runtime"],
  ["Requests", "Demandes"],
  ["Approval", "Approbation"],
  ["Approvals", "Approbations"],
  ["Unread", "Non lus"],
  ["Recent", "Récents"],
  ["All", "Tous"],
  ["Actions", "Actions"],
  ["Pages", "Pages"],
  ["No results found.", "Aucun résultat trouvé."],
  ["Create new issue", "Créer un nouveau ticket"],
  ["Create new agent", "Créer un nouvel agent"],
  ["Create new project", "Créer un nouveau projet"],
  ["Search issues, agents, projects...", "Rechercher des tickets, agents, projets..."],
  ["Requested by", "Demandé par"],
  ["Decision note.", "Note de décision."],
  ["View details", "Voir les détails"],
  ["Create your Paperclip account first. If you already have one, switch to sign in and continue the invite with the same email.", "Crée d’abord ton compte PaperClip. Si tu en as déjà un, passe en connexion et continue l’invitation avec la même adresse email."],
  ["Your account is ready. Review the invite details, then accept it to continue.", "Ton compte est prêt. Vérifie les détails de l’invitation, puis accepte-la pour continuer."],
  ["Already signed up before? Use the existing-account option instead so the invite lands on the right Paperclip user.", "Déjà inscrit auparavant ? Utilise plutôt l’option compte existant pour que l’invitation arrive sur le bon utilisateur PaperClip."],
  ["No account yet? Switch back to create account so you can accept the invite with a new login.", "Pas encore de compte ? Reviens à la création de compte pour accepter l’invitation avec un nouveau login."],
  ["pending", "en attente"],
  ["approved", "approuvé"],
  ["rejected", "refusé"],
  ["revision requested", "révision demandée"],
  ["Pending", "En attente"],
  ["Approved", "Approuvé"],
  ["Rejected", "Refusé"],
  ["Revision requested", "Révision demandée"],
  ["Join", "Rejoindre"],
  ["Join request", "Demande de rejoindre"],
  ["Set up Paperclip", "Configurer PaperClip"],
  ["Continue", "Continuer"],
  ["Back", "Retour"],
  ["Testing...", "Test en cours..."],
  ["Test environment", "Tester l’environnement"],
  ["Stop", "Arrêter"],
  ["Restart", "Redémarrer"],
  ["No services are configured for this workspace.", "Aucun service n’est configuré pour cet espace de travail."],
  ["No services running", "Aucun service en cours"],
  ["Move down", "Descendre"],
  ["Move up", "Monter"],
  ["Open", "Ouvrir"],
  ["Close", "Fermer"],
  ["New Company", "Nouvelle entreprise"],
  ["Create your first company", "Crée ta première entreprise"],
  ["Create another company", "Créer une autre entreprise"],
  ["Instance setup required", "Configuration de l’instance requise"],
  [
    "No instance admin exists yet. Run this command in your Paperclip environment to generate the first admin invite URL:",
    "Aucun admin d’instance n’existe encore. Lance cette commande dans ton environnement PaperClip pour générer l’URL de la première invitation admin :",
  ],
  [
    "No instance admin exists yet. A bootstrap invite is already active. Check your Paperclip startup logs for the first admin invite URL, or run this command to rotate it:",
    "Aucun admin d’instance n’existe encore. Une invitation bootstrap est déjà active. Vérifie les logs de démarrage de PaperClip pour retrouver l’URL de la première invitation admin, ou lance cette commande pour la régénérer :",
  ],
  ["Sign in required", "Connexion requise"],
  ["Sign in to Paperclip", "Se connecter à PaperClip"],
  ["Create your Paperclip account", "Créer ton compte PaperClip"],
  ["Use your email and password to access this instance.", "Utilise ton email et ton mot de passe pour accéder à cette instance."],
  ["Email", "Email"],
  ["Password", "Mot de passe"],
  ["Sign In", "Se connecter"],
  ["Need an account?", "Besoin d’un compte ?"],
  ["Create one", "En créer un"],
  ["Already have an account?", "Tu as déjà un compte ?"],
  ["Sign in", "Se connecter"],
  ["Invite not available", "Invitation indisponible"],
  ["This invite may be expired, revoked, or already used.", "Cette invitation est peut-être expirée, révoquée ou déjà utilisée."],
  [
    "Sign in or create an account, then return to this page to approve the CLI access request.",
    "Connecte-toi ou crée un compte, puis reviens sur cette page pour approuver la demande d’accès CLI.",
  ],
  [
    "Sign in or create an account, then return to this page to claim Board ownership.",
    "Connecte-toi ou crée un compte, puis reviens sur cette page pour revendiquer la propriété du Board.",
  ],
  ["Sign in / Create account", "Se connecter / Créer un compte"],
  [
    "This challenge requires instance-admin access. Sign in with an instance admin account to approve it.",
    "Ce challenge nécessite un accès admin d’instance. Connecte-toi avec un compte admin d’instance pour l’approuver.",
  ],
  ["You've been invited to join Paperclip", "Tu as été invité à rejoindre PaperClip"],
  ["Create your account", "Créer ton compte"],
  ["Create account", "Créer un compte"],
  ["Create account and continue", "Créer le compte et continuer"],
  ["Sign in and continue", "Se connecter et continuer"],
  ["I already have an account", "J’ai déjà un compte"],
  ["Message from inviter", "Message de l’invitant"],
  ["Sign in to continue", "Se connecter pour continuer"],
  ["Invited by", "Invité par"],
  ["Requested access", "Accès demandé"],
  ["Invite expires", "Invitation expire le"],
  ["Company access", "Accès entreprise"],
  ["Agent join request", "Demande d’entrée d’agent"],
  ["Paperclip board", "Board PaperClip"],
  ["Operator", "Opérateur"],
  ["No company selected. Select a company from the switcher above.", "Aucune société sélectionnée. Choisis une société depuis le sélecteur au-dessus."],
  ["Danger Zone", "Zone de danger"],
  ["Appearance", "Apparence"],
  ["Company name", "Nom de la société"],
  ["Description", "Description"],
  ["Optional company description", "Description optionnelle de la société"],
  ["Archive company", "Archiver la société"],
  ["Archiving...", "Archivage..."],
  ["Already archived", "Déjà archivée"],
  ["Delete company", "Supprimer la société"],
  ["Deleting...", "Suppression..."],
  ["Approval confirmed", "Approbation confirmée"],
  ["Approval not found.", "Approbation introuvable."],
  ["Requesting agent was notified to review this approval and linked issues.", "L’agent demandeur a été notifié pour revoir cette approbation et les tickets liés."],
  ["Approve failed", "Échec de l’approbation"],
  ["Reject failed", "Échec du refus"],
  ["Delete failed", "Échec de la suppression"],
  ["Save changes", "Enregistrer les modifications"],
  ["Saving...", "Enregistrement..."],
  ["Saved", "Enregistré"],
  ["Failed to save", "Échec de l’enregistrement"],
  ["Failed to approve", "Échec de l’approbation"],
  ["Failed to reject", "Échec du refus"],
  ["Failed to update heartbeat.", "Échec de la mise à jour du heartbeat."],
  ["Failed to disable all heartbeats.", "Échec de la désactivation de tous les heartbeats."],
  ["Failed to load scheduler heartbeats.", "Échec du chargement des heartbeats du scheduler."],
  ["Failed to sign out.", "Échec de la déconnexion."],
  ["Failed to update general settings.", "Échec de la mise à jour des paramètres généraux."],
  ["Failed to load general settings.", "Échec du chargement des paramètres généraux."],
  ["Failed to update experimental settings.", "Échec de la mise à jour des paramètres expérimentaux."],
  ["Failed to load experimental settings.", "Échec du chargement des paramètres expérimentaux."],
  ["Société supprimée", "Société supprimée"],
  ["Failed to archive company", "Échec de l’archivage de la société"],
  ["Failed to delete company", "Échec de la suppression de la société"],
  ["Remove logo", "Retirer le logo"],
  ["Removing...", "Suppression..."],
  ["Uploading logo...", "Téléversement du logo..."],
  ["Logo upload failed", "Échec du téléversement du logo"],
  ["Company Packages", "Paquets de société"],
  ["Export", "Exporter"],
  ["Import", "Importer"],
  ["Copy snippet", "Copier le snippet"],
  ["Copied snippet", "Snippet copié"],
  ["Settings", "Paramètres"],
  ["Start Onboarding", "Démarrer l’onboarding"],
  ["Add Agent", "Ajouter un agent"],
  ["Get started by creating a company.", "Commence par créer une entreprise."],
  [
    "Run onboarding again to create another company and seed its first agent.",
    "Relance l’onboarding pour créer une autre entreprise et initialiser son premier agent.",
  ],
  [
    "Run onboarding again to add an agent and a starter task for this company.",
    "Relance l’onboarding pour ajouter un agent et une première tâche à cette entreprise.",
  ],
  ["Invite member", "Inviter un membre"],
  ["Save", "Enregistrer"],
  ["Cancel", "Annuler"],
  ["Light", "Clair"],
  ["Dark", "Sombre"],
  ["System", "Système"],
  ["Sign out", "Se déconnecter"],
]);

const REGEX_TRANSLATIONS: Array<[RegExp, string]> = [
  [/^Agent paused by budget$/i, "Agent mis en pause par le budget"],
  [/^Add another agent to (.+)$/i, "Ajouter un autre agent à $1"],
  [/^Jump back to the last settings page you opened\.$/i, "Revenir à la dernière page de paramètres ouverte."],
  [/^Approval request created (.+)$/i, "Demande d’approbation créée $1"],
  [/^(\d+) services running$/i, "$1 services en cours"],
  [/^An account already exists for (.+)\. Sign in below to continue with this invite\.$/i, "Un compte existe déjà pour $1. Connecte-toi ci-dessous pour continuer avec cette invitation."],
  [/^Join (.+)$/i, "Rejoindre $1"],
  [/^Archive company "(.+)"\? It will be hidden from the sidebar\.$/i, "Archiver la société \"$1\" ? Elle sera masquée dans la barre latérale."],
  [/^Delete company "(.+)" permanently\? Type the company name to confirm\.$/i, "Supprimer définitivement la société \"$1\" ? Tape le nom de la société pour confirmer."],
  [/^Failed to disable 1 timer heartbeat: (.+)$/i, "Échec de la désactivation d’un heartbeat timer : $1"],
  [/^Failed to disable (\d+) of (\d+) timer heartbeats\. First error: (.+)$/i, "Échec de la désactivation de $1 heartbeat(s) timer sur $2. Première erreur : $3"],
];

const ATTRIBUTE_NAMES = ["placeholder", "title", "aria-label", "aria-placeholder"] as const;

function preserveEdgeWhitespace(source: string, translated: string): string {
  const leading = source.match(/^\s*/)?.[0] ?? "";
  const trailing = source.match(/\s*$/)?.[0] ?? "";
  return `${leading}${translated}${trailing}`;
}

export function translateUiString(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return input;

  const exact = EXACT_TRANSLATIONS.get(trimmed);
  if (exact) return preserveEdgeWhitespace(input, exact);

  for (const [pattern, replacement] of REGEX_TRANSLATIONS) {
    if (pattern.test(trimmed)) {
      return preserveEdgeWhitespace(input, trimmed.replace(pattern, replacement));
    }
  }

  return input;
}

function shouldSkipElementText(element: Element | null): boolean {
  if (!element) return true;
  const htmlElement = element as HTMLElement;
  if (htmlElement.isContentEditable) return true;
  if (element.closest("textarea, input, code, pre, [data-no-ui-translate], .cm-editor, .mdxeditor, .prose, .markdown-body")) {
    return true;
  }
  return false;
}

function shouldSkipElementAttributes(element: Element | null): boolean {
  if (!element) return true;
  const htmlElement = element as HTMLElement;
  if (htmlElement.isContentEditable) return true;
  if (element.closest("code, pre, [data-no-ui-translate], .cm-editor, .mdxeditor, .prose, .markdown-body")) {
    return true;
  }
  return false;
}

function translateTextNode(node: Text): void {
  const parent = node.parentElement;
  if (shouldSkipElementText(parent)) return;
  const translated = translateUiString(node.textContent ?? "");
  if (translated !== (node.textContent ?? "")) {
    node.textContent = translated;
  }
}

function translateElementAttributes(element: Element): void {
  if (shouldSkipElementAttributes(element)) return;
  for (const attribute of ATTRIBUTE_NAMES) {
    const value = element.getAttribute(attribute);
    if (!value) continue;
    const translated = translateUiString(value);
    if (translated !== value) {
      element.setAttribute(attribute, translated);
    }
  }
}

function translateSubtree(root: Node): void {
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root as Text);
    return;
  }

  if (!(root instanceof Element) && !(root instanceof Document) && !(root instanceof DocumentFragment)) {
    return;
  }

  if (root instanceof Element) {
    translateElementAttributes(root);
  }

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let current: Node | null = walker.currentNode;
  while (current) {
    if (current.nodeType === Node.TEXT_NODE) {
      translateTextNode(current as Text);
    } else if (current instanceof Element) {
      translateElementAttributes(current);
    }
    current = walker.nextNode();
  }
}

export function applyFrenchUiTranslations(root: ParentNode = document.body): void {
  if (typeof document === "undefined" || !root) return;
  if (document.documentElement.lang !== "fr") {
    document.documentElement.lang = "fr";
  }
  translateSubtree(root as unknown as Node);
}

export function startFrenchUiTranslator(doc: Document = document): () => void {
  if (typeof MutationObserver === "undefined" || !doc.body) {
    applyFrenchUiTranslations(doc.body);
    return () => {};
  }

  applyFrenchUiTranslations(doc.body);

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "characterData" && mutation.target.nodeType === Node.TEXT_NODE) {
        translateTextNode(mutation.target as Text);
        continue;
      }

      if (mutation.type === "attributes" && mutation.target instanceof Element) {
        translateElementAttributes(mutation.target);
        continue;
      }

      for (const node of mutation.addedNodes) {
        translateSubtree(node);
      }
    }
  });

  observer.observe(doc.body, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: [...ATTRIBUTE_NAMES],
  });

  return () => observer.disconnect();
}
