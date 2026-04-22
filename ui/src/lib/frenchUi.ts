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
  ["Signing out...", "Déconnexion..."],
  ["Accept invite", "Accepter l’invitation"],
  ["Authentication failed", "Échec de l’authentification"],
  ["Comment failed", "Échec du commentaire"],
  ["Copy failed", "Échec de la copie"],
  ["Save failed", "Échec de l’enregistrement"],
  ["Cancel failed", "Échec de l’annulation"],
  ["Export failed", "Échec de l’export"],
  ["Issue update failed", "Échec de la mise à jour du ticket"],
  ["Routine run failed", "Échec de l’exécution de la routine"],
  ["Run failed", "Échec de l’exécution"],
  ["Tool failed", "Échec de l’outil"],
  ["Create Issue", "Créer un ticket"],
  ["New Agent", "Nouvel agent"],
  ["New issue", "Nouveau ticket"],
  ["Project name", "Nom du projet"],
  ["Project workspace", "Espace de travail du projet"],
  ["Workspace name", "Nom de l’espace de travail"],
  ["Workspace ID", "ID de l’espace de travail"],
  ["Workspace commands JSON", "Commandes JSON de l’espace de travail"],
  ["Workspace commands JSON must be a JSON object.", "Les commandes JSON de l’espace de travail doivent être un objet JSON."],
  ["Workspace job completed.", "Tâche d’espace de travail terminée."],
  ["Workspace service started.", "Service d’espace de travail démarré."],
  ["Workspace service stopped.", "Service d’espace de travail arrêté."],
  ["Workspace service restarted.", "Service d’espace de travail redémarré."],
  ["Select company", "Choisir une société"],
  ["No assignee", "Aucun assigné"],
  ["No assignees found.", "Aucun assigné trouvé."],
  ["No company selected", "Aucune société sélectionnée"],
  ["No project", "Aucun projet"],
  ["No projects found.", "Aucun projet trouvé."],
  ["Search assignees...", "Rechercher des assignés..."],
  ["Search issues...", "Rechercher des tickets..."],
  ["Search projects...", "Rechercher des projets..."],
  ["Invite metadata unavailable", "Métadonnées d’invitation indisponibles"],
  ["Join request approved", "Demande d’entrée approuvée"],
  ["Join request rejected", "Demande d’entrée refusée"],
  ["Failed to create invite", "Échec de la création de l’invitation"],
  ["Failed to create agent", "Échec de la création de l’agent"],
  ["Failed to load workspace", "Échec du chargement de l’espace de travail"],
  ["Failed to control workspace commands.", "Échec du contrôle des commandes de l’espace de travail."],
  ["Failed to approve join request", "Échec de l’approbation de la demande d’entrée"],
  ["Failed to reject join request", "Échec du refus de la demande d’entrée"],
  ["Failed to load OpenCode models.", "Échec du chargement des modèles OpenCode."],
  ["OpenCode models are still loading. Please wait and try again.", "Les modèles OpenCode sont encore en cours de chargement. Attends un instant puis réessaie."],
  ["Failed to update routine", "Échec de la mise à jour de la routine"],
  ["Default agent required", "Agent par défaut requis"],
  ["Heartbeat on interval", "Heartbeat à intervalle régulier"],
  ["Run heartbeat every", "Exécuter le heartbeat toutes les"],
  ["In Review", "En revue"],
  ["Delete attachment", "Supprimer la pièce jointe"],
  ["Unknown agent", "Agent inconnu"],
  ["Unknown human requester", "Demandeur humain inconnu"],
  ["Unknown project", "Projet inconnu"],
  ["Create invite", "Créer une invitation"],
  ["Create project", "Créer un projet"],
  ["Create agent", "Créer un agent"],
  ["Create your first agent to get started.", "Crée ton premier agent pour commencer."],
  ["Create or select a company to view the dashboard.", "Crée ou choisis une société pour afficher le tableau de bord."],
  ["Create or select a company before testing adapter environment.", "Crée ou choisis une société avant de tester l’environnement de l’adaptateur."],
  ["Create Account", "Créer un compte"],
  ["Agent name", "Nom de l’agent"],
  ["Close workspace", "Fermer l’espace de travail"],
  ["Configuration test failed.", "Échec du test de configuration."],
  ["Copy issue as markdown", "Copier le ticket en markdown"],
  ["Could not save", "Impossible d’enregistrer"],
  ["Create an account for this instance. Email confirmation is not required in v1.", "Crée un compte pour cette instance. La confirmation par email n’est pas requise en v1."],
  ["Existing isolated workspace", "Espace de travail isolé existant"],
  ["Issues by Priority", "Tickets par priorité"],
  ["Issues by Status", "Tickets par statut"],
  ["New isolated workspace", "Nouvel espace de travail isolé"],
  ["Paperclip could not start the routine run.", "PaperClip n’a pas pu démarrer l’exécution de la routine."],
  ["Paperclip could not update the routine.", "PaperClip n’a pas pu mettre à jour la routine."],
  ["Project default", "Projet par défaut"],
  ["Reuse existing workspace", "Réutiliser l’espace de travail existant"],
  ["Review the invite details, then submit the agent information below to start the join request.", "Vérifie les détails de l’invitation, puis envoie les informations de l’agent ci-dessous pour démarrer la demande d’entrée."],
  ["Routine title", "Titre de la routine"],
  ["Save note", "Enregistrer la note"],
  ["Search inbox…", "Rechercher dans la boîte de réception…"],
  ["Search models...", "Rechercher des modèles..."],
  ["Select a company to create secrets", "Choisis une société pour créer des secrets"],
  ["Select a company to upload images", "Choisis une société pour téléverser des images"],
  ["Select a company to view routines.", "Choisis une société pour voir les routines."],
  ["Select a file to preview its contents.", "Choisis un fichier pour prévisualiser son contenu."],
  ["Select model (required)", "Choisir un modèle (obligatoire)"],
  ["Set a default agent before enabling routine automation.", "Définis un agent par défaut avant d’activer l’automatisation de la routine."],
  ["That email and password did not match an existing Paperclip account. Check both fields, or create an account first if you are new here.", "Cet email et ce mot de passe ne correspondent à aucun compte PaperClip existant. Vérifie les deux champs, ou crée d’abord un compte si tu es nouveau ici."],
  ["This account already belongs to the company.", "Ce compte appartient déjà à la société."],
  ["Use the Paperclip account that already matches this invite. If you do not have one yet, switch back to create account.", "Utilise le compte PaperClip qui correspond déjà à cette invitation. Si tu n’en as pas encore, repasse à la création de compte."],
  ["A company admin", "Un admin de société"],
  ["A fresh isolated workspace will be created when this issue runs.", "Un nouvel espace de travail isolé sera créé quand ce ticket s’exécutera."],
  ["A new join request is waiting for approval.", "Une nouvelle demande d’entrée attend une approbation."],
  ["Accept bootstrap invite", "Accepter l’invitation bootstrap"],
  ["Accept company invite", "Accepter l’invitation entreprise"],
  ["Action failed", "Échec de l’action"],
  ["Add Project", "Ajouter un projet"],
  ["Add company", "Ajouter une société"],
  ["Add reviewer or approver", "Ajouter un relecteur ou un approbateur"],
  ["Agent attribution", "Attribution de l’agent"],
  ["Agent options", "Options de l’agent"],
  ["Agents Enabled", "Agents activés"],
  ["Approval approved", "Approbation approuvée"],
  ["Approval failed", "Échec de l’approbation"],
  ["Approval rejected", "Approbation refusée"],
  ["Approve CLI access", "Approuver l’accès CLI"],
  ["Approve human", "Approuver l’humain"],
  ["Approve join requests", "Approuver les demandes d’entrée"],
  ["Archive failed", "Échec de l’archivage"],
  ["Assign scoped tasks", "Assigner des tâches ciblées"],
  ["Assign tasks", "Assigner des tâches"],
  ["Assign to me", "M’assigner"],
  ["Assign to requester", "Assigner au demandeur"],
  ["Awaiting board review", "En attente de revue du board"],
  ["Board Approval", "Approbation du board"],
  ["Board view", "Vue board"],
  ["Bootstrap invite", "Invitation bootstrap"],
  ["Checking your company access. Try again in a moment.", "Vérification de ton accès à la société. Réessaie dans un instant."],
  ["Claim ownership", "Revendiquer la propriété"],
  ["Clipboard unavailable", "Presse-papiers indisponible"],
  ["Company access updated", "Accès société mis à jour"],
  ["Company not found", "Société introuvable"],
  ["Configuration saved.", "Configuration enregistrée."],
  ["Could not save agent", "Impossible d’enregistrer l’agent"],
  ["Create & Open Issue", "Créer et ouvrir un ticket"],
  ["Create Sub-Issue", "Créer un sous-ticket"],
  ["Create a new agent", "Créer un nouvel agent"],
  ["Create agents", "Créer des agents"],
  ["Create goal", "Créer un objectif"],
  ["Create label", "Créer un label"],
  ["Create routine", "Créer une routine"],
  ["Execution workspace", "Espace de travail d’exécution"],
  ["Execution workspace name", "Nom de l’espace de travail d’exécution"],
  ["Execution workspaces help", "Aide sur les espaces de travail d’exécution"],
  ["Failed runs", "Exécutions échouées"],
  ["Failed to accept invite", "Échec de l’acceptation de l’invitation"],
  ["Failed to archive issue", "Échec de l’archivage du ticket"],
  ["Failed to archive project", "Échec de l’archivage du projet"],
  ["Failed to build export package.", "Échec de la génération du paquet d’export."],
  ["Failed to claim board ownership", "Échec de la revendication de propriété du board"],
  ["Failed to close workspace", "Échec de la fermeture de l’espace de travail"],
  ["Failed to create company", "Échec de la création de la société"],
  ["Failed to create issue. Try again.", "Échec de la création du ticket. Réessaie."],
  ["Failed to create routine", "Échec de la création de la routine"],
  ["Failed to create secret", "Échec de la création du secret"],
  ["Failed to create task", "Échec de la création de la tâche"],
  ["Failed to delete document", "Échec de la suppression du document"],
  ["Failed to disable plugin", "Échec de la désactivation du plugin"],
  ["Failed to enable plugin", "Échec de l’activation du plugin"],
  ["Failed to install plugin", "Échec de l’installation du plugin"],
  ["Failed to load adapter models.", "Échec du chargement des modèles de l’adaptateur."],
  ["Failed to load app state", "Échec du chargement de l’état de l’application"],
  ["Failed to load company members.", "Échec du chargement des membres de la société."],
  ["Failed to load export data.", "Échec du chargement des données d’export."],
  ["Failed to load invites.", "Échec du chargement des invitations."],
  ["Failed to load join requests.", "Échec du chargement des demandes d’entrée."],
  ["Failed to load profile.", "Échec du chargement du profil."],
  ["Failed to load routines", "Échec du chargement des routines"],
  ["Failed to load users.", "Échec du chargement des utilisateurs."],
  ["Failed to load workspace operations.", "Échec du chargement des opérations d’espace de travail."],
  ["Failed to remove member", "Échec de la suppression du membre"],
  ["Failed to render Mermaid diagram.", "Échec du rendu du diagramme Mermaid."],
  ["Create skill", "Créer une compétence"],
  ["Create document", "Créer un document"],
  ["Create sub-goal", "Créer un sous-objectif"],
  ["Created by", "Créé par"],
  ["Created by this run", "Créé par cette exécution"],
  ["Copied to clipboard", "Copié dans le presse-papiers"],
  ["Copied path to workspace", "Chemin de l’espace de travail copié"],
  ["Select revision", "Choisir une révision"],
  ["A hosted workspace tracked by external reference.", "Un espace de travail hébergé suivi par une référence externe."],
  ["Agent heartbeats blocked by budget", "Heartbeats de l’agent bloqués par le budget"],
  ["Archive this project to hide it from the sidebar and project selectors.", "Archive ce projet pour le masquer dans la barre latérale et les sélecteurs de projets."],
  ["Change project color", "Changer la couleur du projet"],
  ["Clipboard access was denied.", "L’accès au presse-papiers a été refusé."],
  ["Clear local folder from this workspace?", "Effacer le dossier local de cet espace de travail ?"],
  ["Clear repo from this workspace?", "Retirer le dépôt de cet espace de travail ?"],
  ["Company-wide monthly policy.", "Politique mensuelle à l’échelle de la société."],
  ["Copy the invite URL manually from the field below.", "Copie manuellement l’URL d’invitation depuis le champ ci-dessous."],
  ["Create secret from current plain value", "Créer un secret à partir de la valeur actuelle en clair"],
  ["Default workspace", "Espace de travail par défaut"],
  ["Delete this disapproved agent? This cannot be undone.", "Supprimer cet agent désapprouvé ? Cette action est irréversible."],
  ["Delete this workspace local folder?", "Supprimer ce dossier local d’espace de travail ?"],
  ["Delete this workspace repo?", "Supprimer ce dépôt d’espace de travail ?"],
  ["Disable Timer Heartbeat", "Désactiver le heartbeat timer"],
  ["Enable Timer Heartbeat", "Activer le heartbeat timer"],
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
