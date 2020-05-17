import { Track } from "./Track";
import { BehaviorSubject } from 'rxjs';

export class Participant{

    private _id: string;
    private _tracks: { [key: string]: Track} = {};
    
    private _videoTrack: Track | undefined;
    private _audioTrack: Track | undefined;
    private _videoTrack$: BehaviorSubject<Track | undefined>;
    private _audioTrack$: BehaviorSubject<Track | undefined>;

    public constructor ( id: string ){
        this._id = id;
        this._videoTrack$ = new BehaviorSubject(this.videoTrack);
        this._audioTrack$ = new BehaviorSubject(this.audioTrack);
    }
 
 
    public get id(): string {
        return this._id;
    }
 
    public addTrack( track: Track ): void{
        console.log('ADD TRACK', track)
        if ( !track ) {
            return;
        }
        
        this._tracks[track.id] = track;

        if (track.isVideo ) {
            this.videoTrack = track;
        } else {
            this.audioTrack = track;
        }
    }

    public removeTrack( trackId:string ): void {
        const tmpTrack = this._tracks[trackId];
        if ( !tmpTrack )
            return;
        
            delete this._tracks[trackId];
        if ( tmpTrack.isVideo  ) {
            if ( this.videoTrack && this.videoTrack.id === trackId ) {
                this.videoTrack = undefined;
            }            
        }else {
            if ( this.audioTrack && this.audioTrack.id === trackId ) {
                this.audioTrack = undefined;
            }            
        }
    }


    protected get videoTrack(): Track | undefined {
        return this._videoTrack;
    }
    protected set videoTrack(value: Track | undefined) {
        this._videoTrack = value;
        this._videoTrack$.next(this._videoTrack);
    }

    protected get audioTrack(): Track | undefined {
        return this._audioTrack;
    }
    protected set audioTrack(value: Track | undefined) {
        this._audioTrack = value;
        this._audioTrack$.next(this._audioTrack);
    }
    
    public get videoTrack$(): BehaviorSubject<Track | undefined> {
        return this._videoTrack$;
    }
    
    
    public get audioTrack$(): BehaviorSubject<Track | undefined> {
        return this._audioTrack$;
    }


    private _displayName: string = "Guest User";
    public get displayName(): string {
        return this._displayName;
    }
    public set displayName(value: string) {
        this._displayName = value;
    }
    
    private _isMuted: boolean = false;
    public get isMuted(): boolean {
        return this._isMuted;
    }
    public set isMuted(value: boolean) {
        this._isMuted = value;
    }
    
    private _isDominantSpeaker: boolean = false;;
    public get isDominantSpeaker(): boolean {
        return this._isDominantSpeaker;
    }
    public set isDominantSpeaker(value: boolean) {
        this._isDominantSpeaker = value;
    }

}
