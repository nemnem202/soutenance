- optimiser l'envoi d'images cote frontend
- retirer tous les style inline inutiles
- retirer les duplicatas d'imports de ma font zing rust
- unplugin-font
- les inputs game ne sont pas interractibles en mobile
- tous les imports depuis le dossier public doivent se faire en mode import fichier from '/assets/nom du fichier'
- corriger l'edit de l'image
- token csrf
- implementer websocket avec socket.io
- reviser securite web.pdf
- implementer refresh token si possible




- Les spacers semblent pouvoir contenir des accords
- filtrer les playlists redondantes + retirer toutes les playlists qui ne correspondent pas à certaines regles



ruleset: 
- une mesure qui contient un seul accord -> une seule cell      V
- une mesure vide -> supprimer          V
- A % B % -> A B        V
- une mesure en 4/4 ne peut pas contenir plus de 4 accords (idem pour les autres signatures)         X
- ce qui est entre "{" et "}" est forcément une section (générique par défaut)      X