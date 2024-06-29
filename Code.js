function convertToSeconds(ms) {
  return Math.floor(ms / 1000)
}

function _onEdit(e) {
  switch (e.range.getColumn()) {
    case 1: // Map ID update, populate info there
      var row = e.range.getRow()

      if (row <= 3) {
        break // Avoid accidental overwrites of info at the top
      }

      var mapID = e.value
      var mapper = e.source.getRange(`C${row}`)
      var song = e.source.getRange(`D${row}`)
      var date = e.source.getRange(`E${row}`)
      var allInfoRows = e.source.getRange(`C${row}:I${row}`)

      if (mapID == null) {
        allInfoRows.clear()
        link.clear()
        Logger.log(`Cleared row ${row}`)
        break
      } else {
          var map = UrlFetchApp.fetch(`https://osu.ppy.sh/api/v2/beatmapsets/${mapID}`, {
            'headers': {
              'Authorization': 'Bearer ' + getOauthToken(),
              'Accept': 'application/json'
            }
          })
        
          var response = JSON.parse(map.getContentText())

          mapper.setValue(response.creator)
          song.setFormula(`=HYPERLINK("https://osu.ppy.sh/beatmapsets/${mapID}", "${response.artist} - ${response.title}")`)
          date.setValue(Utilities.formatDate(new Date(), "GMT-6", "MM/dd/y"))

          var allRows = e.source.getRange(`A${row}:K${row}`)
          allRows.setHorizontalAlignment('center')
          allRows.setVerticalAlignment('middle')

          Logger.log(`Successfully updated row ${row}: ${response.artist} - ${response.title} by ${response.creator}, mapset ID ${mapID}`)
          break
      }
    case 8: // Status update, check if it's been nominated
      var row = e.range.getRow()

      if (e.value === 'Nominated') {
        var nomDate = e.source.getRange(`F${row}`)
        nomDate.setValue(Utilities.formatDate(new Date(), "GMT-6", "MM/dd/y"))
      }
      break
    default:
      break
  }
}