import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { LanguageProvider } from '@/lib/i18n';

// Pages
import Landing from './pages/Landing';
import OnboardingName from './pages/onboarding/OnboardingName';
import OnboardingLocation from './pages/onboarding/OnboardingLocation';
import OnboardingSituation from './pages/onboarding/OnboardingSituation';
import OnboardingTimeline from './pages/onboarding/OnboardingTimeline';
import OnboardingHours from './pages/onboarding/OnboardingHours';
import OnboardingCategories from './pages/onboarding/OnboardingCategories';
import CategoryHome from './pages/onboarding/CategoryHome';
import CategoryTransition from './pages/onboarding/CategoryTransition';
import CategoryFood from './pages/onboarding/CategoryFood';
import CategoryKnowledge from './pages/onboarding/CategoryKnowledge';
import CategoryCreative from './pages/onboarding/CategoryCreative';
import CategoryNetwork from './pages/onboarding/CategoryNetwork';
import CategoryHandsOn from './pages/onboarding/CategoryHandsOn';
import CategoryOnline from './pages/onboarding/CategoryOnline';
import ExtraSkills from './pages/onboarding/ExtraSkills';
import WorkDone from './pages/onboarding/WorkDone';
import Processing from './pages/onboarding/Processing';
import DiscoveryScore from './pages/onboarding/DiscoveryScore';
import ResultsAnnounce from './pages/onboarding/ResultsAnnounce';
import Results from './pages/Results';
import ExploreOption from './pages/ExploreOption';
import TimeToPick from './pages/TimeToPick';
import Confetti from './pages/Confetti';
import GreatChoice from './pages/GreatChoice';
import ActionPlan from './pages/ActionPlan';
import Dashboard from './pages/Dashboard';
import MyPaths from './pages/MyPaths';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Settings from './pages/Settings';
import WeeklyReview from './pages/WeeklyReview';
import TaskCoach from './pages/TaskCoach';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#5BC8C8] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError?.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<Terms />} />
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/" replace />} />}>
      <Route path="/onboarding/name" element={<OnboardingName />} />
      <Route path="/onboarding/location" element={<OnboardingLocation />} />
      <Route path="/onboarding/situation" element={<OnboardingSituation />} />
      <Route path="/onboarding/timeline" element={<OnboardingTimeline />} />
      <Route path="/onboarding/hours" element={<OnboardingHours />} />
      <Route path="/onboarding/categories" element={<OnboardingCategories />} />
      <Route path="/onboarding/category/home" element={<CategoryHome />} />
      <Route path="/onboarding/category/transition" element={<CategoryTransition />} />
      <Route path="/onboarding/category/food" element={<CategoryFood />} />
      <Route path="/onboarding/category/knowledge" element={<CategoryKnowledge />} />
      <Route path="/onboarding/category/creative" element={<CategoryCreative />} />
      <Route path="/onboarding/category/network" element={<CategoryNetwork />} />
      <Route path="/onboarding/category/handson" element={<CategoryHandsOn />} />
      <Route path="/onboarding/category/online" element={<CategoryOnline />} />
      <Route path="/onboarding/extra-skills" element={<ExtraSkills />} />
      <Route path="/onboarding/work-done" element={<WorkDone />} />
      <Route path="/onboarding/processing" element={<Processing />} />
      <Route path="/onboarding/score" element={<DiscoveryScore />} />
      <Route path="/onboarding/results-announce" element={<ResultsAnnounce />} />
      <Route path="/results" element={<Results />} />
      <Route path="/explore" element={<ExploreOption />} />
      <Route path="/compare" element={<Navigate to="/results" replace />} />
      <Route path="/different-options" element={<Navigate to="/results" replace />} />
      <Route path="/pivot" element={<Navigate to="/results" replace />} />
      <Route path="/paths" element={<Navigate to="/results" replace />} />
      <Route path="/time-to-pick" element={<TimeToPick />} />
      <Route path="/confetti" element={<Confetti />} />
      <Route path="/great-choice" element={<GreatChoice />} />
      <Route path="/action-plan" element={<ActionPlan />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/my-paths" element={<MyPaths />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/weekly-review" element={<WeeklyReview />} />
      <Route path="/coach" element={<TaskCoach />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <LanguageProvider>
          <Router>
            <ScrollToTop />
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </LanguageProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;