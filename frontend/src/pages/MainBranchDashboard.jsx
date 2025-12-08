import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { annualPlanAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { Plus, Calendar, TrendingUp, Eye, Users, Sparkles, Target, DollarSign } from 'lucide-react';

function MainBranchDashboard({ user, onLogout }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await annualPlanAPI.getAll();
      setPlans(response.data);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-slide-in">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Sparkles className="text-yellow-400" size={32} />
              Main Branch Dashboard
            </h1>
            <p className="text-purple-200">Manage annual plans and monitor progress across all branches</p>
          </div>
          
          <Link
            to="/create-plan"
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl transition transform hover:scale-105 shadow-lg"
          >
            <Plus size={20} />
            <span className="font-semibold">Create Annual Plan</span>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
            <p className="text-purple-200 mt-4">Loading plans...</p>
          </div>
        ) : plans.length === 0 ? (
          <div className="glass rounded-3xl shadow-2xl p-16 text-center backdrop-blur-xl border border-white/20 animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Calendar size={48} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No Annual Plans Yet</h3>
            <p className="text-purple-200 mb-8 max-w-md mx-auto">
              Get started by creating your first annual plan. The system will automatically split it into monthly periods.
            </p>
            <Link
              to="/create-plan"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl transition transform hover:scale-105 shadow-lg font-semibold"
            >
              <Plus size={20} />
              <span>Create Your First Plan</span>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 animate-fade-in">
            {plans.map((plan, index) => (
              <div 
                key={plan.id} 
                className="glass rounded-2xl shadow-xl hover:shadow-2xl transition-all p-6 backdrop-blur-xl border border-white/20 card-hover"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <TrendingUp size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">{plan.title}</h3>
                        <p className="text-purple-200">{plan.description}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-4 border border-blue-400/30">
                        <div className="flex items-center gap-2 text-blue-300 text-sm mb-1">
                          <Calendar size={16} />
                          Year
                        </div>
                        <div className="text-2xl font-bold text-white">{plan.year}</div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-4 border border-green-400/30">
                        <div className="flex items-center gap-2 text-green-300 text-sm mb-1">
                          <DollarSign size={16} />
                          Target Amount
                        </div>
                        <div className="text-2xl font-bold text-white">
                          ${plan.target_amount?.toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
                        <div className="flex items-center gap-2 text-purple-300 text-sm mb-1">
                          <Target size={16} />
                          Target Units
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {plan.target_units?.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-purple-300">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      Created by {plan.creator_name} on {new Date(plan.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex lg:flex-col gap-3">
                    <Link
                      to={`/plan/${plan.id}`}
                      className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl transition transform hover:scale-105 shadow-lg font-semibold flex-1 lg:flex-initial"
                    >
                      <Eye size={18} />
                      <span>View Details</span>
                    </Link>
                    
                    <Link
                      to={`/comparison/${plan.id}`}
                      className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl transition transform hover:scale-105 shadow-lg font-semibold flex-1 lg:flex-initial"
                    >
                      <Users size={18} />
                      <span>Comparison</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MainBranchDashboard;
