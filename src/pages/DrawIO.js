import React, { useEffect, useRef, useState } from 'react'

function DrawIO() {
  const iframeRef = useRef(null)
  const [data, setData] = useState("")

  useEffect(() => {
    const getFile = async () => {
      try {
        // const response = await axios.get(`${getDomain()}file`)
        // setData(response.data)
      } catch (error) {
        try {
          alert(error.response.data)
        } catch (e) {
          alert(error)
        }
      }
    }

    const handleMessage = (event) => {
      if (event.data === 'ready' && iframeRef.current) {
        iframeRef.current.contentWindow.postMessage(JSON.stringify({ action: 'load', xmlpng: data }), '*')
      }
    }

    getFile().then()
    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  return (
    <iframe
      ref={iframeRef}
      height="100%"
      borderRadius="5px"
      src="https://embed.diagrams.net/?embed=1&spin=1"
      style={{ border: 'none' }}
      title={'draw.io'}
    />
  )
}

export default DrawIO
