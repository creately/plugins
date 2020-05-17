import JitsiMeetJS from "../../libs/lib-jitsi-meet.min.js";
import { Participant } from "../models/Participant";
import { Track } from "../models/Track";
import { BehaviorSubject } from 'rxjs';

export class JitsiConnection {

    private roomName = 'cfxone123';
    private options: ConfigOptions;
    private _connection: any;
    private _room: any;
    private _participants: { [key: string] : Participant} = {};
    private _currentUser: Participant  = new Participant('local');

    private isJoined: boolean = false;
    
    public _participants$: BehaviorSubject<{ [key: string] : Participant}>;



    public constructor( options: ConfigOptions ) {
        this.options = options;
        this.initJitsi();
        this.startConference();

        //start observables        
        this._participants$ = new BehaviorSubject(this.participants);

    }


    static _instance: JitsiConnection;
    static getInstance( options:ConfigOptions ) {
        if(!this._instance) {
            this._instance = new JitsiConnection(options);
        }

        return this._instance;
    }

    async initJitsi(){
        await JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
    }


    public get connection():any {
        return this._connection;
    }

    /**
     * Start the conference with the initial participant
     * @param options 
     */
    public async startConference( ) {
        await this.createConnection();
    }

    /**
     * Creates the connection
     * @param options 
     */
    protected async createConnection (): Promise<any> {
        
        await JitsiMeetJS.init( this.options.initVals);

        this._connection = new JitsiMeetJS.JitsiConnection(null, null, this.options.connection)
        
        this._connection.addEventListener(
            JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
            this.onConnectionSuccess);
        this._connection.addEventListener(
            JitsiMeetJS.events.connection.CONNECTION_FAILED,
            this.onConnectionFailed);
        this._connection.addEventListener(
            JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
            this.onConnectionDisconnect);

        return this._connection.connect();
    }

    /**
     * Create the room. This is the actual initiation of the conference.
     * 
     */
    protected async createRoom() {
        this._room = await this._connection.initJitsiConference(this.roomName, this.options.conference);
        
        this._room.on(JitsiMeetJS.events.conference.TRACK_ADDED, this.onRemoteTrackAdd);

        this._room.on(JitsiMeetJS.events.conference.TRACK_REMOVED, this.onRemoteTrackRemove);

        this._room.on(JitsiMeetJS.events.conference.CONFERENCE_JOINED, this.onConferenceJoined);

        this._room.on(JitsiMeetJS.events.conference.USER_JOINED, this.userJoined);

        this._room.on(JitsiMeetJS.events.conference.USER_LEFT, this.userLeft);

        this._room.on(JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED, track => {
            console.log(`${track.getType()} - ${track.isMuted()}`);
        });

        this._room.on(
            JitsiMeetJS.events.conference.DISPLAY_NAME_CHANGED,
            (userID: string, displayName: string) => {
                return console.log(`${userID} - ${displayName}`);
            });

        this._room.on(
            JitsiMeetJS.events.conference.TRACK_AUDIO_LEVEL_CHANGED,
            (userID, audioLevel) => console.log(`${userID} - ${audioLevel}`));

        this._room.setDisplayName('CJ Desktop')

        return this._room.join();

    }


    private onConnectionSuccess = async (event: any): void => {
        console.log('Connection Success');        
        this.createRoom();
    }


    private onConnectionFailed = async (event: any): void => {
        console.log('Connection failed');        
    }



    private onConnectionDisconnect = async (event: any): void => {
        console.log('Connection disconnected');        
    }


    private onConferenceJoined = (event:any): void => {
        console.log('Conference joined', event);
        this.isJoined = true;
        this.onLocalTracks();
    }


    private onLocalTracks = async () => {

        const local:Array<any> = await JitsiMeetJS.createLocalTracks({ devices: ['audio', 'video'] });
        local.forEach( track => {
            this._currentUser?.addTrack( new Track( track ));
            this._room.addTrack( track );
        })
    }

    onRemoteTrackAdd = ( track:any ): void => {        
        console.log('*** Got remote track', track);
        if (track.isLocal()) {
            console.log('its local');
            return;
        }

        const participantId = track.getParticipantId();
        if ( !this._participants[participantId]) {
            this._participants[participantId] = new Participant( participantId );
        }
        
        const trackObj = new Track( track );

        this._participants[participantId].addTrack( trackObj );
    }

    onRemoteTrackRemove = ( track:any ): void => {        
        console.log('*** remove remote track', track);

        const participant = this._participants[track.getParticipantId()]
        if ( participant ){
            participant.removeTrack( track.track.id );
        }
    }


    userJoined = ( id:string ) => {
        console.log("user joined", id);        
        if ( !this._participants[id] ) {
            this._participants[id] = new Participant( id );
            this._participants$.next(this._participants);
            
        }
    }

    userLeft  = ( id:string ) => {
        console.log("user left", id);
        delete this._participants[id];
        this._participants$.next(this._participants);
    }
    
    disconnect = () => {
        console.log('disconnect');
        if ( this.currentUser?.videoTrack ) {
            this.currentUser?.videoTrack.source.dispose();
            this._room.removeTrack( this.currentUser?.videoTrack.source );
        }
        if ( this.currentUser?.audioTrack ) {
            this.currentUser?.audioTrack.source.dispose();
            this._room.removeTrack( this.currentUser?.audioTrack.source );
        }
        this._room?.leave();
        this._connection?.disconnect();
    }


    get participants() : { [key: string] : Participant} {
        return this._participants;
    }

    get currentUser(): Participant | undefined {
        return this._currentUser;
    }

}