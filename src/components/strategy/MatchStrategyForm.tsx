import React, {useState} from 'react';
import {Save, Play, Clock, Shield, Target, Sparkles, Loader2, AlertCircle} from 'lucide-react';
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

const MatchStrategyForm: React.FC<MatchStrategyFormProps> = ({ onStrategySaved, initialStrategy }) => {
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
        <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl mx-auto">
            {/* Match & Alliances - compact */}
            <div className="bg-white p-4 rounded-lg border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold flex items-center text-neutral-800">
                        <Clock size={16} className="mr-2 text-neutral-500" />
                        Match setup
                    </h3>
                    {savedStrategyId && (
                        <span className="text-xs text-neutral-400">Saved</span>
                    )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                        <label className="block mb-1 text-neutral-600">Match #</label>
                        <input
                            type="text"
                            name="matchNumber"
                            value={formData.matchNumber}
                            onChange={handleInputChange}
                            className="w-full px-2 py-1.5 border border-neutral-300 rounded-md text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-neutral-600">Type</label>
                        <select
                            name="matchType"
                            value={formData.matchType}
                            onChange={handleInputChange}
                            className="w-full px-2 py-1.5 border border-neutral-300 rounded-md bg-white text-sm"
                        >
                            <option value="practice">Practice</option>
                            <option value="qualification">Qualification</option>
                            <option value="playoff">Playoff</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1 text-neutral-600">Alliance</label>
                        <select
                            name="allianceColor"
                            value={formData.allianceColor}
                            onChange={handleInputChange}
                            className="w-full px-2 py-1.5 border border-neutral-300 rounded-md bg-white text-sm"
                        >
                            <option value="red">Red</option>
                            <option value="blue">Blue</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1 text-neutral-600">Opp. 1</label>
                        <input
                            type="text"
                            value={formData.opponentTeams[0]}
                            onChange={(e) => handleTeamChange(e, 0, 'opponentTeams')}
                            className="w-full px-2 py-1.5 border border-neutral-300 rounded-md text-sm"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-neutral-600">Opp. 2</label>
                        <input
                            type="text"
                            value={formData.opponentTeams[1]}
                            onChange={(e) => handleTeamChange(e, 1, 'opponentTeams')}
                            className="w-full px-2 py-1.5 border border-neutral-300 rounded-md text-sm"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-neutral-600">Opp. 3</label>
                        <input
                            type="text"
                            value={formData.opponentTeams[2]}
                            onChange={(e) => handleTeamChange(e, 2, 'opponentTeams')}
                            className="w-full px-2 py-1.5 border border-neutral-300 rounded-md text-sm"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-neutral-600">Your team</label>
                        <input
                            type="text"
                            value={formData.allianceTeams[0]}
                            onChange={(e) => handleTeamChange(e, 0, 'allianceTeams')}
                            className="w-full px-2 py-1.5 border border-neutral-300 rounded-md text-sm bg-neutral-50"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-neutral-600">Partners</label>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={formData.allianceTeams[1]}
                                onChange={(e) => handleTeamChange(e, 1, 'allianceTeams')}
                                className="w-1/2 px-2 py-1.5 border border-neutral-300 rounded-md text-sm"
                            />
                            <input
                                type="text"
                                value={formData.allianceTeams[2]}
                                onChange={(e) => handleTeamChange(e, 2, 'allianceTeams')}
                                className="w-1/2 px-2 py-1.5 border border-neutral-300 rounded-md text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Insights - condensed */}
            <div className="bg-white p-4 rounded-lg border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold flex items-center text-neutral-800">
                        <Sparkles size={16} className="mr-2 text-purple-500" />
                        AI notes
                    </h3>
                    <button
                        type="button"
                        onClick={handleGenerateInsights}
                        disabled={isGeneratingInsights}
                        className="px-3 py-1.5 bg-neutral-900 text-white rounded-md hover:bg-black disabled:opacity-50 flex items-center text-xs"
                    >
                        {isGeneratingInsights ? (
                            <Loader2 size={14} className="mr-1 animate-spin" />
                        ) : (
                            <Sparkles size={14} className="mr-1" />
                        )}
                        {isGeneratingInsights ? 'Generating' : 'Suggest plan'}
                    </button>
                </div>

                {aiError && (
                    <div className="flex items-start text-xs text-red-700 bg-red-50 border border-red-200 rounded-md p-2">
                        <AlertCircle size={14} className="mr-2 mt-0.5" />
                        <span>{aiError}</span>
                    </div>
                )}

                {formData.aiInsights && (
                    <div className="border border-neutral-200 rounded-md p-3 text-xs bg-neutral-50 max-h-40 overflow-y-auto">
                        <div
                            className="markdown-content prose prose-xs max-w-none"
                            dangerouslySetInnerHTML={{__html: marked(formData.aiInsights)}}
                        />
                    </div>
                )}

                {!formData.aiInsights && !isGeneratingInsights && !aiError && (
                    <p className="text-xs text-neutral-500">Use AI to quickly draft a match plan, then adjust below.</p>
                )}
            </div>

            {/* Strategy text areas - very compact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg border border-neutral-200">
                        <label className="block text-xs font-medium text-neutral-700 mb-1">Overall plan</label>
                        <textarea
                            name="gameplan"
                            value={formData.gameplan}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-2 py-1.5 border border-neutral-200 rounded-md text-sm"
                        />
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-neutral-200">
                        <label className="block text-xs font-medium text-neutral-700 mb-1">Autonomous</label>
                        <textarea
                            name="autoStrategy"
                            value={formData.autoStrategy}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-2 py-1.5 border border-neutral-200 rounded-md text-sm"
                        />
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg border border-neutral-200">
                        <label className="block text-xs font-medium text-neutral-700 mb-1">Teleop</label>
                        <textarea
                            name="teleopStrategy"
                            value={formData.teleopStrategy}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-2 py-1.5 border border-neutral-200 rounded-md text-sm"
                        />
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-neutral-200">
                        <label className="block text-xs font-medium text-neutral-700 mb-1">Endgame & defense</label>
                        <textarea
                            name="endgameStrategy"
                            value={formData.endgameStrategy}
                            onChange={handleInputChange}
                            rows={2}
                            className="w-full px-2 py-1.5 border border-neutral-200 rounded-md text-sm mb-2"
                        />
                        <textarea
                            name="defensiveStrategy"
                            value={formData.defensiveStrategy}
                            onChange={handleInputChange}
                            rows={2}
                            className="w-full px-2 py-1.5 border border-neutral-200 rounded-md text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Backup & notes in one row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg border border-neutral-200">
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Backup plan</label>
                    <textarea
                        name="backupPlans"
                        value={formData.backupPlans}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-2 py-1.5 border border-neutral-200 rounded-md text-sm"
                    />
                </div>
                <div className="bg-white p-3 rounded-lg border border-neutral-200">
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Notes</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-2 py-1.5 border border-neutral-200 rounded-md text-sm"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-3 justify-end">
                <button
                    type="button"
                    onClick={handleGenerateBriefing}
                    disabled={isGeneratingBriefing}
                    className="px-3 py-1.5 flex items-center justify-center border border-neutral-300 rounded-md text-neutral-700 bg-white hover:bg-neutral-50 disabled:opacity-50 text-sm"
                >
                    {isGeneratingBriefing ? (
                        <Loader2 size={14} className="mr-1 animate-spin" />
                    ) : (
                        <Play size={14} className="mr-1" />
                    )}
                    Briefing
                </button>
                <button
                    type="submit"
                    disabled={isSaving}
                    className="px-3 py-1.5 bg-neutral-900 text-white rounded-md hover:bg-black disabled:opacity-50 flex items-center justify-center text-sm"
                >
                    {isSaving ? (
                        <Loader2 size={14} className="mr-1 animate-spin" />
                    ) : (
                        <Save size={14} className="mr-1" />
                    )}
                    {isSaving ? 'Saving' : savedStrategyId ? 'Update' : 'Save'}
                </button>
            </div>
        </form>
    );
};

export default MatchStrategyForm;

