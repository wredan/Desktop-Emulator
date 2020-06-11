/* ********** OPEN APPS ********** */

function openBash() {
    let i = insertAppIntoArray(appInstances.terminali, "bash", "Terminale", "terminal.webp");

    $('#main-container').append(windowLayout('bash-' + i, "icona-bash-" + i, 'bash-' + i, bash, "terminal.webp"));
    startingApp('#bash-' + i, initBash);
}

function openFileManager() {
    let i = insertAppIntoArray(appInstances.filemanager, "filemanager", "Carica File", "closed-folder.webp");

    let appId = 'filemanager-' + i;
    $('#main-container').append(windowLayout(appId, "icona-filemanager-" + i, appId, fileManager, "closed-folder.webp"));
    startingApp('#filemanager-' + i, initFileManager);
}

function openPaint() {
    let i = insertAppIntoArray(appInstances.paint, "paint", "Paint", "paint/pencil_icon.webp");

    let appId = 'paint-' + i;
    $('#main-container').append(windowLayout(appId, "icona-paint-" + i, appId, paint, "paint/pencil_icon.webp"));
    startingApp('#paint-' + i, initPaint);
}

function selectAppIstance(selector) {
    switch (selector) {
        case "bash": openBash();
            break;
        case "filemanager": openFileManager();
            break;
        case "paint": openPaint();
            break;
        default:
            break;
    }
}

function insertAppIntoArray(array, id, alt, icon){
    let i = 0;
    while ($.inArray(++i, array) != -1);
    array.push(i);
    $('#application-bar').append(`
            <div id="icona-${id}-${i}" data-id="${i}" class="application-bar-icon base-text open"><div><img src="assets/image/icon/${icon}" alt="${alt}" width="24px"><br><span>${i}</span></div></div>
        `);
    return i;
}

function startingApp(appId, initApp) {
    openWindowAnimation(appId)
    setIconAndWindowEvent(appId);
    setActionBarEvent(appId);
    windowDragAndDorp(appId);
    initApp(appId);
}