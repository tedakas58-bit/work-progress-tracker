import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { annualPlanAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { ArrowLeft, Download, FileText, ChevronDown, Calendar, Target, Users, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ETHIOPIAN_MONTHS, getEthiopianMonthName } from '../utils/ethiopianCalendar';
import { exportAmharicReportsToPDF, exportAmharicReportsToExcel, exportAmharicReportsToWord } from '../utils/exportReports';

function ViewAmharicReports({ user, onLogout }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [allReports, setAllReports] = useState([]);
  const [groupedReports, setGroupedReports] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showExportDropdown, setShowExportDropdown] = useState({});
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  useEffect(() => {
    fetchAllAmharicReports();
  }, []);

  const fetchAllAmharicReports = async () => {
    try {
      console.log('Fetching all Amharic activity reports...');
      const response = await annualPlanAPI.getAllAmharicActivityReports();
      const reports = response.data || [];
      
      console.log('Received reports:', reports);
      setAllReports(reports);
      
      // Group reports by plan and month
      const grouped = {};
      reports.forEach(report => {
        const key = `${report.plan_id}-${report.month}-${report.year}`;
        if (!grouped[key]) {
          grouped[key] = {
            plan_id: report.plan_id,
            plan_title: report.plan_title,
            plan_title_amharic: report.plan_title_amharic,
            month: report.month,
            year: report.year,
            reports: []
          };
        }
        
        // Handle both activity reports (with activities array) and flattened monthly reports
        if (report.activities && Array.isArray(report.activities)) {
          // This is an activity report with multiple activities
          report.activities.forEach(activity => {
            grouped[key].reports.push({
              ...report,
              ...activity,
              activity_number: activity.activity_number,
              activity_title_amharic: activity.activity_title_amharic,
              actual_achievement: activity.actual_achievement,
              achievement_percentage: activity.achievement_percentage,
              status: activity.status
            });
          });
        } else {
          // This is a flattened monthly report
          grouped[key].reports.push(report);
        }
      });
      
      setGroupedReports(grouped);
    } catch (err) {
      console.error('Error fetching Amharic reports:', err);
      setError('Failed to fetch Amharic reports');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReports = async (groupKey, format) => {
    try {
      const group = groupedReports[groupKey];
      if (!group || !group.reports.length) return;
      
      // Get plan details
      const planResponse = await annualPlanAPI.getById(group.plan_id);
      const plan = planResponse.data;
      
      switch (format) {
        case 'pdf':
          exportAmharicReportsToPDF(group.reports, plan, group.month, group.year, 'am');
          break;
        case 'excel':
          exportAmharicReportsToExcel(group.reports, plan, group.month, group.year, 'am');
          break;
        case 'word':
          await exportAmharicReportsToWord(group.reports, plan, group.month, group.year, 'am');
          break;
      }
      
      // Close dropdown
      setShowExportDropdown({});
    } catch (error) {
      console.error('Error exporting reports:', error);
      setError('Failed to export reports');
    }
  };

  const toggleExportDropdown = (groupKey) => {
    setShowExportDropdown(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  // Filter reports based on selected month and year
  const filteredGroups = Object.entries(groupedReports).filter(([key, group]) => {
    const monthMatch = selectedMonth === 'all' || group.month === parseInt(selectedMonth);
    const yearMatch = selectedYear === 'all' || group.year === parseInt(selectedYear);
    return monthMatch && yearMatch;
  });

  // Get unique years from reports
  const availableYears = [...new Set(allReports.map(r => r.year))].sort((a, b) => b - a);

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
      submitted: 'bg-green-500/20 text-green-300 border-green-400/30',
      late: 'bg-red-500/20 text-red-300 border-red-400/30',
    };
    
    const statusText = {
      pending: 'በመጠባበቅ ላይ',
      submitted: 'ገብቷል',
      late: 'ዘግይቷል',
    };
    
    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-semibold border backdrop-blur-sm ${styles[status] || styles.pending}`}>
        {statusText[status] || statusText.pending}
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

        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-3 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                📊
              </div>
              የአማርኛ እቅድ ሪፖርቶች እይታ
            </h1>
            <p className="text-purple-200">
              ሁሉንም የአማርኛ መዋቅራዊ እቅዶች ሪፖርቶች ይመልከቱ እና ወደ ውጭ ይላኩ
            </p>
          </div>

          {/* Filters */}
          <div className="glass rounded-2xl shadow-xl p-6 backdrop-blur-xl border border-white/20 mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              🔍 ማጣሪያዎች
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  ወር
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition backdrop-blur-sm"
                  style={{ fontFamily: "'Noto Sans Ethiopic', sans-serif" }}
                >
                  <option value="all" className="bg-slate-800">ሁሉም ወሮች</option>
                  {ETHIOPIAN_MONTHS.map(month => (
                    <option key={month.number} value={month.number} className="bg-slate-800">
                      {month.amharic} ({month.english})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  ዓመት
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition backdrop-blur-sm"
                >
                  <option value="all" className="bg-slate-800">ሁሉም ዓመታት</option>
                  {availableYears.map(year => (
                    <option key={year} value={year} className="bg-slate-800">
                      {year}
                    </option>
                  ))}
                </select>
              </div>
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
              <p className="text-purple-200 mt-4">ሪፖርቶች በመጫን ላይ...</p>
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="glass rounded-3xl shadow-2xl p-16 text-center backdrop-blur-xl border border-white/20">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                📊
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">ምንም ሪፖርቶች የሉም</h3>
              <p className="text-purple-200 max-w-md mx-auto">
                በተመረጡት ማጣሪያዎች ምንም የአማርኛ እቅድ ሪፖርቶች አልተገኙም።
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredGroups.map(([groupKey, group]) => {
                const monthName = getEthiopianMonthName(group.month, 'amharic');
                
                // Calculate summary statistics
                const totalReports = group.reports.length;
                const submittedReports = group.reports.filter(r => r.status === 'submitted').length;
                const totalAchieved = group.reports.reduce((sum, r) => sum + (Number(r.actual_achievement) || 0), 0);
                const avgPercentage = group.reports.length > 0 
                  ? group.reports.reduce((sum, r) => sum + (Number(r.achievement_percentage) || 0), 0) / group.reports.length 
                  : 0;
                
                return (
                  <div key={groupKey} className="glass rounded-2xl shadow-xl p-6 backdrop-blur-xl border border-white/20 hover:border-white/30 transition">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Noto Sans Ethiopic', sans-serif" }}>
                          {group.plan_title_amharic || group.plan_title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-purple-200 mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            <span>{monthName} {group.year}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users size={16} />
                            <span>{totalReports} ቅርንጫፎች</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp size={16} />
                            <span>{avgPercentage.toFixed(1)}% አማካይ እድገት</span>
                          </div>
                        </div>
                        
                        {/* Summary Statistics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                            <div className="text-2xl font-bold text-green-400">{submittedReports}</div>
                            <div className="text-xs text-purple-200">የገቡ ሪፖርቶች</div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                            <div className="text-2xl font-bold text-blue-400">{totalReports - submittedReports}</div>
                            <div className="text-xs text-purple-200">በመጠባበቅ ላይ</div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                            <div className="text-2xl font-bold text-purple-400">{totalAchieved.toLocaleString()}</div>
                            <div className="text-xs text-purple-200">ጠቅላላ ተሳካ</div>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                            <div className="text-2xl font-bold text-yellow-400">{avgPercentage.toFixed(1)}%</div>
                            <div className="text-xs text-purple-200">አማካይ እድገት</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Export Dropdown */}
                      <div className="ml-6 relative">
                        <button
                          onClick={() => toggleExportDropdown(groupKey)}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition font-semibold"
                        >
                          <Download size={16} />
                          ውጣ
                          <ChevronDown size={14} className={`transition-transform ${showExportDropdown[groupKey] ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {showExportDropdown[groupKey] && (
                          <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-white/20 rounded-lg shadow-2xl backdrop-blur-xl z-50">
                            <button
                              onClick={() => handleExportReports(groupKey, 'pdf')}
                              className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition flex items-center gap-2 rounded-t-lg"
                            >
                              <FileText size={16} />
                              <span>PDF ወደ ውጭ ላክ</span>
                            </button>
                            <button
                              onClick={() => handleExportReports(groupKey, 'excel')}
                              className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition flex items-center gap-2"
                            >
                              <FileText size={16} />
                              <span>Excel ወደ ውጭ ላክ</span>
                            </button>
                            <button
                              onClick={() => handleExportReports(groupKey, 'word')}
                              className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition flex items-center gap-2 rounded-b-lg"
                            >
                              <FileText size={16} />
                              <span>Word ወደ ውጭ ላክ</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Reports Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/20">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-purple-200">ቅርንጫፍ</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-purple-200">እንቅስቃሴ</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-purple-200">ተሳካ</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-purple-200">መቶኛ</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-purple-200">ሁኔታ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.reports.map((report, index) => (
                            <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition">
                              <td className="py-3 px-4 text-sm text-white font-medium">{report.branch_name}</td>
                              <td className="py-3 px-4 text-sm text-purple-200" style={{ fontFamily: "'Noto Sans Ethiopic', sans-serif" }}>
                                {report.activity_number} - {report.activity_title_amharic}
                              </td>
                              <td className="py-3 px-4 text-sm text-green-300 font-semibold">
                                {(Number(report.actual_achievement) || 0).toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-sm text-blue-300 font-semibold">
                                {(Number(report.achievement_percentage) || 0).toFixed(1)}%
                              </td>
                              <td className="py-3 px-4">
                                {getStatusBadge(report.status)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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

export default ViewAmharicReports;