function onOpen() {
    SpreadsheetApp.getUi().createMenu("👁️ Maintenance")
        .addItem("Refresh Map Metadata", "refreshSelectedSet")
        .addToUi()
}

function refreshSelectedSet() {
    let sheet = SpreadsheetApp.getActiveSpreadsheet()
    let cell = SpreadsheetApp.getCurrentCell()

    Logger.log(`Update requested for row ${cell.getRow()}`)

    if (cell.getRow() > 3) {
        let mapID = sheet.getRange(`A${cell.getRow()}`).getValue()
        let mapAuthor = sheet.getRange(`C${cell.getRow()}`)
        let mapsetCell = sheet.getRange(`D${cell.getRow()}`)
        let mapInfo = getMapset(mapID)

        mapsetCell.setFormula(`=HYPERLINK("https://osu.ppy.sh/beatmapsets/${mapID}", "${mapInfo.artist} - ${mapInfo.title}")`)
        mapAuthor.setValue(mapInfo.creator)

        return sheet.toast(`Updated row ${cell.getRow()}`)
    } else {
        return sheet.toast('No map selected')
    }
}