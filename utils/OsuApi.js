function convertToSeconds_(ms) {
    return Math.floor(ms / 1000)
}

function getOauthToken_() {
    const props = PropertiesService.getUserProperties()
    let secondsUntilExp = props.getProperty('OAUTH_TOKEN_EXPIRATION') - convertToSeconds_(Date.now())
    
    if (props.getProperty('OAUTH_TOKEN') !== null && ((props.getProperty('OAUTH_TOKEN_EXPIRATION') && secondsUntilExp >= 600))) {
        Logger.log(`OAuth token valid for ${secondsUntilExp}s`)
    } else {
        Logger.log('OAuth token is close to expiring/has expired, renewing')
        let tokenRequest = UrlFetchApp.fetch('https://osu.ppy.sh/oauth/token', {
            'headers': {
                'Accept': 'application/json'
            },
            'method': 'post',
            'payload': `client_id=${settings.CLIENT_ID}&client_secret=${settings.CLIENT_SECRET}&grant_type=client_credentials&scope=public`
        })
    
        let tokenResponse = JSON.parse(tokenRequest.getContentText())
    
        props.setProperty('OAUTH_TOKEN', tokenResponse.access_token)
        props.setProperty('OAUTH_TOKEN_EXPIRATION', (convertToSeconds_(Date.now()) + tokenResponse.expires_in))
        Logger.log('Renewed OAuth token')
    }

    return props.getProperty('OAUTH_TOKEN')
}

function fetchWithAuth_(endpoint) {
    let map = UrlFetchApp.fetch(`https://osu.ppy.sh/api/v2/${endpoint}`, {
        'headers': {
            'Authorization': 'Bearer ' + getOauthToken_(),
            'Accept': 'application/json'
        }
    })

    return JSON.parse(map.getContentText())
}

function getMapset(id) {
    return fetchWithAuth_(`beatmapsets/${id}`)
}