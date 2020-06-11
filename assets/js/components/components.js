var appInstances = {}
appInstances.terminali = [];
appInstances.filemanager = [];
appInstances.paint = [];

var appList = [
    "bash",
    "fileManager",
    "paint"
]

var windowLayout = (id, iconId, title, content, fileIconName) => {
    return `
    <div id="${id}" class="window window-open" data-iconid="${iconId}" style="display: none" tabindex="-1">
        <div class="window-bar">
            <div class="icon-image"><img src="assets/image/icon/${fileIconName}" alt="File Manager" width="17px"></div>
            <div class="window-title base-text">${title}</div>
            <div class="action-bar">               
                <div class="minimize"><svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 0 22 22" width="22"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19h12v2H6z"/></svg></div>
                <div class="maximize"><svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="-2 0 26 20" width="22"><path d="M0 0h24v24H0z" fill="none"/><path d="M18 4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H6V6h12v12z"/></svg></div>
                <div class="close"><svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 0 22 22" width="22"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg></div>                
            </div> 
        </div>  
        <div class="window-container">
        ${content(id)}
        </div>                                
    </div>   
`;
}

var bash = (appId) => {
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
                        <div class="sign-container"><span class="username">${username}@trollerbian</span><span class="colon">:</span><span class="path">~ </span><span class="dollar"> $</span></div>                    
                        <div class="input-container"><input class="custom-command-input" name="command" type="text" value="" autofocus></div>                   
                    </div>
                </div>
            </div>`
}

var commandRow = (value = "") => {
    return `<div class="row command-row">
                    <div class="command-col col-md-12">
                        <div class="sign-container"><span class="username">${username}@trollerbian</span><span class="colon">:</span><span class="path">~ </span><span class="dollar"> $</span></div>                    
                        <div class="input-container"><input class="custom-command-input" name="command" type="text" value="${value}"></div>                   
                    </div>
                </div>`;
}

var fileManager  = (appId) => {
    return `<div class="file-manager-container" tabindex="-1">
                <div class="row navigation-area">
                    <div class="col-xs-1 col-sm-1 col-md-1 col-lg-1">
                        <button type="button" class="back-path-button btn"><svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg></button>
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
                    <div class="progress-bar-container">
                        <div class="progress-bar">
                            <div class="progress"></div>
                        </div>
                    </div> 
                </div>
                <div class="upload-area">
                    <div class="upload-form">                    
                        <label for="upload-input-${appId}" class="btn">Upload</label>
                        <input id="upload-input-${appId}" class="upload-input hidden" name="uploadedFile" type="file" />
                        <button class="refresh-file btn" type="button" >Aggiorna</button>
                    </div>                                                                                    
                </div>                
            </div>             
            </div>`
}

var paint  = (appId) => {
    return `<div class="paint-container">
                <div class="tools-panel">
                    <div>
                        <table>
                            <tr>
                                <td><button type="button" class="tool-btn" data-type="pencil"><img src="assets/image/icon/paint/pencil.webp" width="18px"/></button></td>
                                <td><button type="button" class="tool-btn" data-type="eraser"><img src="assets/image/icon/paint/rubber.webp" width="18px"/></button></td>                               
                            </tr>                              
                            <tr>
                                <td><button type="button" class="tool-btn" data-type="brush"><img src="assets/image/icon/paint/brush.webp" width="18px"/></button></td>
                            </tr>
                        </table>
                    </div>
                    <hr />
                    <div>
                        <table>
                            <tr>
                                <td>
                                    <button type="button" class="tool-btn-lg tool-btn" data-type="fill">Riempi</button>
                                </td>                            
                            </tr>
                            <tr>
                                <td>
                                    <button type="button" class="tool-btn-lg tool-btn" data-type="clear">Pulisci</button>
                                </td>                            
                            </tr>
                            <tr>
                                <td>
                                    <select class="select-tool-btn tool-btn-lg">
                                        <option value="1" selected="selected">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="5">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                        <option value="9">9</option>
                                        <option value="10">10</option>
                                        <option value="12">12</option>
                                        <option value="14">14</option>
                                        <option value="18">18</option>
                                        <option value="22">22</option>
                                        <option value="28">28</option>
                                        <option value="36">36</option>
                                        <option value="45">45</option>
                                        <option value="64">64</option>
                                        <option value="75">75</option>
                                    </select>
                                </td>
                            </tr> 
                        </table>
                    </div>
                    <hr />
                    <div>                       
                        <table>
                            <tr>
                                <td colspan="2"><button type="button" class="color-selected black"></td>                                                       
                            </tr> 
                            <tr>
                                <td><button type="button" class="color-btn white" data-color="white"></button></td>
                                <td><button type="button" class="color-btn black" data-color="black"></button></td>                            
                            </tr>  
                            <tr>
                                <td><button type="button" class="color-btn gray" data-color="gray"></button></td>
                                <td><button type="button" class="color-btn red" data-color="red"></button></td>                            
                            </tr>   
                            <tr>
                                <td><button type="button" class="color-btn yellow" data-color="yellow"></button></td>
                                <td><button type="button" class="color-btn green" data-color="green"></button></td>                            
                            </tr>              
                            <tr>
                                <td><button type="button" class="color-btn blue" data-color="blue"></button></td>
                                <td><button type="button" class="color-btn purple" data-color="purple"></button></td>
                            </tr>
                            <tr>
                                <td><button type="button" class="color-btn orange" data-color="orange"></button></td>
                                <td><button type="button" class="color-btn brown" data-color="brown"></button></td>
                            </tr>
                            <tr>
                                <td colspan="2"><button type="button" class="tool-btn-lg tool-btn" data-type="save">Salva</button></td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div class="canvas-container">
                    <div class="canvas-box">
                        <canvas id="canvas-${appId}" class="canvas cursor-pencil">

                        </canvas>
                    </div>
                </div>
            </div>`;
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
                    <div>File Manager</div>
                </div>
        `;
    },
    paint: () => {
        return `
                <div class="base-text" data-app="paint">
                    <div>
                        <img src="assets/image/icon/paint/pencil_icon.webp" alt="Paint" width="50px">
                    </div>
                    <div>
                       Paint
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
    },
    paint: () => {
        return `
                <div class="row menu-option" data-option="paint">
                    <div class="col-xs-8 col-sm-8 col-md-8">Paint</div>
                    <div class="col-xs-4 col-sm-4 col-md-4"><img src="assets/image/icon/paint/pencil_icon.webp" alt="Paint" width="30px"></div>
                </div>  
        `;
    }
}