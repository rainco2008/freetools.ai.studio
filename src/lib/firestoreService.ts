import { db } from "./firebase";
import { collection, doc, setDoc, getDocs, deleteDoc, query, orderBy, serverTimestamp } from "firebase/firestore";
import { SavedReport } from "../types";

/**
 * Save a research report to Firestore for a specific user
 */
export async function saveReportToFirestore(userId: string, report: SavedReport): Promise<void> {
  try {
    const reportRef = doc(db, "users", userId, "reports", report.id);
    await setDoc(reportRef, {
      ...report,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.error("Error saving report to Firestore:", error);
    throw error;
  }
}

/**
 * Fetch all research reports for a specific user from Firestore
 */
export async function fetchUserReportsFromFirestore(userId: string): Promise<SavedReport[]> {
  try {
    const reportsCollection = collection(db, "users", userId, "reports");
    const q = query(reportsCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    
    const reports: SavedReport[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      reports.push({
        id: data.id || docSnap.id,
        query: data.query || "",
        reportType: data.reportType || "brief",
        languageStyle: data.languageStyle || "objective",
        createdAt: data.createdAt || new Date().toISOString(),
        report: data.report,
        groundingSources: data.groundingSources || [],
      });
    });

    return reports;
  } catch (error) {
    console.error("Error fetching user reports from Firestore:", error);
    return [];
  }
}

/**
 * Delete a research report from Firestore
 */
export async function deleteReportFromFirestore(userId: string, reportId: string): Promise<void> {
  try {
    const reportRef = doc(db, "users", userId, "reports", reportId);
    await deleteDoc(reportRef);
  } catch (error) {
    console.error("Error deleting report from Firestore:", error);
    throw error;
  }
}

/**
 * Sync local storage reports to Firestore upon initial sign-in
 */
export async function syncLocalReportsToFirestore(userId: string, localReports: SavedReport[]): Promise<SavedReport[]> {
  if (!localReports.length) {
    return await fetchUserReportsFromFirestore(userId);
  }

  try {
    // 1. Fetch remote reports
    const remoteReports = await fetchUserReportsFromFirestore(userId);
    const remoteIds = new Set(remoteReports.map(r => r.id));

    // 2. Upload any local reports that are not yet in remote
    const uploadPromises = localReports
      .filter(r => !remoteIds.has(r.id))
      .map(r => saveReportToFirestore(userId, r));

    await Promise.all(uploadPromises);

    // 3. Return merged reports (refetched or combined)
    const updatedRemote = await fetchUserReportsFromFirestore(userId);
    return updatedRemote;
  } catch (error) {
    console.error("Error syncing local reports to Firestore:", error);
    return localReports;
  }
}
