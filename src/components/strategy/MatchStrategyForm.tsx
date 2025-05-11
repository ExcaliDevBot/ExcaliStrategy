import React, { useState } from 'react';
import { Save, Play, Clock, Flag, Shield, Target } from 'lucide-react';

interface FormData {
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
}

const initialFormData: FormData = {
  matchNumber: '24',
  matchType: 'qualification',
  allianceColor: 'red',
  allianceTeams: ['148', '254', '118'],
  opponentTeams: ['1114', '2056', '1678'],
  gameplan: '',
  autoStrategy: '',
  teleopStrategy: '',
  endgameStrategy: '',
  defensiveStrategy: '',
  backupPlans: '',
  notes: '',
};

const MatchStrategyForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTeamChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: 'allianceTeams' | 'opponentTeams') => {
    const { value } = e.target;
    const newTeams = [...formData[field]];
    newTeams[index] = value;
    setFormData({
      ...formData,
      [field]: newTeams,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    // Here you would typically save this to Firebase
    alert('Strategy saved successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Match Information */}
      <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Clock size={18} className="mr-2 text-neutral-500" />
          Match Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Match Number
            </label>
            <input
              type="text"
              name="matchNumber"
              value={formData.matchNumber}
              onChange={handleInputChange}
              className="w-full p-2 border border-neutral-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Match Type
            </label>
            <select
              name="matchType"
              value={formData.matchType}
              onChange={handleInputChange}
              className="w-full p-2 border border-neutral-300 rounded-md bg-white"
            >
              <option value="practice">Practice</option>
              <option value="qualification">Qualification</option>
              <option value="playoff">Playoff</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Alliance Color
            </label>
            <select
              name="allianceColor"
              value={formData.allianceColor}
              onChange={handleInputChange}
              className="w-full p-2 border border-neutral-300 rounded-md bg-white"
            >
              <option value="red">Red</option>
              <option value="blue">Blue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Teams */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
          <h3 className="text-md font-semibold mb-4 flex items-center">
            <Shield size={18} className="mr-2 text-primary-500" />
            Your Alliance
          </h3>
          
          <div className="space-y-3">
            {formData.allianceTeams.map((team, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  {index === 0 
                    ? 'Your Team' 
                    : index === 1 
                      ? 'Alliance Partner 1' 
                      : 'Alliance Partner 2'}
                </label>
                <input
                  type="text"
                  value={team}
                  onChange={(e) => handleTeamChange(e, index, 'allianceTeams')}
                  className={`w-full p-2 border rounded-md ${
                    index === 0 
                      ? 'border-primary-300 bg-primary-50' 
                      : 'border-neutral-300 bg-white'
                  }`}
                  placeholder="Team Number"
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
          <h3 className="text-md font-semibold mb-4 flex items-center">
            <Target size={18} className="mr-2 text-error" />
            Opponent Alliance
          </h3>
          
          <div className="space-y-3">
            {formData.opponentTeams.map((team, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  {`Opponent ${index + 1}`}
                </label>
                <input
                  type="text"
                  value={team}
                  onChange={(e) => handleTeamChange(e, index, 'opponentTeams')}
                  className="w-full p-2 border border-neutral-300 rounded-md bg-white"
                  placeholder="Team Number"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strategy */}
      <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Flag size={18} className="mr-2 text-secondary-500" />
          Match Strategy
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Overall Game Plan
            </label>
            <textarea
              name="gameplan"
              value={formData.gameplan}
              onChange={handleInputChange}
              rows={2}
              className="w-full p-2 border border-neutral-300 rounded-md"
              placeholder="Describe the overall strategy for this match..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Autonomous Strategy
              </label>
              <textarea
                name="autoStrategy"
                value={formData.autoStrategy}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-2 border border-neutral-300 rounded-md"
                placeholder="What should each robot do in autonomous?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Teleop Strategy
              </label>
              <textarea
                name="teleopStrategy"
                value={formData.teleopStrategy}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-2 border border-neutral-300 rounded-md"
                placeholder="What should each robot focus on during teleop?"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Endgame Strategy
              </label>
              <textarea
                name="endgameStrategy"
                value={formData.endgameStrategy}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-2 border border-neutral-300 rounded-md"
                placeholder="What's the plan for the last 30 seconds?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Defensive Strategy
              </label>
              <textarea
                name="defensiveStrategy"
                value={formData.defensiveStrategy}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-2 border border-neutral-300 rounded-md"
                placeholder="How will we play defense? Which opponents to target?"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Backup Plans */}
      <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
        <h3 className="text-lg font-semibold mb-4">Backup Plans</h3>
        <textarea
          name="backupPlans"
          value={formData.backupPlans}
          onChange={handleInputChange}
          rows={3}
          className="w-full p-2 border border-neutral-300 rounded-md"
          placeholder="What if something goes wrong? Alternative strategies..."
        />
      </div>

      {/* Additional Notes */}
      <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
        <h3 className="text-lg font-semibold mb-4">Additional Notes</h3>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          rows={3}
          className="w-full p-2 border border-neutral-300 rounded-md"
          placeholder="Any other important information for this match..."
        />
      </div>

      {/* Form Actions */}
      <div className="flex flex-col md:flex-row gap-3 justify-end">
        <button
          type="button"
          className="px-4 py-2 flex items-center justify-center border border-neutral-300 rounded-md text-neutral-700 bg-white hover:bg-neutral-50"
          onClick={() => {
            alert('This would generate a briefing document for the drive team');
          }}
        >
          <Play size={16} className="mr-2" />
          Generate Briefing
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 flex items-center justify-center"
        >
          <Save size={16} className="mr-2" />
          Save Strategy
        </button>
      </div>
    </form>
  );
};

export default MatchStrategyForm;