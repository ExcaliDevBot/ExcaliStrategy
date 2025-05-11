import React, { useState } from 'react';
import { SaveIcon } from 'lucide-react';

interface FormData {
  matchNumber: string;
  teamNumber: string;
  alliance: 'red' | 'blue';
  scoutName: string;
  
  // Auto period
  autoLeaveStartingZone: boolean;
  autoGamePieceScored: string;
  autoHighGoals: string;
  autoLowGoals: string;
  
  // Teleop period
  teleopGamePieceScored: string;
  teleopHighGoals: string;
  teleopLowGoals: string;
  
  // Endgame
  endgameClimb: boolean;
  climbLevel: string;
  defenseRating: string;
  
  // General
  robotBroke: boolean;
  notes: string;
}

const initialFormData: FormData = {
  matchNumber: '',
  teamNumber: '',
  alliance: 'red',
  scoutName: '',
  
  autoLeaveStartingZone: false,
  autoGamePieceScored: '0',
  autoHighGoals: '0',
  autoLowGoals: '0',
  
  teleopGamePieceScored: '0',
  teleopHighGoals: '0',
  teleopLowGoals: '0',
  
  endgameClimb: false,
  climbLevel: '0',
  defenseRating: '0',
  
  robotBroke: false,
  notes: '',
};

const ScoutingForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    // Here you would typically save this to Firebase
    alert('Data submitted successfully!');
    setFormData(initialFormData);
  };

  const handleReset = () => {
    setFormData(initialFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
      {/* Match Information */}
      <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
        <h3 className="text-lg font-semibold mb-4">Match Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Match Number
            </label>
            <input
              type="number"
              name="matchNumber"
              value={formData.matchNumber}
              onChange={handleInputChange}
              className="w-full p-2 border border-neutral-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Team Number
            </label>
            <input
              type="number"
              name="teamNumber"
              value={formData.teamNumber}
              onChange={handleInputChange}
              className="w-full p-2 border border-neutral-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Alliance
            </label>
            <select
              name="alliance"
              value={formData.alliance}
              onChange={handleInputChange}
              className="w-full p-2 border border-neutral-300 rounded-md bg-white"
              required
            >
              <option value="red">Red</option>
              <option value="blue">Blue</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Scout Name
            </label>
            <input
              type="text"
              name="scoutName"
              value={formData.scoutName}
              onChange={handleInputChange}
              className="w-full p-2 border border-neutral-300 rounded-md"
              required
            />
          </div>
        </div>
      </div>

      {/* Autonomous Period */}
      <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
        <h3 className="text-lg font-semibold mb-4">Autonomous Period</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoLeaveStartingZone"
              name="autoLeaveStartingZone"
              checked={formData.autoLeaveStartingZone}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-primary-600 border-neutral-300 rounded"
            />
            <label htmlFor="autoLeaveStartingZone" className="ml-2 text-sm text-neutral-700">
              Left Starting Zone
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Game Pieces Scored
            </label>
            <input
              type="number"
              name="autoGamePieceScored"
              value={formData.autoGamePieceScored}
              onChange={handleInputChange}
              className="w-full p-2 border border-neutral-300 rounded-md"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              High Goals
            </label>
            <input
              type="number"
              name="autoHighGoals"
              value={formData.autoHighGoals}
              onChange={handleInputChange}
              className="w-full p-2 border border-neutral-300 rounded-md"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Low Goals
            </label>
            <input
              type="number"
              name="autoLowGoals"
              value={formData.autoLowGoals}
              onChange={handleInputChange}
              className="w-full p-2 border border-neutral-300 rounded-md"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Teleop Period */}
      <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
        <h3 className="text-lg font-semibold mb-4">Teleoperated Period</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Game Pieces Scored
            </label>
            <input
              type="number"
              name="teleopGamePieceScored"
              value={formData.teleopGamePieceScored}
              onChange={handleInputChange}
              className="w-full p-2 border border-neutral-300 rounded-md"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              High Goals
            </label>
            <input
              type="number"
              name="teleopHighGoals"
              value={formData.teleopHighGoals}
              onChange={handleInputChange}
              className="w-full p-2 border border-neutral-300 rounded-md"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Low Goals
            </label>
            <input
              type="number"
              name="teleopLowGoals"
              value={formData.teleopLowGoals}
              onChange={handleInputChange}
              className="w-full p-2 border border-neutral-300 rounded-md"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Endgame */}
      <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
        <h3 className="text-lg font-semibold mb-4">Endgame</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="endgameClimb"
              name="endgameClimb"
              checked={formData.endgameClimb}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-primary-600 border-neutral-300 rounded"
            />
            <label htmlFor="endgameClimb" className="ml-2 text-sm text-neutral-700">
              Attempted Climb
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Climb Level (0-3)
            </label>
            <select
              name="climbLevel"
              value={formData.climbLevel}
              onChange={handleInputChange}
              className="w-full p-2 border border-neutral-300 rounded-md bg-white"
            >
              <option value="0">0 - Did not climb</option>
              <option value="1">1 - Low rung</option>
              <option value="2">2 - Mid rung</option>
              <option value="3">3 - High rung</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Defense Rating (1-5)
            </label>
            <select
              name="defenseRating"
              value={formData.defenseRating}
              onChange={handleInputChange}
              className="w-full p-2 border border-neutral-300 rounded-md bg-white"
            >
              <option value="0">N/A - No defense played</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Below average</option>
              <option value="3">3 - Average</option>
              <option value="4">4 - Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
        <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="robotBroke"
              name="robotBroke"
              checked={formData.robotBroke}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-primary-600 border-neutral-300 rounded"
            />
            <label htmlFor="robotBroke" className="ml-2 text-sm text-neutral-700">
              Robot broke down during match
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-2 border border-neutral-300 rounded-md"
              placeholder="Additional observations, strengths, weaknesses..."
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col md:flex-row gap-3 justify-end">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 bg-white hover:bg-neutral-50"
        >
          Reset Form
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 flex items-center justify-center"
        >
          <SaveIcon size={16} className="mr-2" />
          Save Scouting Data
        </button>
      </div>
    </form>
  );
};

export default ScoutingForm;