import React, { useState, useEffect } from "react";
import { jitsiConfig } from "./jitsiConfig";
import { JitsiConnection } from "./services/JitsiConnection";
import JConference from "./components/JConference";
import JitsiMeetJS from "../../libs/lib-jitsi-meet.min.js";
import $ from "jquery";


//expose jquery to the global scope
//as needed by jitsi
Object.assign(global, {
  $: $
});

/**
 * Main component of the app
 * Holds the conference component
 */
const App: React.FC = () => {

  const [connection, setConnection] = useState<JitsiConnection>( JitsiConnection.getInstance(jitsiConfig));

  /**
   * component mount/unmount
   */
  useEffect(() => {
    JitsiConnection.getInstance(jitsiConfig);
  });


  return (
    <React.Fragment>
      <JConference connection={connection} />
    </React.Fragment>
  );
};

export default App;
