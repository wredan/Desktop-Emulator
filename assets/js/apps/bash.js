var username = "user";

function initBash(id) { 
    setName(id);

    /* ***** variabili e costanti globali ***** */

    var terminalId;    
    var historyArray = [];
    var historyIndex = 0;
    const TAB = "&nbsp;&nbsp;&nbsp;&nbsp;";
    var variables = {};
    
    /* ***** funzioni di supporto ***** */

    var fileSystemError = () => { return "<div class='common-text'>bash: comando alquanto inutile, non ti aspettavi esistesse davvero un file system :)"; }

    function setFocusCurrentInput() {
        $(terminalId + ' .custom-command-input').last().focus();
    }

    function getOldCommand(input) {
        if (historyIndex > 0) {
            input.value = historyArray[--historyIndex];
        }
    }

    function getNextCommand(input) {
        if (historyIndex < historyArray.length - 1)
            input.value = historyArray[++historyIndex];
        else if (historyIndex == historyArray.length - 1) {
            historyIndex++;
            input.value = "";
        }
    }

    /* ***** strutture dati ***** */

    var commandsList = {
        calc: "<span class='yellow'>calc</span> <span class='orange'>number operator number</span> - prende in input una espressione da risolvere, operatori {+,-,/,*}.",
        clear: "<span class='yellow'>clear</span> - Pulisce lo spazio di lavoro della bash.",
        credits: "<span class='yellow'>credits</span> - autore di questa demo.",
        echo: "<span class='yellow'>echo</span> - Stampa la stringa inserita.",
        exit: "<span class='yellow'>exit</span> - Chiude il terminale.",
        help: "<span class='yellow'>help</span> <span class='orange'>[-f/--filter argomento]</span> - Fornisce la lista dei comandi, accetta 1 parametro per filtrare la lista dei comandi.",
        history: "<span class='yellow'>history</span> <span class='orange'>[-c/--clear]</span> - restituisce lo storico dei comandi.",
        mkvar: "<span class='yellow'>mkvar</span> <span class='orange'>-n/--name nome -t/--type tipo -v/--value valore</span> - imposta una variabile di memoria del tipo e valore digitati.",
        username: "<span class='yellow'>username</span> <span class='orange'>nome</span> - imposta il nome dell'utente.",
        pwd: "<span class='yellow'>pwd</span> - Restituisce il path della cartella attuale.",
        rmvar: "<span class='yellow'>rmvar</span> <span class='orange'>[-a/--all] [-n/--name nome]</span> - rimuove le variabili settate.",
        swvar: "<span class='yellow'>swvar</span> <span class='orange'>[-n/--name nome]</span> - mostra le variabili settate, è possibile filtrare per nome.",
        whoami: "<span class='yellow'>whoami</span> - Restituisce il nome utente.",

        // sum: "<span class='yellow'>sum</span> <span class='orange'>arg1 arg2 ...</span> - effettua la somma di una sequenza di variabili, prende in input il nome delle stesse.",
        // sub: "<span class='yellow'>sub</span> <span class='orange'>arg1 arg2 ...</span> - effettua la sottrazione di una sequenza di variabili, prende in input il nome delle stesse.",
        // mul: "<span class='yellow'>mul</span> <span class='orange'>arg1 arg2 ...</span> - effettua il prodotto di una sequenza di variabili, prende in input il nome delle stesse.",
        // div: "<span class='yellow'>div</span> <span class='orange'>arg1 arg2 ...</span> - effettua la divisione di una sequenza di variabili, prende in input il nome delle stesse.",

        cp: "",
        cd: "",
        ls: "",
        mkdir: "",
        touch: "",
        rm: "",
        rmdir: "",
        webprogramming: "",
        mario: "",

        //app
        fileuploader: ""
    }

    var commandsFunctions = {
        calc: (parameters) => {            
            if (parameters) {
                parameters = parameters.toLowerCase().split(' ');
                if(parameters.length == 3){
                    $(terminalId + " .bash-container").append("<div class='common-text'>calc: contatto il server, attendo risposta...</div>");
                    calcolaEspressione(parameters); 
                    return "noprint";
                }                                             
            } 
            return "<div class='common-text'>bash: il comando 'calc' richiede tre argomenti , usa il comand 'help -f calc' per saperne di più.</div>";
        },
        clear: (parameters) => {
            if (parameters) {
                return "<div class='common-text'>bash: il comando 'clear' non richiede parametri.</div>";
            } else {
                $(terminalId + " .bash-container").html("");
                return "";
            }
        },
        credits: (parameters) => {
            return "<div class='common-text'>bash: realizzato da Danilo Santitto, <a href='https://github.com/Warcreed/Progetti-universitari/tree/master/Simulatore%20Bash' target='_blank'>Github</a></div>";
        },
        echo: (parameters) => {
            if (parameters) {
                return "<div class='common-text'>" + parameters + "</div>";
            } else {
                return "<div class='common-text'>bash: Il comando 'echo' richiede almeno un parametro </div>";
            }
        },
        exit: (parameters) => {
            deleteWindow(terminalId, "bash");
        },
        help: (parameters) => {
            let response = "<div class='common-text'>";
            if (parameters) {
                parameters = parameters.toLowerCase().split(' ');
                for (index in parameters) {
                    if (parameters[index] == '-f' || parameters[index] == '--filter') {
                        response += `<div> Ecco la lista dei comandi che contengono la stringa inserita:</div><ul>`;
                        for (command in commandsList)
                            if (commandsList[command] && command.includes(parameters[parseInt(index) + 1]))
                                response += '<li>' + commandsList[command] + '</li>';
                    }
                }
            } else {
                response += `<div> <p>L'autocompletamento è simulato dal tasto 'ctrl'. Inoltre, questi comandi nella lista potrebbero non essere i soli presenti... :)</p></div>`;
                response += `<div> Ecco la lista completa dei comandi:</div>
                   <ul>`;
                for (command in commandsList) {
                    if (commandsList[command])
                        response += '<li>' + commandsList[command] + '</li>';
                }
            }
            response += '</ul></div>';
            return response;
        },
        history: (parameters) => {
            if (parameters) {
                parameters = parameters.toLowerCase().split(' ');
                for (index in parameters) {
                    if (parameters[index] == '-c' || parameters[index] == '--clear') {
                        historyArray = [];
                        historyIndex = 0;
                    }
                }
                return "";
            } else {
                let commands = "<div class='common-text'>";
                for (let i = 0; i < historyArray.length; i++)
                    commands += i + " " + historyArray[i] + "<br />"
                return commands + "</div>";
            }
        },
        mkvar: (parameters) => {
            if (parameters) {
                parameters = parameters.split(' ');
                let name = "";
                let type = "";
                let val = "";
                for (index in parameters) {
                    if (parameters[index].toLowerCase() == '-n' || parameters[index].toLowerCase() == '--name') {
                        name = parameters[parseInt(index) + 1].trim();
                    } else if (parameters[index] == '-t' || parameters[index] == '--type') {
                        type = parameters[parseInt(index) + 1].trim();
                    } else if (parameters[index] == '-v' || parameters[index] == '--value') {
                        val = parameters[parseInt(index) + 1].trim();
                    }
                }
                if (name && type && val) {
                    switch (type.toLowerCase()()) {
                        case "string": variables[name] = val;
                            break;
                        case "number": variables[name] = Number(val);
                            break;
                        case "boolean": variables[name] = ((val == 'true' || val == '1') ? true : false);
                            break;
                        default: return "<div class='common-text'>bash: il tipo inserito non è valido, usa il comand 'help -f mkvar' per saperne di più.</div>";
                    }
                    return "";
                }
            }
            return "<div class='common-text'>bash: il comando 'mkvar' richiede 3 argomenti in input, usa il comand 'help -f mkval' per saperne di più.</div>";
        },
        username: (parameters) => {
            if (parameters) {
                parameters = parameters.split(' ');
                if(parameters[0].length > 10)
                    return "<div class='common-text'>bash: username troppo lungo, il massimo accettato è 10 caratteri.</div>";
                username = parameters[0];
                return "<div class='common-text'>bash: username impostato correttamente.</div>";
            } else {
                return "<div class='common-text'>bash: il comando 'username' richiede un parametro.</div>";
            }
        },
        pwd: (parameters) => {
            if (parameters) {
                return "<div class='common-text'>bash: il comando 'pwd' non richiede parametri.</div>"
            } else {
                return "<div class='common-text'>/home/" + username + "</div>";
            }
        },
        rmvar: (parameters) => {
            if (parameters) {
                let response = "<div class='common-text'>";
                if (parameters) {
                    parameters = parameters.split(' ');
                    let message = "nomatch";
                    for (index in parameters) {
                        if (parameters[index].toLowerCase() == '-a' || parameters[index].toLowerCase() == '--all') {
                            variables = {};
                            message = "Tabella cancellata";
                        }
                        if (parameters[index] == '-n' || parameters[index] == '--name') {
                            let name = parameters[parseInt(index) + 1].trim();
                            for (index in variables)
                                if (name && index == name) {
                                    delete variables[index];
                                    message = "Variabile cancellata";
                                }
                        }
                    }
                    return response + message + "</div>";
                }
            } else {
                return "<div class='common-text'>bash: il comando 'rmvar' necessita di almeno un parametro, usa il comand 'help -f rmvar' per saperne di più.</div>";
            }
        },
        swvar: (parameters) => {
            let table = "<div class='common-text'><table><tHead><tr><th>Nome</th><th>Tipo</th><th>Valore</th></tr><tHead><tBody>";
            if (parameters) {
                parameters = parameters.split(' ');
                let name = "";
                for (index in parameters) {
                    if (parameters[index].toLowerCase() == '-n' || parameters[index].toLowerCase() == '--name') {
                        name = parameters[parseInt(index) + 1].trim();
                    }
                }
                if (name) {
                    for (index in variables) {
                        if (name && index.includes(name))
                            table += "<tr><td>" + index + "</td><td>" + typeof variables[index] + "</td><td>" + variables[index] + "</td></tr>";
                    }
                    table += "</tBody></table></div>";
                } else {
                    return "<div class='common-text'>bash: il comando 'swvar' non è usato in maniera corretta, usa il comand 'help -f swvar' per saperne di più.</div>";
                }
            } else {
                for (index in variables) {
                    table += "<tr><td>" + index + "</td><td>" + typeof variables[index] + "</td><td>" + variables[index] + "</td></tr>";
                }
                table += "</tBody></table></div>"
            }
            return table;
        },
        whoami: (parameters) => {
            if (parameters) {
                return "<div class='common-text'>bash: il comando 'whoami' non richiede parametri.</div>"
            } else {
                return "<div class='common-text'>" + username + "</div>";
            }
        },

        // sum: (parameters)=>{
        //     if (parameters) {
        //         parameters = parameters.split(' ');
        //         if(parameters.length > 1){
        //             let sum = 0;
        //             for (index in parameters) {
        //                 if(variables[index])
        //                     sum += parseInt(variables[index];                        
        //             }
        //             return "<div class='common-text'>" + sum + "</div>";
        //         }           
        //     }
        //     return "<div class='common-text'>bash: il comando 'sum' richiede almeno due parametri, usa il comand 'help -f sum' per saperne di più.</div>";
        // },

        cd: (parameters) => { return fileSystemError() },
        cp: (parameters) => { return fileSystemError() },
        ls: (parameters) => { return fileSystemError() },
        mkdir: (parameters) => { return fileSystemError() },
        touch: (parameters) => { return fileSystemError() },
        rm: (parameters) => { return fileSystemError() },
        rmdir: (parameters) => { return fileSystemError() },
        webprogramming: (parameters) => { return "<div class='common-text'><div><pre>" + art1 + "</pre><br><br></div>bash: il comando 'webprogramming' non esiste! In compenso però esite un bel corso universitario :)</div>" },
        mario: () => { return "<div class='common-text'><pre>" + art + "</pre></div>"},

        //app
        fileuploader: () => { openFileUploader();}
    }

    /* ***** funzioni principali ***** */

    function calcolaEspressione(params) {
        $.ajax({
            url: '../../php/calcola_espressione.php',
            method: 'GET',
            data: {'number1': params[0], 'operator': params[1], 'number2': params[2]},            
            success: function (response, status) {
                printResult("<div class='common-text'> Risultato: " + params[0] + " " + params[1] + " " + params[2] + " = " + response +"</div>");
            },
            error: function (XMLHttpRequest, textStatus, errorThrown)
            {
                printResult("<div class='common-text'> Errore di connessione al servizio </div>");
            }
        });
    }

    function printResult(response, value = "") {
        $(terminalId + " .bash-container").append(response + commandRow(value));        
        addEventListenerForCommandRow();
        setFocusCurrentInput();
    }

    function autocomplete(input) {
        if (input.value.trim()) {
            let commands = [];
            for (command in commandsList)
                if (command.startsWith(input.value))
                    commands.push(command);
            if (commands.length == 1) {
                input.value = commands[0];
            } else if (commands.length > 1) {
                let response = "<div class='common-text'>";
                for (command of commands)
                    response += TAB + command + TAB;
                response += "</div>";
                input.disabled = true;
                printResult(response, input.value);
            }
        }
    }

    function processCommand(input) {
        tab = false;
        let response = "";
        input.disabled = true;
        if (input.value) {
            let text = input.value.trim();
            if (text) {
                historyArray.push(text);
                historyIndex = historyArray.length;
                let command = text.split(' ', 1)[0].toLowerCase().trim();
                let parameters = text.substring(text.indexOf(' ') + 1).trim();
                if (command in commandsFunctions) {
                    if (parameters != command && parameters != "echo")
                        response += commandsFunctions[command](parameters);
                    else
                        response += commandsFunctions[command]();
                } else {
                    if(command.indexOf('<') >= 0 || command.indexOf('>') >= 0){
                        response = `<div class='common-text'>
                                        bash: chi vorresti attaccare? Io sono ineluttabile!
                                    </div>`;
                    } else {
                        response = `<div class='common-text'>
                                        bash: comando '` + command + `' non riconosciuto, inserisci il comando 'help' per ottenere una lista dei comandi.
                                    </div>`;
                    }               
                }
            }
        }
        if(response != "noprint")
            printResult(response);
    }

    // function setNameListener(id) {
    //     terminalId = id;
    //     name = "carlo"
    //     if(!name){
    //         $(terminalId + " .bash-container").append(setName);
    //         console.log($(terminalId + " .bash-container"))
    //         setFocusCurrentInput();
    //         console.log("prova")
    //         $(terminalId + " .custom-command-input").last().keydown(function (e) {
    //             if(e.key == "Enter"){
    //                 if($(this).val().trim()){
    //                     name =$(this).val();
    //                     $(this).prop('disabled', true);
    //                     printResult("");
    //                 }  else {
    //                     $(terminalId + " .bash-container").append(setName);
    //                 }
    //                 setFocusCurrentInput();
    //             }
    //         });
    //     } else {
    //         printResult("");
    //     }        
    // }

     function setName(id) {
        terminalId = id;
        addEventListenerForCommandRow();
    }

    function addEventListenerForCommandRow() {
        $(terminalId + " .custom-command-input").last().keydown(function (e) {
            switch (e.key) {
                case "Enter": processCommand(this);
                    break;
                case "ArrowUp": getOldCommand(this);
                    break;
                case "ArrowDown": getNextCommand(this);
                    break;
                case "Control": autocomplete(this);
                    break;
            }
            setFocusCurrentInput();
        })
    }

    var art = `
    ────────────────────────────────────────
    ──────────────────────▒████▒────────────
    ───────────────────░█████▓███░──────────
    ─────────────────░███▒░░░░░░██──────────
    ────────────────▒██▒░░░▒▓▓▓▒░██─────────
    ───────────────▓██░░░▒▓█▒▒▒▓▒▓█─────────
    ──────────────▓█▓─░▒▒▓█─────▓▓█░────────
    ─────────────▓█▒░▒▒▒▒█──▓▓▒▒─▓█▒────────
    ────────────▒█▒░▒▒▒▒▓▒─▒▓▒▓▓─▒█░────────
    ────────────█▓░▒▒▒▒▒▓░─▓▒──░░▒█░────────
    ───────────██░▒▒▒▒▒▒█──▓──░▓████████────
    ──────────░█▒▒▒▒▒▒▒▒▓░─█▓███▓▓▓▓██─█▓───
    ────────▒▓█▓▒▒▒▒▒▒▒▒▓███▓▓████▓▓██──█───
    ──────░███▓▒▒▒▒▓▒▒▒████▒▒░░──████░──██░─
    ──────██▒▒▒▒▒▒▒▒▒▓██▒────────▒██▓────▓█─
    ─────▓█▒▒▒▒▒▒▒▒▓█▓─────▓───▒░░▓──▓────▓█
    ─────██▒▓▒▒▒▒▒█▓──────▒█▓──▓█░▒──▒░────█
    ─────██▒▒▓▓▓▒█▓▓───░──▓██──▓█▓▓▓█▓─────█
    ─────▓█▒██▓▓█▒▒▓█─────░█▓──▒░───░█▓────█
    ─────░██▓───▓▓▒▒▓▓─────░─────────▒▒─░─░█
    ──────▓█──▒░─█▒▓█▓──▒───────░─░───█▒──█▒
    ───────█──░█░░█▓▒──▓██▒░─░─░─░─░░░█▒███─
    ───────█▒──▒▒──────▓██████▓─░░░░─▒██▓░──
    ───────▓█──────────░██▓▓▓██▒─░──░█▒─────
    ────────██▒─────░───░██▓▓▓██▓▒▒▓█▒──────
    ─────────░████▒──░───▒█▓▓▓▓▓████▓───────
    ────────▒▓██▓██▒──░───▓█████▓███────────
    ──────▒██▓░░░░▓█▓░────░█▒█▒─▒▓█▓────────
    ─────▓█▒░░▒▒▒▒▒▓███▓░──▓█▒─▒▓▓█─────────
    ────░█▒░▒████▓██▓▓▓██▒───░▓█▓█░─────────
    ────▓█▒▒█░─▒───▓█▓▓▓▓▓▓▒▒▓█▓█▓──────────
    ────▓█▒█░───────██▓▓▓▓▓█▓▓█▓██──────────
    ────▒█▓▓────────░██▓██▓▓▓▓▓▓▓▓█─────────
    ─────██░────▓▓────█░─█▓▓▓▓▓▓▓─▒█████────
    ─────██░───░──────▓░─▓▓▓▓▓▓▓█─▒█▒░▒██───
    ────▓█░▓░──▓▓────▒█░─█▓▓▓▓▓▓▓█▒─░░░▒██──
    ────█─▒██─░──────████▓▓▓▓▓▓▓█▓─░▒▒█▓▓█░─
    ───▓█─▓▒▓▒░░────▓█▓▓▓▓▓▓▓▓▓▓█░░▒▓█░──▒█─
    ───▒█░█▒▒█▒───░▓█▓▓▓▓▓▓▓▓▓▓█▓░▒▓▓──▓█▓█─
    ───█▓▒▓▒▒▓██████▓▓▓▓▓▓▓▓▓▓▓█▒▒▓▓─░█▓▒▒█░
    ───█░▓▓▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█▒▒▓─▒█▒▒▒▒█─
    ──▒█─█▒▒▒▓█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▓─▒█▒▒▒▒██─
    ──▓█─█▒▒▒▒█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█▒▓▒░█▒▒▒░▓█──
    ──▓█─█▒▓▒▒▓█▓▓▓▓▓▓▓▓▓▓▓▓▓█▓▒▓░▓░░░░▒█░──
    ──▒█─▓▓▓▓▒▓█▓▓▓▓▓▓▓▓█████▓▓▓▓▒▓░░─▒█▒───
    ───█▒▓▓▓▓▓▒▓██████████░░██▓█─▒█▓▒▓█░────
    ───▓█▒█▓▓▓▓▒▓██░─░▒░─────██▒░▓▓▓▒██─────
    ────████▓▓▓██░───────────▓█░▓▒░░▓█░─────
    ──────░█████░─────────────██▓─▒██░──────
    ───────────────────────────▓███▒────────`

    var art1 = ` 
    ##      ##  ########  ########      ########   ########    #######    ######    ########      ###     ##     ##  ##     ##  ####  ##    ##   ######        
    ##  ##  ##  ##        ##     ##     ##     ##  ##     ##  ##     ##  ##    ##   ##     ##    ## ##    ###   ###  ###   ###   ##   ###   ##  ##    ##           
    ##  ##  ##  ##        ##     ##     ##     ##  ##     ##  ##     ##  ##         ##     ##   ##   ##   #### ####  #### ####   ##   ####  ##  ##              
    ##  ##  ##  ######    ########      ########   ########   ##     ##  ##   ####  ########   ##     ##  ## ### ##  ## ### ##   ##   ## ## ##  ##   ####      
    ##  ##  ##  ##        ##     ##     ##         ##   ##    ##     ##  ##    ##   ##   ##    #########  ##  #  ##  ##  #  ##   ##   ##  ####  ##    ##       
    ##  ##  ##  ##        ##     ##     ##         ##    ##   ##     ##  ##    ##   ##    ##   ##     ##  ##     ##  ##     ##   ##   ##   ###  ##    ##       
     ###  ###   ########  ########      ##         ##     ##   #######    ######    ##     ##  ##     ##  ##     ##  ##     ##  ####  ##    ##   ######        
    `
 }
    