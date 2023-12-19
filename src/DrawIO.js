import React, {useEffect, useRef, useState} from 'react';
import axios from "axios";
import {getDomain} from "./utils/getDomain";

function DrawIO() {
    const iframeRef = useRef(null);
    const [data, setData] = useState("");

    useEffect(() => {
        const getFile = async () => {
            try {
                // const response = await axios.get(`${getDomain()}file`);
                // setData(response.data);
            } catch (error) {
                try {
                    alert(error.response.data);
                } catch (e) {
                    alert(error);
                }
            }
        };

        const handleMessage = (event) => {
            if (event.data === 'ready' && iframeRef.current) {
                iframeRef.current.contentWindow.postMessage(JSON.stringify({ action: 'load', xmlpng: data }), '*');
            }
        };

        getFile().then();
        window.addEventListener('message', handleMessage);
        return () => {
            window.removeEventListener('message', handleMessage);
        };
        // eslint-disable-next-line
    }, []);

    return (
        <iframe
            ref={iframeRef}
            width="100%"
            height="800px"
            src="https://embed.diagrams.net/?embed=1&spin=1"
            style={{ border: 'none' }}
            title={'draw.io'}
        />
    );
}

export default DrawIO;
