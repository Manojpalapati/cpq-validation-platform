import { useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

/**
 * Smart Data Comparator Page
 * Integrates the cloned comparator tool for CPQ validation
 * 
 * This loads the standalone comparator.html from the public folder
 * The comparator tool allows comparing Form Data with Sainpase/CPQ Data
 */
export default function Comparator() {
  useEffect(() => {
    // Listen for messages from iframe (when order is saved)
    const handleMessage = async (event) => {
      if (event.data && event.data.type === 'ORDER_SAVED') {
        try {
          const { orderId, data } = event.data;
          
          // Sync to Firebase only if db is properly initialized
          if (db) {
            try {
              await setDoc(doc(db, 'orders', orderId), {
                orderNumber: orderId,
                sainpaseValidationDone: true,
                cpqValidationStatus: 'PENDING',
                status: 'SAINPASE_DONE',
                createdAt: new Date().toISOString(),
                sets: data.sets || [],
                orderId: data.orderId,
                timestamp: data.timestamp
              }, { merge: true });
              console.log('✅ Synced order to Firebase:', orderId);
            } catch (firebaseError) {
              // Check if it's a configuration error
              if (firebaseError.message && 
                  (firebaseError.message.includes('Invalid segment') || 
                   firebaseError.message.includes('projectId'))) {
                console.warn('⚠️ Firebase not properly configured. Order saved to localStorage only.');
                console.warn('💡 To enable Firebase sync, create a .env file in frontend-react/ with your Firebase config.');
              } else {
                console.error('❌ Failed to sync order to Firebase:', firebaseError);
              }
            }
          } else {
            console.log('ℹ️ Firebase not configured. Order saved to localStorage only.');
            console.log('💡 This is OK - orders are still saved and can be found via "Find Order" in Dashboard.');
          }
        } catch (error) {
          console.error('Error handling order save message:', error);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div className="comparator-container">
      <iframe
        src="/comparator/comparator.html"
        title="Smart Data Comparator"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block'
        }}
      />
    </div>
  );
}
