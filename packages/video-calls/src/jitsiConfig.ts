export const jitsiConfig: ConfigOptions = {
    conference: {
        openBridgeChannel: true
    },

    connection: {
        hosts: {
            domain: 'beta.meet.jit.si',
    
            muc: 'conference.beta.meet.jit.si', // FIXME: use XEP-0030
            focus: 'focus.beta.meet.jit.si',
        },
        bosh:'https://beta.meet.jit.si/http-bind', // FIXME: use xep-0156 for that

        // The name of client node advertised in XEP-0115 'c' stanza
        clientNode: 'http://jitsi.org/jitsimeet'
    },

    initVals: {
        disableAudioLevels: true,

        // The ID of the jidesha extension for Chrome.
        desktopSharingChromeExtId: 'mbocklcggfhnbahlnepmldehdhpjfcjp',
    
        // Whether desktop sharing should be disabled on Chrome.
        desktopSharingChromeDisabled: true,
    
        // The media sources to use when using screen sharing with the Chrome
        // extension.
        desktopSharingChromeSources: [ 'screen', 'window' ],
    
        // Required version of Chrome extension
        desktopSharingChromeMinExtVersion: '0.1',
    
        // Whether desktop sharing should be disabled on Firefox.
        desktopSharingFirefoxDisabled: true
    }

}