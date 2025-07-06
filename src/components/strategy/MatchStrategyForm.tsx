import React, {useState} from 'react';
import {Save, Play, Clock, Flag, Shield, Target, Sparkles, Loader2, AlertCircle} from 'lucide-react';
import {aiService} from '../../services/aiService';
import {strategyService, MatchStrategy} from '../../services/strategyService';
import {marked} from 'marked';

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
    aiInsights?: string;
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
    aiInsights: '',
};

interface MatchStrategyFormProps {
    onStrategySaved?: (strategy: MatchStrategy) => void;
    initialStrategy?: MatchStrategy;
}

const MatchStrategyForm: React.FC<MatchStrategyFormProps> = ({
                                                                 onStrategySaved,
                                                                 initialStrategy
                                                             }) => {
    const [formData, setFormData] = useState<FormData>(
        initialStrategy ? {
            matchNumber: initialStrategy.matchNumber,
            matchType: initialStrategy.matchType,
            allianceColor: initialStrategy.allianceColor,
            allianceTeams: initialStrategy.allianceTeams,
            opponentTeams: initialStrategy.opponentTeams,
            gameplan: initialStrategy.gameplan,
            autoStrategy: initialStrategy.autoStrategy,
            teleopStrategy: initialStrategy.teleopStrategy,
            endgameStrategy: initialStrategy.endgameStrategy,
            defensiveStrategy: initialStrategy.defensiveStrategy,
            backupPlans: initialStrategy.backupPlans,
            notes: initialStrategy.notes,
            aiInsights: initialStrategy.aiInsights || '',
        } : initialFormData
    );

    const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isGeneratingBriefing, setIsGeneratingBriefing] = useState(false);
    const [savedStrategyId, setSavedStrategyId] = useState<string | null>(
        initialStrategy?.id || null
    );
    const [aiError, setAiError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleTeamChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: 'allianceTeams' | 'opponentTeams') => {
        const {value} = e.target;
        const newTeams = [...formData[field]];
        newTeams[index] = value;
        setFormData({
            ...formData,
            [field]: newTeams,
        });
    };

    const handleGenerateInsights = async () => {
        setIsGeneratingInsights(true);
        setAiError(null);

        try {
            const insights = await aiService.generateStrategyInsights({
                matchNumber: formData.matchNumber,
                allianceTeams: formData.allianceTeams,
                opponentTeams: formData.opponentTeams,
                allianceColor: formData.allianceColor,
                matchType: formData.matchType,
            });

            setFormData(prev => ({
                ...prev,
                aiInsights: insights,
            }));
        } catch (error) {
            console.error('Error generating insights:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            setAiError(errorMessage);
        } finally {
            setIsGeneratingInsights(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            if (savedStrategyId) {
                // Update existing strategy
                await strategyService.updateStrategy(savedStrategyId, formData);
                alert('Strategy updated successfully!');
            } else {
                // Save new strategy
                const strategyId = await strategyService.saveStrategy(formData);
                setSavedStrategyId(strategyId);
                alert('Strategy saved successfully!');
            }

            // Get the saved strategy and call the callback
            if (onStrategySaved && savedStrategyId) {
                const savedStrategy = await strategyService.getStrategy(savedStrategyId);
                if (savedStrategy) {
                    onStrategySaved(savedStrategy);
                }
            }
        } catch (error) {
            console.error('Error saving strategy:', error);
            alert('Failed to save strategy. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleGenerateBriefing = async () => {
        setIsGeneratingBriefing(true);
        setAiError(null);

        try {
            const briefing = await aiService.generateMatchBriefing(formData);

            // Create a new window/tab with the briefing
            const briefingWindow = window.open('', '_blank');
            if (briefingWindow) {
                briefingWindow.document.write(`
          <html>
            <head>
              <title>Match ${formData.matchNumber} Briefing</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  max-width: 800px; 
                  margin: 0 auto; 
                  padding: 20px; 
                  line-height: 1.6;
                }
                h1, h2 { color: #012265; }
                .match-info { 
                  background: #f5f5f5; 
                  padding: 15px; 
                  border-radius: 8px; 
                  margin-bottom: 20px; 
                }
                .briefing-content { 
                  white-space: pre-wrap; 
                  background: white; 
                  padding: 20px; 
                  border: 1px solid #ddd; 
                  border-radius: 8px; 
                }
                @media print {
                  body { margin: 0; padding: 15px; }
                }
              </style>
            </head>
            <body>
              <h1>Match ${formData.matchNumber} Drive Team Briefing</h1>
              <div class="match-info">
                <strong>Match Type:</strong> ${formData.matchType}<br>
                <strong>Alliance:</strong> ${formData.allianceColor.toUpperCase()}<br>
                <strong>Teams:</strong> ${formData.allianceTeams.join(' | ')}<br>
                <strong>Opponents:</strong> ${formData.opponentTeams.join(' | ')}
              </div>
              <div class="briefing-content">${briefing}</div>
              <script>window.print();</script>
            </body>
          </html>
        `);
                briefingWindow.document.close();
            }
        } catch (error) {
            console.error('Error generating briefing:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            setAiError(errorMessage);
        } finally {
            setIsGeneratingBriefing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Match Information */}
            <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Clock size={18} className="mr-2 text-neutral-500"/>
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
                            required
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
                        <Shield size={18} className="mr-2 text-primary-500"/>
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
                                    required
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                    <h3 className="text-md font-semibold mb-4 flex items-center">
                        <Target size={18} className="mr-2 text-error"/>
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
                                    required
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* AI Insights */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center">
                        <Sparkles size={18} className="mr-2 text-purple-500"/>
                        AI Strategy Insights
                    </h3>
                    <button
                        type="button"
                        onClick={handleGenerateInsights}
                        disabled={isGeneratingInsights}
                        className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 flex items-center"
                    >
                        {isGeneratingInsights ? (
                            <Loader2 size={16} className="mr-2 animate-spin"/>
                        ) : (
                            <Sparkles size={16} className="mr-2"/>
                        )}
                        {isGeneratingInsights ? 'Generating...' : 'Generate AI Insights'}
                    </button>
                </div>

                {aiError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                        <AlertCircle size={16} className="text-red-500 mr-2 mt-0.5 flex-shrink-0"/>
                        <div className="text-red-700 text-sm">
                            <strong>AI Service Error:</strong> {aiError}
                            <br/>
                            <span className="text-red-600">You can still create strategies manually using the form below.</span>
                        </div>
                    </div>
                )}

                {formData.aiInsights && (
                    <div className="bg-white p-3 rounded-md border border-purple-100">
                        <div
                            className="markdown-content"
                            dangerouslySetInnerHTML={{__html: marked(formData.aiInsights)}}
                        />
                    </div>
                )}

                {!formData.aiInsights && !isGeneratingInsights && !aiError && (
                    <div className="text-center py-4 text-neutral-500">
                        Click "Generate AI Insights" to get strategic recommendations based on your match setup.
                    </div>
                )}
            </div>

            {/* Strategy */}
            <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Flag size={18} className="mr-2 text-secondary-500"/>
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
                    onClick={handleGenerateBriefing}
                    disabled={isGeneratingBriefing}
                    className="px-4 py-2 flex items-center justify-center border border-neutral-300 rounded-md text-neutral-700 bg-white hover:bg-neutral-50 disabled:opacity-50"
                >
                    {isGeneratingBriefing ? (
                        <Loader2 size={16} className="mr-2 animate-spin"/>
                    ) : (
                        <Play size={16} className="mr-2"/>
                    )}
                    {isGeneratingBriefing ? 'Generating...' : 'Generate Briefing'}
                </button>
                <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50 flex items-center justify-center"
                >
                    {isSaving ? (
                        <Loader2 size={16} className="mr-2 animate-spin"/>
                    ) : (
                        <Save size={16} className="mr-2"/>
                    )}
                    {isSaving ? 'Saving...' : savedStrategyId ? 'Update Strategy' : 'Save Strategy'}
                </button>
            </div>
        </form>
    );
};

export default MatchStrategyForm;