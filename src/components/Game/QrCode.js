import { useEffect } from 'react';
import QRCode from 'qrcode';

function QrCode({id}) {
    useEffect(() => {
        showQR();
    }, []);

    function showQR() {
        const url = `${window.location.origin}/game/${id}`;
        const canvas = document.querySelector('canvas');
        QRCode.toCanvas(canvas, url, (error) => {
          if (error) console.error(error);
        });
      }

    return <canvas id="canvas" width="200" height="200" />
}

export default QrCode;