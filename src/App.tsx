import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MatchScouting from './pages/MatchScouting';
import PitScouting from './pages/PitScouting';
import TeamAnalysis from './pages/TeamAnalysis';
import AllianceSelection from './pages/AllianceSelection';
import MatchStrategy from './pages/MatchStrategy';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import AllianceComparator from './pages/AllianceComparator';
import SuperScoutingResults from './pages/SuperScoutingResults';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="match-scouting" element={<MatchScouting />} />
          <Route path="pit-scouting" element={<PitScouting />} />
          <Route path="team-analysis" element={<TeamAnalysis />} />
          <Route path="alliance-selection" element={<AllianceSelection />} />
          <Route path="match-strategy" element={<MatchStrategy />} />
          <Route path="settings" element={<Settings />} />
          <Route path="alliance-comparator" element={<AllianceComparator />} />
          <Route path="super-scouting-results" element={<SuperScoutingResults />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;