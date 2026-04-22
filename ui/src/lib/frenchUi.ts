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
  ["Pause", "Mettre en pause"],
  ["Resume", "Reprendre"],
  ["Budget", "Budget"],
  ["Overview", "Vue d’ensemble"],
  ["Issues", "Tickets"],
  ["Configuration", "Configuration"],
  ["Runtime logs", "Journaux runtime"],
  ["Requests", "Demandes"],
  ["Unread", "Non lus"],
  ["Recent", "Récents"],
  ["All", "Tous"],
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
  ["Create account", "Créer un compte"],
  ["I already have an account", "J’ai déjà un compte"],
  ["Message from inviter", "Message de l’invitant"],
  ["Sign in to continue", "Se connecter pour continuer"],
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
