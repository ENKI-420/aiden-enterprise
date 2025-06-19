import { Button } from '@/components/ui/button';
import {
  BarChart3,
  TrendingUp,
  Shield,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Globe,
  Settings,
  LogOut,
  Bell,
  FileText,
  Activity
} from 'lucide-react';
import Link from 'next/link';

export default function ExecutiveDashboard() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 text-white">
      {/* Top Navigation */}
      <nav className="w-full flex justify-between items-center px-8 py-4 bg-black/90 shadow-lg border-b border-gray-800">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-gradient-to-br from-blue-500 to-yellow-400 flex items-center justify-center font-bold">ADS</div>
            <span className="font-bold text-xl">Executive Dashboard</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="px-3 py-1 bg-blue-600 rounded-full text-xs font-semibold">EXECUTIVE</span>
            <span className="px-3 py-1 bg-green-600 rounded-full text-xs font-semibold">CLEARANCE: SECRET</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            <Bell className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <LogOut className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2 ml-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-sm font-bold">DD</span>
            </div>
            <div className="text-sm">
              <div className="font-semibold">Devin Davis</div>
              <div className="text-gray-400 text-xs">CEO & Founder</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900/50 border-r border-gray-800 min-h-screen">
          <div className="p-6">
            <h3 className="text-lg font-bold mb-6">Executive Suite</h3>
            <nav className="space-y-2">
              <Link href="#" className="flex items-center gap-3 px-4 py-2 rounded bg-blue-600 text-white">
                <BarChart3 className="w-4 h-4" />
                Dashboard Overview
              </Link>
              <Link href="#" className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-800 transition">
                <TrendingUp className="w-4 h-4" />
                Strategic Analytics
              </Link>
              <Link href="#" className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-800 transition">
                <DollarSign className="w-4 h-4" />
                Financial Performance
              </Link>
              <Link href="#" className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-800 transition">
                <Shield className="w-4 h-4" />
                Security & Compliance
              </Link>
              <Link href="#" className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-800 transition">
                <Users className="w-4 h-4" />
                Team Performance
              </Link>
              <Link href="#" className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-800 transition">
                <Target className="w-4 h-4" />
                Strategic Objectives
              </Link>
              <Link href="#" className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-800 transition">
                <FileText className="w-4 h-4" />
                Executive Reports
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Dashboard Content */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Executive Dashboard</h1>
            <p className="text-gray-400">Strategic overview of Agile Defense Systems operations and performance</p>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-green-600/20 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">$52.3M</div>
                  <div className="text-sm text-gray-400">Annual Revenue</div>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-green-400">+23.5%</span>
                <span className="text-gray-400 ml-1">vs last year</span>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400">73</div>
                  <div className="text-sm text-gray-400">Active Projects</div>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <Activity className="w-4 h-4 text-blue-400 mr-1" />
                <span className="text-blue-400">12 new</span>
                <span className="text-gray-400 ml-1">this month</span>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-600/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-400">147</div>
                  <div className="text-sm text-gray-400">Team Members</div>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-purple-400 mr-1" />
                <span className="text-purple-400">95%</span>
                <span className="text-gray-400 ml-1">retention rate</span>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-red-600/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-red-400" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-400">99.9%</div>
                  <div className="text-sm text-gray-400">Security Score</div>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-green-400">CMMC L3</span>
                <span className="text-gray-400 ml-1">compliant</span>
              </div>
            </div>
          </div>

          {/* Strategic Objectives */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-400" />
                Q4 2024 Strategic Objectives
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">AI Platform Expansion</div>
                    <div className="text-sm text-gray-400">Launch AIAAS platform</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-700 rounded-full h-2 mr-3">
                      <div className="bg-green-400 h-2 rounded-full" style={{width: '85%'}}></div>
                    </div>
                    <span className="text-sm text-green-400">85%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Defense Contracts</div>
                    <div className="text-sm text-gray-400">Secure $25M in new contracts</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-700 rounded-full h-2 mr-3">
                      <div className="bg-blue-400 h-2 rounded-full" style={{width: '72%'}}></div>
                    </div>
                    <span className="text-sm text-blue-400">72%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Team Growth</div>
                    <div className="text-sm text-gray-400">Hire 25 new specialists</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-700 rounded-full h-2 mr-3">
                      <div className="bg-purple-400 h-2 rounded-full" style={{width: '60%'}}></div>
                    </div>
                    <span className="text-sm text-purple-400">60%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
                Risk Assessment
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                  <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <div className="font-semibold text-red-400">High: Supply Chain</div>
                    <div className="text-sm text-gray-300">Semiconductor shortage affecting hardware delivery</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <div className="font-semibold text-yellow-400">Medium: Talent Acquisition</div>
                    <div className="text-sm text-gray-300">Competitive market for AI specialists</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <div className="font-semibold text-green-400">Low: Cybersecurity</div>
                    <div className="text-sm text-gray-300">Strong security posture maintained</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-400" />
              Recent Executive Activities
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">DoD Contract Approved</div>
                  <div className="text-sm text-gray-400">$12.5M AI integration platform contract signed</div>
                </div>
                <div className="text-sm text-gray-400">2 hours ago</div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">Board Meeting Scheduled</div>
                  <div className="text-sm text-gray-400">Q4 performance review and strategic planning</div>
                </div>
                <div className="text-sm text-gray-400">1 day ago</div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">International Expansion</div>
                  <div className="text-sm text-gray-400">Partnership discussions with UK defense contractor</div>
                </div>
                <div className="text-sm text-gray-400">3 days ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}