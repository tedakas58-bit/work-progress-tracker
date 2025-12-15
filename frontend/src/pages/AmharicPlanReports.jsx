import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { annualPlanAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { ArrowLeft, FileText, Calendar, Target, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ETHIOPIAN_MONTHS } from '../utils/ethiopianCalendar';

function AmharicPlanReports({ user, onLogout }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [amharicPlans, setAmharicPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchAmharicPlans();
    
    // Check for success message from navigation state
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  }, [location.state]);

  const fetchAmharicPlans = async () => {
    try {
      // Fetch all Amharic plans that this woreda user needs to report on
      const response = await annualPlanAPI.getAll();
      const amharicPlansOnly = response.data.filter(plan => plan.plan_type === 'amharic_structured');
      setAmharicPlans(amharicPlansOnly);
    } catch (err) {
      setError('Failed to fetch Amharic plans');
      console.error('Error fetching Amharic plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
      submitted: 'bg-green-500/20 text-green-300 border-green-400/30',
      late: 'bg-red-500/20 text-red-300 border-red-400/30',
    };
    
    const icons = {
      pending: Clock,
      submitted: CheckCircle,
      late: AlertCircle,
    };
    
    const statusText = {
      pending: t('በመጠባበቅ ላይ', 'Pending'),
      submitted: t('ገብቷል', 'Submitted'),
      late: t('ዘግይቷል', 'Late'),
    };
    
    const Icon = icons[status];
    
    return (
      <span className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-xs font-semibold border backdrop-blur-sm ${styles[status]}`}>
        <Icon size={14} />
        <span>{statusText[status]}</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="container mx-auto px-6 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-purple-300 hover:text-white mb-6 transition group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>ወደ ዳሽቦርድ ተመለስ</span>
        </button>

        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-3 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                📋
              </div>
              የአማርኛ እቅድ ሪፖርቶች
            </h1>
            <p className="text-purple-200">
              በአማርኛ መዋቅራዊ እቅዶች ላይ የእርስዎን እድገት ያሳዩ እና ሪፖርት ያድርጉ
            </p>
          </div>

          {successMessage && (
            <div className="bg-green-500/20 border border-green-400/50 text-green-200 px-6 py-4 rounded-xl mb-6 backdrop-blur-sm animate-slide-in">
              {successMessage}
            </div>
          )}

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
              <p className="text-purple-200 mt-4">እቅዶች በመጫን ላይ...</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/20 border border-red-400/50 text-red-200 px-6 py-4 rounded-xl mb-6 backdrop-blur-sm">
              {error}
            </div>
          ) : amharicPlans.length === 0 ? (
            <div className="glass rounded-3xl shadow-2xl p-16 text-center backdrop-blur-xl border border-white/20">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <FileText size={48} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">ምንም የአማርኛ እቅዶች የሉም</h3>
              <p className="text-purple-200 max-w-md mx-auto">
                አሁን ላይ ለእርስዎ የተመደቡ የአማርኛ መዋቅራዊ እቅዶች የሉም። ዋና ቅርንጫፍ እቅድ ሲፈጥር እዚህ ይታያል።
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {amharicPlans.map((plan) => {
                const monthName = ETHIOPIAN_MONTHS.find(m => m.number === plan.plan_month)?.amharic || '';
                
                return (
                  <div key={plan.id} className="glass rounded-2xl shadow-xl p-6 backdrop-blur-xl border border-white/20 hover:border-white/30 transition">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Noto Sans Ethiopic', sans-serif" }}>
                          {plan.plan_title_amharic || plan.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-purple-200 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            <span>{monthName} {plan.year}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target size={16} />
                            <span>የአማርኛ መዋቅራዊ እቅድ</span>
                          </div>
                        </div>
                        {plan.plan_description_amharic && (
                          <p className="text-purple-200 text-sm mb-4" style={{ fontFamily: "'Noto Sans Ethiopic', sans-serif" }}>
                            {plan.plan_description_amharic}
                          </p>
                        )}
                      </div>
                      <div className="ml-4">
                        {getStatusBadge('pending')} {/* This would be dynamic based on actual status */}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-purple-300">
                        <span>የተፈጠረበት ቀን: {new Date(plan.created_at).toLocaleDateString()}</span>
                      </div>
                      <button
                        onClick={() => navigate(`/submit-amharic-report/${plan.id}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg transition font-semibold"
                      >
                        <FileText size={16} />
                        ሪፖርት አድርግ
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AmharicPlanReports;