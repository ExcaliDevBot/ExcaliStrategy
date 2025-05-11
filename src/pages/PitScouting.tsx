import React from 'react';
import { Plus } from 'lucide-react';
import TeamCard from '../components/scouting/TeamCard';

// This would typically come from Firebase
const mockTeams = [
  {
    teamNumber: 254,
    teamName: 'The Cheesy Poofs',
    robotName: 'Deadlift',
    drivetrainType: 'Swerve',
    canClimb: true,
    autoCapabilities: ['Leave Starting Zone', 'Auto Scoring', 'Path Planning'],
    notes: 'Multiple world champions. Impressive autonomous routines and extremely reliable scoring.',
    imageUrl: 'https://images.pexels.com/photos/4439465/pexels-photo-4439465.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    teamNumber: 1114,
    teamName: 'Simbotics',
    robotName: 'Simbot Evolution',
    drivetrainType: 'Tank Drive',
    canClimb: true,
    autoCapabilities: ['Leave Starting Zone', 'Auto Scoring'],
    notes: 'Consistent high performer with robust mechanisms and effective autonomous modes.',
    imageUrl: 'https://images.pexels.com/photos/8566474/pexels-photo-8566474.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    teamNumber: 118,
    teamName: 'Robonauts',
    robotName: 'Eaglebot',
    drivetrainType: 'Mecanum',
    canClimb: true,
    autoCapabilities: ['Leave Starting Zone', 'Auto Scoring', 'Multiple Paths'],
    notes: 'Innovative design approaches with excellent driving skill and field awareness.',
    imageUrl: 'https://images.pexels.com/photos/9020147/pexels-photo-9020147.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    teamNumber: 2056,
    teamName: 'OP Robotics',
    robotName: 'Thunderbot',
    drivetrainType: 'Swerve',
    canClimb: true,
    autoCapabilities: ['Leave Starting Zone', 'Complex Auto Paths'],
    notes: 'Exceptional engineering and build quality. Very strategic approach to matches.',
    imageUrl: 'https://images.pexels.com/photos/3473998/pexels-photo-3473998.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    teamNumber: 1678,
    teamName: 'Citrus Circuits',
    robotName: 'Zest',
    drivetrainType: 'Swerve',
    canClimb: true,
    autoCapabilities: ['Leave Starting Zone', 'Auto Scoring', 'Vision Tracking'],
    notes: 'Strong in all aspects of the game. Well-balanced robot with excellent autonomous capabilities.',
    imageUrl: 'https://images.pexels.com/photos/3024330/pexels-photo-3024330.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    teamNumber: 3310,
    teamName: 'Black Hawk Robotics',
    robotName: 'Talon',
    drivetrainType: 'Swerve',
    canClimb: true,
    autoCapabilities: ['Leave Starting Zone', 'Auto Scoring'],
    notes: 'Highly adaptable and reliable mechanisms. Great driving team.',
    imageUrl: 'https://images.pexels.com/photos/11056542/pexels-photo-11056542.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
];

const PitScouting: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Pit Scouting</h1>
          <p className="text-neutral-500">Collect data about teams and their robots</p>
        </div>
        <button className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 flex items-center">
          <Plus size={16} className="mr-2" />
          New Team
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTeams.map((team) => (
          <TeamCard key={team.teamNumber} team={team} />
        ))}
      </div>
    </div>
  );
};

export default PitScouting;