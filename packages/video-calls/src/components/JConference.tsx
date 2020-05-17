import React, { useEffect, useState, useLayoutEffect } from 'react';
import { JitsiConnection } from '../services/JitsiConnection';
import { ParticipantView } from './ParticipantView';
import { Subscription, of } from 'rxjs';
import { Participant } from '../models/Participant';


const JConference: React.FC<{ connection: JitsiConnection}> = ({connection}) => {

    const [subs, setSubs] = useState<Array<Subscription>>([]);
    const [ participants, setParticipants ] = useState<{ [key: string] : Participant}>({});
    
    useLayoutEffect(() => {
        const sub = connection._participants$.subscribe( items => {
            console.log('items added ', items);
            setParticipants({...participants, ...items});
        });

        setSubs([...subs, sub]);

    }, [])

    useEffect( () => {
        console.log('useEffect');
        if ( connection ) {
            // connection.startConference();
        }

        //cleanup the conference
        return ( () => { 
            console.log('useEffect - cleanup');
            // connection.disconnect() 
        });
    })


    return (
        <div>
            <button onClick={connection.disconnect}>Disconnect</button>

            <ParticipantView key='local' participant={connection.currentUser}/>
            {Object.keys(participants).map(( key ) => (
                <ParticipantView key={key} participant={participants[key]}/>
            ))}
        </div>        
    )

}

export default JConference;