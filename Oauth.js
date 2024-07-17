function getOauthToken() {
    const props = PropertiesService.getUserProperties()
    let secondsUntilExp = props.getProperty('OAUTH_TOKEN_EXPIRATION') - convertToSeconds(Date.now())
    
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
        props.setProperty('OAUTH_TOKEN_EXPIRATION', (convertToSeconds(Date.now()) + tokenResponse.expires_in))
        Logger.log('Renewed OAuth token')
    }

    return props.getProperty('OAUTH_TOKEN')
}