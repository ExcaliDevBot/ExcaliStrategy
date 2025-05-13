import { getDatabase, ref, get, set } from '../../src/firebase/firebase';

export const calculateAndStoreAverages = async (teamId: number): Promise<void> => {
  try {
    const db = getDatabase();
    const scoutingDataRef = ref(db, 'scoutingData');
    const snapshot = await get(scoutingDataRef);

    if (!snapshot.exists()) {
      console.error('No scouting data found.');
      return;
    }

    const scoutingData = snapshot.val();
    const valuesToCompute = ['autoL1', 'autoL2', 'autoL3', 'autoL4', 'L1', 'L2', 'L3', 'L4', 'autoRemoveAlgae', 'defensivePins', 'netScore', 'processorScore', 'removeAlgae'];
    const totals: Record<string, number> = {};
    const counts: Record<string, number> = {};
    let deepClimbCount = 0;
    let totalMatches = 0;

    // Initialize totals and counts
    valuesToCompute.forEach((key) => {
      totals[key] = 0;
      counts[key] = 0;
    });

    // Iterate through all matches
    Object.keys(scoutingData).forEach((matchKey) => {
      if (matchKey.includes(`T${teamId}`)) {
        const matchData = scoutingData[matchKey];
        totalMatches++;

        // Count deep climbs
        if (matchData.climbOption === 'DEEP') {
          deepClimbCount++;
        }

        valuesToCompute.forEach((key) => {
          if (matchData[key] !== undefined && typeof matchData[key] === 'number') {
            totals[key] += matchData[key];
            counts[key]++;
          }
        });
      }
    });

    // Calculate averages and store in Firebase
    const teamAverageRef = ref(db, `processedData/${teamId}`);
    const averages: Record<string, number> = {};

    valuesToCompute.forEach((key) => {
      if (counts[key] > 0) {
        averages[key] = totals[key] / counts[key];
      } else {
        console.warn(`No matches found for team ${teamId} with ${key} data.`);
        averages[key] = 0; // Default to 0 if no data is found
      }
    });

    // Calculate climb rate
    const climbRate = totalMatches > 0 ? (deepClimbCount / totalMatches) * 100 : 0;
    averages['climbRate'] = climbRate;

    await set(teamAverageRef, averages);

    console.log(`Averages and climb rate for team ${teamId} successfully calculated and stored:`, averages);
  } catch (error) {
    console.error('Error calculating and storing averages and climb rate:', error);
  }
};