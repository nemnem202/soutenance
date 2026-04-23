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





- Les spacers semblent pouvoir contenir des accords
- Les voltas sont vides alors qu'elles devraient contenir des mesures
- les semis diminués se transforment en B7
- formatter les cellules dans le seeding (retirer les mesures vides + supprimer les cellules vides quand on peut)
- filtrer les playlists redondantes + retirer toutes les playlists qui ne correspondent pas à certaines regles
- ajouter la time signature par défaut a chaque premiere cellule dans le seeding



ruleset: 
- une mesure qui contient un seul accord -> une seule cell
- une mesure vide -> supprimer
- A % B % -> A B
- une mesure en 4/4 ne peut pas contenir plus de 4 accords (idem pour les autres signatures)
- ce qui est entre "{" et "}" est forcément une section (générique par défaut)