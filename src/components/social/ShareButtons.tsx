import React, { useState } from 'react';
import {
  Share2,
  MessageCircle,
  Instagram,
  Twitter,
  QrCode as QrCodeIcon,
  Copy,
  Check
} from 'lucide-react';

// Make sure you installed: npm i qrcode.react
import { QRCodeSVG } from 'qrcode.react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ title, url }) => {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareText = `Check out this amazing campaign: ${title}`;
  
  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${url}`)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
    instagram: '#'
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // stable id for QR canvas
  const qrCanvasId = React.useMemo(() => `qr-canvas-${Math.random().toString(36).slice(2, 9)}`, []);

  const downloadQrAsPng = () => {
    // qrcode.react renders a canvas with id we supply via `id` prop
    const canvas = document.getElementById(qrCanvasId) as HTMLCanvasElement | null;
    if (!canvas) return alert('QR canvas not found');
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'campaign-qr.png';
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-3">
        <Share2 className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Share this campaign</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          WhatsApp
        </a>

        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Twitter className="h-4 w-4 mr-2" />
          Twitter
        </a>

        <button
          onClick={() => alert('Instagram sharing opens the Instagram app')}
          className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
        >
          <Instagram className="h-4 w-4 mr-2" />
          Instagram
        </button>

        <button
          onClick={() => setShowQR(!showQR)}
          className="flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          type="button"
        >
          <QrCodeIcon className="h-4 w-4 mr-2" />
          QR Code
        </button>
      </div>

      <button
        onClick={copyToClipboard}
        className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 mr-2 text-green-600" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 mr-2" />
            Copy Link
          </>
        )}
      </button>

      {showQR && (
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg text-center border border-gray-200 dark:border-gray-600">
          {/* renderAs="canvas" so we can download via canvas.toDataURL */}
          <QRCodeSVG id={qrCanvasId} value={url} size={150} className="mx-auto mb-3" />
          <p className="text-sm text-gray-600 dark:text-gray-300">Scan to view campaign</p>
          <div className="mt-3 flex justify-center gap-2">
            <button
              onClick={downloadQrAsPng}
              className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Download QR
            </button>
            <button
              onClick={() => setShowQR(false)}
              className="px-3 py-2 border rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareButtons;
