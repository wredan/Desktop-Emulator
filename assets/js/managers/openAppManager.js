/* ********** OPEN APPS ********** */

function openBash() {
    let i = 0;
    while ($.inArray(++i, appInstances.terminali) != -1);
    appInstances.terminali.push(i);
    $('#application-bar').append(`
            <div id="icona-bash-` + i + `" data-id="` + i + `" class="application-bar-icon base-text open"><div><img src="assets/image/icon/terminal.webp" alt="Terminale" width="24px"><br><span>` + i + `</span></div></div>
        `);

    let terminalId = '#bash-' + i;
    $('.main-container').append(windowLayout('bash-' + i, "icona-bash-" + i, 'bash-' + i, bash));
    openWindowAnimation(terminalId)
    setIconAndWindowEvent(terminalId);
    setActionBarEvent(terminalId);
    windowDragAndDorp(terminalId);
    initBash(terminalId);
}

function openFileUploader() {
    let i = 0;
    while ($.inArray(++i, appInstances.fileuploader) != -1);
    appInstances.fileuploader.push(i);
    $('#application-bar').append(`
            <div id="icona-fileuploader-` + i + `" data-id="` + i + `" class="application-bar-icon base-text open"><div><img src="assets/image/icon/fileloader.webp" alt="Carica File" width="24px"><br><span>` + i + `</span></div></div>
        `);

    let file = '#fileuploader-' + i;
    $('.main-container').append(windowLayout('fileuploader-' + i, "icona-fileuploader-" + i, 'fileuploader-' + i, fileUploader));
    openWindowAnimation(file)
    setIconAndWindowEvent(file);
    setActionBarEvent(file);
    windowDragAndDorp(file);
    initFileUploader(file)
}

function selectAppIstance(selector) {
    switch (selector) {
        case "bash": openBash();
            break;
        case "fileuploader": openFileUploader();
            break;
        default:
            break;
    }
}