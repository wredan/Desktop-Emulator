var appInstances = {}
var appList = [
    "bash",
    "fileManager"
]

var windowLayout = (id, iconId, title, content, fileIconName) => {
    return `
    <div id="` + id + `" class="window window-open" data-iconid="` + iconId + `" style="display: none" tabindex="-1">
        <div class="window-bar">
            <div class="icon-image"><img src="assets/image/icon/${fileIconName}" alt="File Manager" width="17px"></div>
            <div class="window-title base-text">` + title + `</div>
            <div class="action-bar">               
                <div class="minimize"><svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 0 22 22" width="22"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19h12v2H6z"/></svg></div>
                <div class="maximize"><svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="-2 0 26 20" width="22"><path d="M0 0h24v24H0z" fill="none"/><path d="M18 4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H6V6h12v12z"/></svg></div>
                <div class="close"><svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 0 22 22" width="22"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg></div>                
            </div> 
        </div>  
        <div class="window-container">
        ` + content() + `
        </div>                                
    </div>   
`;
}

var bash = () => {
    return `<div class="bash-container" class="scroller">
                <div class="common-text" style="padding: 0px 0px;">
                    <p>Linux Trollerbian 1.0 #1294 SMP Thu Jan 30 13:21:14 GMT 2020</p> 

                    <p>The programs included with the Debian GNU/Linux system are free software;
                    The exact distribution terms for each program are described in the
                    individual files in /usr/share/doc/*/copyright.</p>
                    <p>Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
                        permitted by applicable law.</p>                                           
                </div>
                <div class="row command-row">
                    <div class="command-col col-md-12">
                        <div class="sign-container"><span class="username">` + username + `@trollerbian</span><span class="colon">:</span><span class="path">~ </span><span class="dollar"> $</span></div>                    
                        <div class="input-container"><input class="custom-command-input" name="command" type="text" value="" autofocus></div>                   
                    </div>
                </div>
            </div>`
}

var commandRow = (value = "") => {
    return `<div class="row command-row">
                    <div class="command-col col-md-12">
                        <div class="sign-container"><span class="username">` + username + `@trollerbian</span><span class="colon">:</span><span class="path">~ </span><span class="dollar"> $</span></div>                    
                        <div class="input-container"><input class="custom-command-input" name="command" type="text" value="` + value + `"></div>                   
                    </div>
                </div>`;
}

var fileManager  = () => {
    return `<div class="file-manager-container" tabindex="-1">
                <div class="row navigation-area">
                    <div class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                        <button type="button" class="back-path-button"><svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg></button>
                    </div>
                    <div class="col-xs-9 col-sm-9 col-md-9 col-lg-9">
                        <input type="text" name="path" class="file-manager-path" value="Path: /" placeholder="path" />
                    </div>
                    <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2">
                        <input type="text" name="searching-input" class="file-manager-search" value="" placeholder="Cerca"/>
                    </div>
                </div>
                <div class="file-area">
                    <div class="file-table">                                       
                    </div>
                </div>
                <div class="upload-area">
                    <div class="upload-form">                    
                            <form class="upload-file-form">
                                <input name="uploadedFile" type="file" />
                                <button type="submit" >Upload</button>
                                <button class="refresh-file" type="button" >Refresh</button>
                            </form>                                                      
                    </div>                       
                    <div class="progress-bar-container">
                        <div class="progress-bar">
                            <div class="progress"></div>
                        </div>
                    </div>                                          
                </div>               
            </div>`
}

var desktopIcons = {
    bash: () => {
        return `
                <div class="base-text" data-app="bash">
                    <div>
                        <img src="assets/image/icon/terminal.webp" alt="Terminale" width="50px">
                    </div>
                    <div>
                        Terminale
                    </div>
                </div>
        `;
    },
    fileManager: () => {
        return `
                <div class="base-text" data-app="filemanager">
                    <div>
                        <img src="assets/image/icon/closed-folder.webp" alt="File Manager" width="50px">
                    </div>
                    <div>
                        File Manager
                    </div>
                </div>
        `;
    }
}

var menuOptions = {
    bash: () => {
        return `
                <div class="row menu-option" data-option="bash">
                    <div class="col-xs-8 col-sm-8 col-md-8">Terminale</div>
                    <div class="col-xs-4 col-sm-4 col-md-4"><img src="assets/image/icon/terminal.webp" alt="Terminale" width="30px"></div>
                </div>  
        `;
    },
    fileManager: () => {
        return `
                <div class="row menu-option" data-option="filemanager">
                    <div class="col-xs-8 col-sm-8 col-md-8">File Manager</div>
                    <div class="col-xs-4 col-sm-4 col-md-4"><img src="assets/image/icon/closed-folder.webp" alt="File Manager" width="30px"></div>
                </div>  
        `;
    }
}