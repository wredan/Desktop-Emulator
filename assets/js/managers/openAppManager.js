/* ********** OPEN APPS ********** */

function openBash() {
    let i = 0;
    while ($.inArray(++i, appInstances.terminali) != -1);
    appInstances.terminali.push(i);
    $('#application-bar').append(`
            <div id="icona-bash-` + i + `" data-id="` + i + `" class="application-bar-icon base-text open"><div><img src="assets/image/icon/terminal.webp" alt="Terminale" width="24px"><br><span>` + i + `</span></div></div>
        `);

    $('#main-container').append(windowLayout('bash-' + i, "icona-bash-" + i, 'bash-' + i, bash, "terminal.webp"));
    startingApp('#bash-' + i, initBash);
}

function openFileManager() {
    let i = 0;
    while ($.inArray(++i, appInstances.filemanager) != -1);
    appInstances.filemanager.push(i);
    $('#application-bar').append(`
            <div id="icona-filemanager-` + i + `" data-id="` + i + `" class="application-bar-icon base-text open"><div><img src="assets/image/icon/closed-folder.webp" alt="Carica File" width="24px"><br><span>` + i + `</span></div></div>
        `);
    let appId = 'filemanager-' + i;
    $('#main-container').append(windowLayout(appId, "icona-filemanager-" + i, appId, fileManager, "closed-folder.webp"));
    startingApp('#filemanager-' + i, initFileManager);
}

function selectAppIstance(selector) {
    switch (selector) {
        case "bash": openBash();
            break;
        case "filemanager": openFileManager();
            break;
        default:
            break;
    }
}

function startingApp(appId, initApp) {
    openWindowAnimation(appId)
    setIconAndWindowEvent(appId);
    setActionBarEvent(appId);
    windowDragAndDorp(appId);
    initApp(appId);
}