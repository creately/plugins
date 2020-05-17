import { Participant } from "../models/Participant";
import React, { useState, useEffect, Ref, useRef, useLayoutEffect } from "react";
import { Subscription } from "rxjs";



/**
 * Component for each visible participant in the call.
 * @param param0 
 */
export const ParticipantView: React.FC<{ participant: Participant}> = ({participant}) => {

    /**
     * these are the refs to the dom node so we can attach the
     * video/audio tracks to it when rendered. 
     */
    const videoRef: any = useRef();
    const audioRef: any = useRef();

    let videoSub:Subscription, audioSub: Subscription;

    useEffect( () => {
        
        audioSub = participant.audioTrack$.subscribe( audioTrack => {
            if( audioTrack ){
                audioTrack.source.attach(audioRef.current);
            }
        })

        videoSub = participant.videoTrack$.subscribe( videoTrack => {
            if( videoTrack ){
                videoTrack.source.attach(videoRef.current);
            }
        })

        return () => {
            audioSub.unsubscribe();
            videoSub.unsubscribe();
        }

    });

    

    return(
        <div>
            <h1>Particpiant - {participant.id}</h1>
            <video id={participant.id+'-video'} autoPlay='1' ref={videoRef}/>
            <audio id={participant.id+'-video'} autoPlay='1' ref={audioRef}/>     
        </div>
    )

}
