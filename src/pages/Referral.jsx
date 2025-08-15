import { useState, useEffect } from 'react';
import { Share2, Copy, Users, Gift } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Referral = () => {
  const [referralData, setReferralData] = useState({
    code: '',
    totalReferred: 0,
    totalEarned: 0,
    referrals: []
  });
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    // Mock referral data for demo
    const mockData = {
      code: user?.referral_code || 'ZIPPY2024',
      totalReferred: 12,
      totalEarned: 2400,
      referrals: [
        { name: 'John Doe', phone: '08012345678', date: '2024-01-15', reward: 200 },
        { name: 'Jane Smith', phone: '08087654321', date: '2024-01-14', reward: 200 },
        { name: 'Mike Johnson', phone: '08098765432', date: '2024-01-13', reward: 200 }
      ]
    };
    
    setReferralData(mockData);
    setLoading(false);
  }, [user]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralData.code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Join Zippy Pay',
      text: `Use my referral code ${referralData.code} to get started on Zippy Pay and earn rewards!`,
      url: window.location.origin
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${shareData.text} ${shareData.url}`
        );
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-neutral-800 mb-2">
            Referral Program
          </h1>
          <p className="text-neutral-600">
            Earn ₦200 for every friend you refer to Zippy Pay
          </p>
        </div>

        {/* Referral Code Card */}
        <div className="bg-[#5C2D91] p-6 rounded-xl text-white shadow-lg mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white text-[#FF8C00] bg-opacity-20 rounded-lg">
              <Share2 size={24} />
            </div>
            <div>
              <p className="text-sm opacity-90">Your Referral Code</p>
              <p className="text-2xl font-bold">{referralData.code}</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleCopyCode}
              className="flex-1 bg-[#FF8C00] hover:bg-[#F59E0B] py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
            >
              <Copy size={16} />
              {copySuccess ? 'Copied!' : 'Copy Code'}
            </button>
            <button
              onClick={handleShare}
             className="flex-1 bg-[#FF8C00] hover:bg-[#F59E0B] py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
            >
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="card text-center bg-blue-100 rounded-lg p-3   ">
            <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Users className="text-blue-600" size={24} />
            </div>
            <p className="text-2xl font-bold text-neutral-800">{referralData.totalReferred}</p>
            <p className="text-sm text-neutral-600">Total Referrals</p>
          </div>
          
          <div className="card text-center p-3 bg-green-100 rounded-lg">
            <div className=" w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Gift className="text-green-600" size={24} />
            </div>
            <p className="text-2xl font-bold text-neutral-800">{formatAmount(referralData.totalEarned)}</p>
            <p className="text-sm text-neutral-600">Total Earned</p>
          </div>
          
          <div className="card text-center p-3 bg-purple-100 rounded-lg ">
            <div className="p-3 bg-purple-100 rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Share2 className="text-purple-600" size={24} />
            </div>
            <p className="text-2xl font-bold text-neutral-800">₦200</p>
            <p className="text-sm text-neutral-600">Per Referral</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">How It Works</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="bg-[#5C2D91] text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3">
                1
              </div>
              <h4 className="font-medium text-neutral-800 mb-2">Share Your Code</h4>
              <p className="text-sm text-neutral-600">Share your referral code with friends and family</p>
            </div>
            
            <div className="text-center">
              <div className="bg-[#5C2D91] text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3">
                2
              </div>
              <h4 className="font-medium text-neutral-800 mb-2">They Sign Up</h4>
              <p className="text-sm text-neutral-600">Your friends sign up using your referral code</p>
            </div>
            
            <div className="text-center">
              <div className="bg-[#5C2D91] text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3">
                3
              </div>
              <h4 className="font-medium text-neutral-800 mb-2">You Earn</h4>
              <p className="text-sm text-neutral-600">Earn ₦200 for each successful referral</p>
            </div>
          </div>
        </div>

        {/* Referral History */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">Referral History</h3>
          
          {referralData.referrals.length > 0 ? (
            <div className="space-y-4">
              {referralData.referrals.map((referral, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-neutral-400 last:border-b-0">
                  <div>
                    <p className="font-medium text-neutral-800">{referral.name}</p>
                    <p className="text-sm text-neutral-600">{referral.phone}</p>
                    <p className="text-sm text-neutral-500">{formatDate(referral.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-success">{formatAmount(referral.reward)}</p>
                    <p className="text-sm text-neutral-600">Earned</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-neutral-500">No referrals yet</p>
              <p className="text-sm text-neutral-400">
                Start sharing your referral code to earn rewards
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Referral;