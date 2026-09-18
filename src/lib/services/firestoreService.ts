import { firestore } from '@/lib/firebase/config';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  setDoc,
} from 'firebase/firestore';
import { Applicant, ApplicationStatus } from '@/types';
import { dbService } from './db';

export const firestoreService = {
  /**
   * Fetch applicant record from Firestore by Application ID or Email.
   * Fallback to local dbService if Firestore is offline or empty.
   */
  async getApplicant(idOrEmail: string): Promise<Applicant | null> {
    const cleanQuery = idOrEmail.trim();
    if (!cleanQuery) return null;

    console.log('[RESULT] Fetching applicant from Firestore/DB for:', cleanQuery);

    try {
      if (firestore) {
        // 1. Try querying by applicationId
        const appsRef = collection(firestore, 'applicants');
        const qId = query(appsRef, where('applicationId', '==', cleanQuery));
        const snapId = await getDocs(qId);

        if (!snapId.empty) {
          const docData = snapId.docs[0].data() as Applicant;
          console.log('[RESULT] Firestore result received from applicationId query');
          console.log('[RESULT] Selection status:', docData.status || (docData as any).selectionStatus);
          return {
            ...docData,
            id: snapId.docs[0].id,
            status: docData.status || (docData as any).selectionStatus || 'SUBMITTED',
          };
        }

        // 2. Try querying by email
        const qEmail = query(appsRef, where('email', '==', cleanQuery.toLowerCase()));
        const snapEmail = await getDocs(qEmail);

        if (!snapEmail.empty) {
          const docData = snapEmail.docs[0].data() as Applicant;
          console.log('[RESULT] Firestore result received from email query');
          console.log('[RESULT] Selection status:', docData.status || (docData as any).selectionStatus);
          return {
            ...docData,
            id: snapEmail.docs[0].id,
            status: docData.status || (docData as any).selectionStatus || 'SUBMITTED',
          };
        }
      }
    } catch (err) {
      console.warn('[RESULT] Firestore fetch warning, falling back to dbService:', err);
    }

    // Fallback to dbService
    const dbApp =
      dbService.getApplicantById(cleanQuery) ||
      dbService.getApplicants().find((a) => a.email.toLowerCase() === cleanQuery.toLowerCase());

    if (dbApp) {
      console.log('[RESULT] Local DB result received');
      console.log('[RESULT] Selection status:', dbApp.status);
      return dbApp;
    }

    console.log('[RESULT] No candidate found for query:', cleanQuery);
    return null;
  },

  /**
   * Update selectionCelebrationShown in Firestore and local dbService
   */
  async markCelebrationShown(applicantId: string): Promise<void> {
    console.log('[RESULT] Updating selectionCelebrationShown: true for:', applicantId);
    dbService.markSelectionCelebrationShown(applicantId);

    try {
      if (firestore) {
        const appRef = doc(firestore, 'applicants', applicantId);
        await updateDoc(appRef, {
          selectionCelebrationShown: true,
          updatedAt: new Date().toISOString(),
        }).catch(async () => {
          // If doc ID is different from applicationId, find doc by applicationId
          const appsRef = collection(firestore, 'applicants');
          const qId = query(appsRef, where('applicationId', '==', applicantId));
          const snap = await getDocs(qId);
          if (!snap.empty) {
            await updateDoc(doc(firestore, 'applicants', snap.docs[0].id), {
              selectionCelebrationShown: true,
              updatedAt: new Date().toISOString(),
            });
          }
        });
      }
    } catch (err) {
      console.warn('[RESULT] Failed updating celebration flag in Firestore:', err);
    }
  },

  /**
   * Admin Reset Celebration Flag for testing
   */
  async resetCelebrationShown(applicantId: string): Promise<void> {
    console.log('[RESULT] Admin resetting selectionCelebrationShown: false for:', applicantId);

    // Update in local DB
    dbService.resetSelectionCelebrationShown(applicantId);

    try {
      if (firestore) {
        const appRef = doc(firestore, 'applicants', applicantId);
        await updateDoc(appRef, {
          selectionCelebrationShown: false,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn('[RESULT] Failed resetting celebration flag in Firestore:', err);
    }
  },
};
