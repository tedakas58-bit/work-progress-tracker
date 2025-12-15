import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { reportAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { ArrowLeft, Award, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { transformBranchName } from '../utils/branchNameTransform';

function BranchComparison({ user, onLogout }) {
  const navigate = useNavigate();
  const { planId } = useParams();
  const { t, language } = useLanguage();
  

  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComparison();
  }, [planId]);

  const fetchComparison = async () => {
    try {
      const response = await reportAPI.getBranchComparison(planId);
      setBranches(response.data);
    } catch (error) {
      console.error('Failed to fetch comparison:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} onLogout={onLogout} />
        <div className="container mx-auto px-4 py-8 text-center">{t('በመጫን ላይ...', 'Loading...')}</div>
      </div>
    );
  }

  const chartData = branches.map(branch => ({
    name: transformBranchName(branch.branch_name, language),
    achieved: parseFloat(branch.total_achieved || 0),
    progress: parseFloat(branch.avg_progress || 0),
  }));

  const topPerformer = branches.reduce((max, branch) => 
    parseFloat(branch.avg_progress || 0) > parseFloat(max.avg_progress || 0) ? branch : max
  , branches[0]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft size={20} />
          <span>{t('ወደ ዳሽቦርድ ተመለስ', 'Back to Dashboard')}</span>
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{t('የቅርንጫፍ አፈጻጸም ንጽጽር', 'Branch Performance Comparison')}</h1>
          <p className="text-gray-600 mt-1">{t('በሁሉም ቅርንጫፎች መካከል እድገትን ያወዳድሩ', 'Compare progress across all branches')}</p>
        </div>

        {topPerformer && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow-lg p-6 mb-8 text-white">
            <div className="flex items-center space-x-4">
              <Award size={48} />
              <div>
                <h2 className="text-2xl font-bold">{t('ከፍተኛ አፈጻጸም ያለው', 'Top Performer')}</h2>
                <p className="text-xl">{transformBranchName(topPerformer.branch_name, language)}</p>
                <p className="text-lg opacity-90">
                  {parseFloat(topPerformer.avg_progress || 0).toFixed(1)}% {t('አማካይ እድገት', 'Average Progress')}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t('የእድገት ንጽጽር', 'Progress Comparison')}</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="achieved" fill="#3b82f6" name={t('ጠቅላላ የተሳካ', 'Total Achieved')} />
              <Bar yAxisId="right" dataKey="progress" fill="#10b981" name={t('አማካይ እድገት (%)', 'Avg Progress (%)')} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">{t('ዝርዝር የቅርንጫፍ ስታቲስቲክስ', 'Detailed Branch Statistics')}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('ደረጃ', 'Rank')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('ወረዳ', 'Woreda')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('ጠቅላላ ሪፖርቶች', 'Total Reports')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('በጊዜው', 'On Time')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('ዘግይቷል', 'Late')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('በመጠባበቅ ላይ', 'Pending')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('ጠቅላላ የተሳካ', 'Total Achieved')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('አማካይ እድገት', 'Avg Progress')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('አዝማሚያ', 'Trend')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {branches.map((branch, index) => {
                  const progress = parseFloat(branch.avg_progress || 0);
                  const isGood = progress >= 75;
                  
                  return (
                    <tr key={branch.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        {index === 0 && <Award className="inline text-yellow-500 mr-1" size={16} />}
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {transformBranchName(branch.branch_name, language)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {branch.total_reports}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                          {branch.submitted_on_time}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
                          {branch.submitted_late}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                          {branch.pending}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {parseFloat(branch.total_achieved || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                            <div
                              className={`h-2 rounded-full ${isGood ? 'bg-green-500' : 'bg-orange-500'}`}
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                          <span className="font-semibold">{(Number(progress) || 0).toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {isGood ? (
                          <TrendingUp className="text-green-500" size={20} />
                        ) : (
                          <TrendingDown className="text-red-500" size={20} />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BranchComparison;
