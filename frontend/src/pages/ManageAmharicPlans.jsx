import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { annualPlanAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { ArrowLeft, Edit, Trash2, Plus, AlertTriangle, Calendar, Target, Download, FileText, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ETHIOPIAN_MONTHS } from '../utils/ethiopianCalendar';
import { exportAmharicPlanToPDF, exportAmharicPlanToExcel, exportAmharicPlanToWord } from '../utils/exportReports';

function ManageAmharicPlans({ user, onLogout }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [amharicPlans, setAmharicPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState({});

  useEffect(() => {
    fetchAmharicPlans();
  }, []);

  const fetchAmharicPlans = async () => {
    try {
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

  const handleDeletePlan = async (planId) => {
    setDeleting(true);
    try {
      await annualPlanAPI.deleteAmharicPlan(planId);
      setAmharicPlans(amharicPlans.filter(plan => plan.id !== planId));
      setShowDeleteModal(false);
      setPlanToDelete(null);
    } catch (err) {
      setError('Failed to delete plan');
      console.error('Error deleting plan:', err);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteAllPlans = async () => {
    setDeleting(true);
    try {
      await annualPlanAPI.deleteAllAmharicPlans();
      setAmharicPlans([]);
      setShowDeleteAllModal(false);
    } catch (err) {
      setError('Failed to delete all plans');
      console.error('Error deleting all plans:', err);
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteModal = (plan) => {
    setPlanToDelete(plan);
    setShowDeleteModal(true);
  };

  const handleExportPlan = async (plan, format) => {
    try {
      // Fetch activities for this plan
      const activitiesResponse = await annualPlanAPI.getAmharicPlanActivities(plan.id);
      const activities = activitiesResponse.data || [];
      
      switch (format) {
        case 'pdf':
          exportAmharicPlanToPDF(plan, activities, 'am');
          break;
        case 'excel':
          exportAmharicPlanToExcel(plan, activities, 'am');
          break;
        case 'word':
          await exportAmharicPlanToWord(plan, activities, 'am');
          break;
      }
      
      // Close dropdown
      setShowExportDropdown({});
    } catch (error) {
      console.error('Error exporting plan:', error);
      setError('Failed to export plan');
    }
  };

  const toggleExportDropdown = (planId) => {
    setShowExportDropdown(prev => ({
      ...prev,
      [planId]: !prev[planId]
    }));
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
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-3 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  📋
                </div>
                የአማርኛ እቅዶች አስተዳደር
              </h1>
              <p className="text-purple-200">
                የተፈጠሩ የአማርኛ መዋቅራዊ እቅዶችን ያርትዑ፣ ይሰርዙ እና ያስተዳድሩ
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/create-amharic-plan')}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition transform hover:scale-105 shadow-lg font-semibold"
              >
                <Plus size={20} />
                አዲስ እቅድ ፍጠር
              </button>
              
              {amharicPlans.length > 0 && (
                <button
                  onClick={() => setShowDeleteAllModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl transition transform hover:scale-105 shadow-lg font-semibold"
                >
                  <Trash2 size={20} />
                  ሁሉንም ሰርዝ
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-400/50 text-red-200 px-6 py-4 rounded-xl mb-6 backdrop-blur-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
              <p className="text-purple-200 mt-4">እቅዶች በመጫን ላይ...</p>
            </div>
          ) : amharicPlans.length === 0 ? (
            <div className="glass rounded-3xl shadow-2xl p-16 text-center backdrop-blur-xl border border-white/20">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                📋
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">ምንም የአማርኛ እቅዶች የሉም</h3>
              <p className="text-purple-200 max-w-md mx-auto mb-6">
                አሁን ላይ የተፈጠሩ የአማርኛ መዋቅራዊ እቅዶች የሉም። አዲስ እቅድ ይፍጠሩ።
              </p>
              <button
                onClick={() => navigate('/create-amharic-plan')}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition transform hover:scale-105 shadow-lg font-semibold mx-auto"
              >
                <Plus size={20} />
                የመጀመሪያ እቅድ ፍጠር
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {amharicPlans.map((plan) => {
                const monthName = ETHIOPIAN_MONTHS.find(m => m.number === plan.plan_month)?.amharic || '';
                
                return (
                  <div key={plan.id} className="glass rounded-2xl shadow-xl p-6 backdrop-blur-xl border border-white/20 hover:border-white/30 transition">
                    <div className="flex items-start justify-between">
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
                        <div className="text-sm text-purple-300">
                          <span>የተፈጠረበት ቀን: {new Date(plan.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="ml-6 flex gap-2">
                        {/* Export Dropdown */}
                        <div className="relative">
                          <button
                            onClick={() => toggleExportDropdown(plan.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition font-semibold"
                          >
                            <Download size={16} />
                            ውጣ
                            <ChevronDown size={14} className={`transition-transform ${showExportDropdown[plan.id] ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {showExportDropdown[plan.id] && (
                            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-white/20 rounded-lg shadow-2xl backdrop-blur-xl z-50">
                              <button
                                onClick={() => handleExportPlan(plan, 'pdf')}
                                className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition flex items-center gap-2 rounded-t-lg"
                              >
                                <FileText size={16} />
                                <span>PDF ወደ ውጭ ላክ</span>
                              </button>
                              <button
                                onClick={() => handleExportPlan(plan, 'excel')}
                                className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition flex items-center gap-2"
                              >
                                <FileText size={16} />
                                <span>Excel ወደ ውጭ ላክ</span>
                              </button>
                              <button
                                onClick={() => handleExportPlan(plan, 'word')}
                                className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition flex items-center gap-2 rounded-b-lg"
                              >
                                <FileText size={16} />
                                <span>Word ወደ ውጭ ላክ</span>
                              </button>
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={() => navigate(`/edit-amharic-plan/${plan.id}`)}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition font-semibold"
                        >
                          <Edit size={16} />
                          አርትዕ
                        </button>
                        <button
                          onClick={() => openDeleteModal(plan)}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-lg transition font-semibold"
                        >
                          <Trash2 size={16} />
                          ሰርዝ
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Delete Single Plan Modal */}
        {showDeleteModal && planToDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass rounded-2xl shadow-2xl p-8 max-w-md w-full backdrop-blur-xl border border-white/20 animate-slide-in">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-500/20 border border-red-400/30 rounded-xl flex items-center justify-center">
                  <AlertTriangle size={24} className="text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">እቅድ ሰርዝ</h3>
                  <p className="text-purple-200 text-sm">ይህ ተግባር መልሰው ማግኘት አይችሉም</p>
                </div>
              </div>
              
              <p className="text-purple-200 mb-6">
                "<span className="font-semibold text-white" style={{ fontFamily: "'Noto Sans Ethiopic', sans-serif" }}>
                  {planToDelete.plan_title_amharic || planToDelete.title}
                </span>" እቅድን ሰርዝ ማድረግ ይፈልጋሉ? ይህ እቅድ እና ሁሉም ተዛማጅ ሪፖርቶች ይሰረዛሉ።
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => handleDeletePlan(planToDelete.id)}
                  disabled={deleting}
                  className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl transition transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {deleting ? 'በመሰረዝ ላይ...' : 'እቅድ ሰርዝ'}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setPlanToDelete(null);
                  }}
                  className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition text-white font-semibold"
                >
                  ሰርዝ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete All Plans Modal */}
        {showDeleteAllModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass rounded-2xl shadow-2xl p-8 max-w-md w-full backdrop-blur-xl border border-white/20 animate-slide-in">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-500/20 border border-red-400/30 rounded-xl flex items-center justify-center">
                  <AlertTriangle size={24} className="text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">ሁሉንም እቅዶች ሰርዝ</h3>
                  <p className="text-purple-200 text-sm">ይህ ተግባር መልሰው ማግኘት አይችሉም</p>
                </div>
              </div>
              
              <p className="text-purple-200 mb-6">
                ሁሉንም የአማርኛ እቅዶች ({amharicPlans.length} እቅዶች) ሰርዝ ማድረግ ይፈልጋሉ? 
                ይህ ሁሉም እቅዶች እና ሁሉም ተዛማጅ ሪፖርቶች ይሰረዛሉ።
              </p>

              <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 mb-6">
                <p className="text-red-200 text-sm font-semibold">
                  ⚠️ ማስጠንቀቂያ: ይህ ተግባር ሁሉንም የአማርኛ እቅዶች እና የቅርንጫፍ ሪፖርቶች ይሰርዛል!
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAllPlans}
                  disabled={deleting}
                  className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl transition transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {deleting ? 'በመሰረዝ ላይ...' : 'ሁሉንም ሰርዝ'}
                </button>
                <button
                  onClick={() => setShowDeleteAllModal(false)}
                  className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition text-white font-semibold"
                >
                  ሰርዝ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageAmharicPlans;