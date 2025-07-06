// src/types/firebase.d.ts
declare module 'firebase/firestore';
declare module '../firebase/firebase';

// src/services/strategyService.ts
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export interface MatchStrategy {
  id?: string;
  matchNumber: string;
  matchType: string;
  allianceColor: string;
  allianceTeams: string[];
  opponentTeams: string[];
  gameplan: string;
  autoStrategy: string;
  teleopStrategy: string;
  endgameStrategy: string;
  defensiveStrategy: string;
  backupPlans: string;
  notes: string;
  aiInsights?: string;
  createdAt: number;
  updatedAt: number;
}

class StrategyService {
  private collectionName = 'matchStrategies';

  async saveStrategy(strategy: Omit<MatchStrategy, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const strategyId = `match-${strategy.matchNumber}-${Date.now()}`;
      const now = Date.now();

      const strategyData: MatchStrategy = {
        ...strategy,
        id: strategyId,
        createdAt: now,
        updatedAt: now,
      };

      await setDoc(doc(db, this.collectionName, strategyId), strategyData);
      return strategyId;
    } catch (error) {
      console.error('Error saving strategy:', error);
      throw new Error('Failed to save strategy');
    }
  }

  async updateStrategy(strategyId: string, updates: Partial<MatchStrategy>): Promise<void> {
    try {
      const strategyRef = doc(db, this.collectionName, strategyId);
      await setDoc(strategyRef, {
        ...updates,
        updatedAt: Date.now(),
      }, { merge: true });
    } catch (error) {
      console.error('Error updating strategy:', error);
      throw new Error('Failed to update strategy');
    }
  }

  async getStrategy(strategyId: string): Promise<MatchStrategy | null> {
    try {
      const strategyDoc = await getDoc(doc(db, this.collectionName, strategyId));
      if (strategyDoc.exists()) {
        return strategyDoc.data() as MatchStrategy;
      }
      return null;
    } catch (error) {
      console.error('Error getting strategy:', error);
      throw new Error('Failed to get strategy');
    }
  }

  async getStrategiesByMatch(matchNumber: string): Promise<MatchStrategy[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('matchNumber', '==', matchNumber),
        orderBy('updatedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc: QueryDocumentSnapshot<MatchStrategy>) => doc.data() as MatchStrategy);
    } catch (error) {
      console.error('Error getting strategies by match:', error);
      throw new Error('Failed to get strategies');
    }
  }

  async getAllStrategies(): Promise<MatchStrategy[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('matchNumber', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc: QueryDocumentSnapshot<MatchStrategy>) => doc.data() as MatchStrategy);
    } catch (error) {
      console.error('Error getting all strategies:', error);
      throw new Error('Failed to get strategies');
    }
  }
}

export const strategyService = new StrategyService();