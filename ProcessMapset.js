function _onEdit(e) {
    let row = e.range.getRow()

    switch (e.range.getColumn()) {
        case SheetRows.MAP_ID: { // Map ID update, populate or remove any info needed there
            if (row <= 3) {
                break // Avoid accidental overwrites of info at the top
            }
        
            let mapID = e.value
            let mapper = e.source.getRange(`C${row}`)
            let song = e.source.getRange(`D${row}`)
            let date = e.source.getRange(`E${row}`)
            let allInfoRows = e.source.getRange(`C${row}:I${row}`)
        
            if (mapID == null) {
                allInfoRows.clear()
                Logger.log(`Cleared row ${row}`)
                break
            } else {
                let response = getMapset(mapID)
        
                mapper.setValue(response.creator)
                song.setFormula(`=HYPERLINK("https://osu.ppy.sh/beatmapsets/${mapID}", "${response.artist} - ${response.title}")`)
                date.setValue(Utilities.formatDate(new Date(), "GMT-6", "MM/dd/y"))
        
                let allRows = e.source.getRange(`A${row}:K${row}`)
                allRows.setHorizontalAlignment('center')
                allRows.setVerticalAlignment('middle')
        
                Logger.log(`Successfully updated row ${row}: ${response.artist} - ${response.title} by ${response.creator}, mapset ID ${mapID}`)
                break
            }
        }
        case SheetRows.NOM_DATE: { // Add hint color to indicate unclean rank if needed
            let note = e.range.getNote()
            e.range.setBackground(((note && !note.includes('nohighlight')) ? 'lightsalmon' : null))
            break
        }
        case SheetRows.STATUS: { // Status update, check if it's been nominated
            if (e.value === 'Nominated') {
                let nomDate = e.source.getRange(`F${row}`)
                nomDate.setValue(Utilities.formatDate(new Date(), "GMT-6", "MM/dd/y"))
            }
            break
        }
        default: {
            break
        }
    }
}