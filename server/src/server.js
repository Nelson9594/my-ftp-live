import { createServer } from "net";
const fs = require("fs");

export function launch(port) {
  const server = createServer((socket) => {
    console.log("new connection.");
    socket.on("data", (data) => {
      const message = data.toString();

      const [command, ...args] = message.trim().split(" ");
      console.log(command, args);

      const help ="USER <username>: Vérifie si l'utilisateur existe\r\n"+
                  "PASS <password>: Utilise un mots de passe\r\n"+
                  "LIST: Liste le dossier actuel \r\n"+
                  "CWD <directory>: Change le dossier courant\r\n"+
                  "RETR <filename>: Transfére un fichier vers le serveur\r\n"+
                  "STOR <filename>: Transfére un fichier vers le client\r\n"+
                  "PWD: Affiche le dossier courant\r\n"+
                  "QUIT: Quitte\r\n";

      switch(command) {

        case "QUIT":
          socket.write("221\r\n");
          socket.write(process.exit());
          //Quitte le processus
          break;

        case "HELP":
            socket.write(help);
            //Liste les commandes
            break;


        case "USER":
          const username = JSON.parse(fs.readFileSync("C:/Users/Administrateur/Documents/workspace/my-ftp-live/server/data/user.json", "utf-8"));
          //parser le fichier json
          username.forEach(element => {
            if (element.name == args[0]) {
              socket.write("User Connecté");
            }
            else {
              socket.write("User Non connecté");
            }
          });
          socket.write("230 User logged in, proceed.\r\n");
          break;

        case "CWD":
          process.chdir(args[0]);
          socket.write(`250, ${process.cwd()} \r\n`);
          //Changement de repertoire ../nomdufichier
          break;

        case "PWD":
          socket.write(`257, ${process.cwd()} \r\n`);
          //Affiche le dossier courant
          break;
    
        case "SYST":
          socket.write("215 \r\n");
          break;
        case "FEAT":
          socket.write("211 \r\n");
          break;
      
        case "TYPE":
          socket.write("200 \r\n");
          break;
        default:
          console.log("command not supported:", command, args);
      }
    });

    socket.write("220 Bonjour à toi \r\n");
  });

  server.listen(port, () => {
    console.log(`server started at localhost:${port}`);
  });
}
