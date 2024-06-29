# `nom-sheet`

Apps Script code used for my [osu! nomination log](https://docs.google.com/spreadsheets/d/1GzLMP8L4y2NFRIb_OEuWW43DOA5X304z-H-qSK4I_zA/edit).

Published for learning purposes, don't expect it to be a drop-in script.

OAuth credentials are stored in `Settings.js` (local) / `Settings.gs` (remote). It uses the following format:
```js
const settings = {
    "CLIENT_ID": 0,
    "CLIENT_SECRET": "aBCdefgHIjklmNoPqrstuVwxyz"
}

## License
MIT