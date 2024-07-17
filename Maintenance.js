function onOpen() {
    createMenu()
}

function createMenu() {
    SpreadsheetApp.getUi().createMenu("👁️ Maintenance")
        .addItem("Refresh Map Metadata", "refreshSelectedSet")
        .addToUi()
}

function refreshSelectedSet() {
    let sheet = SpreadsheetApp.getActiveSpreadsheet()
    let cell = SpreadsheetApp.getCurrentCell()

    Logger.log(`Update requested for column ${cell.getColumn()}, row ${cell.getRow()}`)

    if (cell.getColumn() == 4 && cell.getRow() > 3) {
        let mapID = sheet.getRange(`A${cell.getRow()}`).getValue()
        let mapAuthor = sheet.getRange(`C${cell.getRow()}`)
        let mapInfo = getMapset(mapID)

        cell.setFormula(`=HYPERLINK("https://osu.ppy.sh/beatmapsets/${mapID}", "${mapInfo.artist} - ${mapInfo.title}")`)
        mapAuthor.setValue(mapInfo.creator)

        return sheet.toast(`Updated row ${cell.getRow()}`)
    } else {
        return sheet.toast('No map selected')
    }
}