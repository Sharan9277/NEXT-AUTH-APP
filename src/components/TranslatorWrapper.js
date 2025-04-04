// components/TranslatorWrapper.js
'use client';
import { useEffect } from 'react';

export default function TranslatorWrapper({ children }) {
  useEffect(() => {
    const lang = localStorage.getItem('language') || 'en';
    if (lang === 'en') return;

    const translateText = async (text) => {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang: lang }),
      });

      const data = await res.json();
      return data.translation || text;
    };

    const translateNode = async (node) => {
      if (
        node.nodeType === 3 && // text node
        node.nodeValue.trim().length > 1
      ) {
        const originalText = node.nodeValue.trim();
        const translated = await translateText(originalText);
        node.nodeValue = translated;
      } else if (node.nodeType === 1) {
        for (let child of node.childNodes) {
          await translateNode(child);
        }
      }
    };

    const translateEverything = async () => {
      await translateNode(document.body);
    };

    translateEverything();

    // Optional: Watch for DOM changes & re-translate new content
    const observer = new MutationObserver(() => {
      translateEverything();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
}
