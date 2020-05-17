import { JitsiMeetJS } from "lib-jitsi-meet";

export class ConferenceModel {
    
    public localTracks: Array<any> = [];
    public remoteTracks: any = {};
    public connection: any = null;
    public isJoined: boolean = false;
    private room: any = null;


    private const options = {
        hosts: {
            domain: 'beta.meet.jit.si',
    
            muc: 'conference.beta.meet.jit.si', // FIXME: use XEP-0030
            focus: 'focus.beta.meet.jit.si',
        },
        bosh:'https://beta.meet.jit.si/http-bind', // FIXME: use xep-0156 for that

        // The name of client node advertised in XEP-0115 'c' stanza
        clientNode: 'http://jitsi.org/jitsimeet'
    };


    private const confOptions = {
        openBridgeChannel: true
    };


    private const initOptions = {
        disableAudioLevels: true,

        // Whether desktop sharing should be disabled on Chrome.
        desktopSharingChromeDisabled: true,

        // Whether desktop sharing should be disabled on Firefox.
        desktopSharingFirefoxDisabled: true
    };


/**
 * Handles local tracks.
 * @param tracks Array with JitsiTrack objects
 */
    private onLocalTracks(tracks) {
        this.localTracks = tracks;
    for (let i = 0; i < this.localTracks.length; i++) {
        this.localTracks[i].addEventListener(
            JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED,
            audioLevel => console.log(`Audio Level local: ${audioLevel}`));
        this.localTracks[i].addEventListener(
            JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
            () => console.log('local track muted'));
        this.localTracks[i].addEventListener(
            JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
            () => console.log('local track stoped'));
        this.localTracks[i].addEventListener(
            JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
            deviceId =>
                console.log(
                    `track audio output device was changed to ${deviceId}`));
        
        
        // if (localTracks[i].getType() === 'video') {
        //     $('body').append(`<div>Booo<video autoplay='1' id='localVideo${i}' /></div>`);
        //     localTracks[i].attach($(`#localVideo${i}`)[0]);
        // } else {
        //     $('body').append(
        //         `<div><audio autoplay='1' muted='true' id='localAudio${i}' /></div>`);
        //     localTracks[i].attach($(`#localAudio${i}`)[0]);
        // }
        if (this.isJoined) {
            this.room.addTrack(this.localTracks[i]);
        }
    }
}    



/**
 * Handles remote tracks
 * @param track JitsiTrack object
 */
private onRemoteTrack(track) {
    if (track.isLocal()) {
        return;
    }
    const participant = track.getParticipantId();

    if (!this.remoteTracks[participant]) {
        this.remoteTracks[participant] = [];
    }
    const idx = this.remoteTracks[participant].push(track);

    track.addEventListener(
        JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED,
        audioLevel => console.log(`Audio Level remote: ${audioLevel}`));
    track.addEventListener(
        JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
        () => console.log('remote track muted'));
    track.addEventListener(
        JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
        () => console.log('remote track stoped'));
    track.addEventListener(JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
        deviceId =>
            console.log(
                `track audio output device was changed to ${deviceId}`));
    
    const id = participant + track.getType() + idx;

    // if (track.getType() === 'video') {
    //     $('body').append(
    //         `<h1>Item</h1><video autoplay='1' id='${participant}video${idx}' />`);
    // } else {
    //     $('body').append(
    //         `<audio autoplay='1' id='${participant}audio${idx}' />`);
    // }
    // track.attach($(`#${id}`)[0]);
}


/**
 * That function is executed when the conference is joined
 */
private onConferenceJoined( room: any) {
    console.log('conference joined!');
    this.isJoined = true;
    for (let i = 0; i < this.localTracks.length; i++) {
        room.addTrack(this.localTracks[i]);
    }
}



/**
 *
 * @param id
 */
private onUserLeft(id) {
    console.log('user left');
    if (!this.remoteTracks[id]) {
        return;
    }
    const tracks = this.remoteTracks[id];

    // for (let i = 0; i < tracks.length; i++) {
    //     tracks[i].detach($(`#${id}${tracks[i].getType()}`));
    // }
}





/**
 * That function is called when connection is established successfully
 */
private onConnectionSuccess( room: any, connection: any, confOptions: any) {
    room = connection.initJitsiConference('cfxone123', confOptions);
    room.on(JitsiMeetJS.events.conference.TRACK_ADDED, this.onRemoteTrack);
    room.on(JitsiMeetJS.events.conference.TRACK_REMOVED, track => {
        console.log(`track removed!!!${track}`);
    });
    room.on(
        JitsiMeetJS.events.conference.CONFERENCE_JOINED,
        this.onConferenceJoined(room));
    room.on(JitsiMeetJS.events.conference.USER_JOINED, id => {
        console.log('user join');
        this.remoteTracks[id] = [];
    });
    room.on(JitsiMeetJS.events.conference.USER_LEFT, this.onUserLeft);
    room.on(JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED, track => {
        console.log(`${track.getType()} - ${track.isMuted()}`);
    });
    room.on(
        JitsiMeetJS.events.conference.DISPLAY_NAME_CHANGED,
        (userID, displayName) => console.log(`${userID} - ${displayName}`));
    room.on(
        JitsiMeetJS.events.conference.TRACK_AUDIO_LEVEL_CHANGED,
        (userID, audioLevel) => console.log(`${userID} - ${audioLevel}`));
    room.on(
        JitsiMeetJS.events.conference.PHONE_NUMBER_CHANGED,
        () => console.log(`${room.getPhoneNumber()} - ${room.getPhonePin()}`));
    room.join();
}



/**
 *
 */
private unload(connection: any, room: any) {
    for (let i = 0; i < localTracks.length; i++) {
        localTracks[i].dispose();
    }
    room.leave();
    connection.disconnect();
}



/**
 * This function is called when the connection fail.
 */
private onConnectionFailed() {
    console.error('Connection Failed!');
}

/**
 * This function is called when the connection fail.
 */
private onDeviceListChanged(devices) {
    console.info('current devices', devices);
}

/**
 * This function is called when we disconnect.
 */
private disconnect( connection: any) {
    console.log('disconnect!');
    connection.removeEventListener(
        JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
        this.onConnectionSuccess);
    connection.removeEventListener(
        JitsiMeetJS.events.connection.CONNECTION_FAILED,
        this.onConnectionFailed);
    connection.removeEventListener(
        JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
        this.disconnect);
}


    public init():void {

        JitsiMeetJS.init(this.initOptions);

        this.connection = new JitsiMeetJS.JitsiConnection(null, null, this.options);
        
        this.connection.addEventListener(
            JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
            this.onConnectionSuccess(this.room, this.connection, this.confOptions));
        this.connection.addEventListener(
            JitsiMeetJS.events.connection.CONNECTION_FAILED,
            this.onConnectionFailed);
        this.connection.addEventListener(
            JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
            this.disconnect);
        
        JitsiMeetJS.mediaDevices.addEventListener(
            JitsiMeetJS.events.mediaDevices.DEVICE_LIST_CHANGED,
            this.onDeviceListChanged);
        
        this.connection.connect();
        
        JitsiMeetJS.createLocalTracks({ devices: [ 'audio', 'video' ] })
            .then(this.onLocalTracks)
            .catch(error => {
                throw error;
            });
        
        // if (JitsiMeetJS.mediaDevices.isDeviceChangeAvailable('output')) {
        //     JitsiMeetJS.mediaDevices.enumerateDevices(devices => {
        //         const audioOutputDevices
        //             = devices.filter(d => d.kind === 'audiooutput');
        
        //         if (audioOutputDevices.length > 1) {
        //             $('#audioOutputSelect').html(
        //                 audioOutputDevices
        //                     .map(
        //                         d =>
        //                             `<option value="${d.deviceId}">${d.label}</option>`)
        //                     .join('\n'));
        
        //             $('#audioOutputSelectWrapper').show();
        //         }
        //     });
        // }
        


    }


}