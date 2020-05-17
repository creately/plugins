

export class Track {

    public constructor( source: any ) {
        if( !source ) {
            throw Error('Invalid source');
        }
        
        this._source = source;
        this._id = source.track.id;
    }
    
    
    public get isVideo() {
        return this._source.getType() === 'video';
    }


    private _id: string;
    public get id(): string {
        return this._id;
    }

    private _source: any; 
    public get source(): any {
        return this._source;
    }
    public set source(value: any) {
        this._source = value;
    }
}