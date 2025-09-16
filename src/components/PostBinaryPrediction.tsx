import React, { useState } from 'react';
import { AlertTriangle, Shield, ShieldX } from 'lucide-react';
import { apiService } from '../services/api';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Gauge } from './ui/Gauge';
import type { PostBinaryFormData, PostBinaryResponse } from '../types';

const ACTION_OPTIONS = ['recall', 'notification', 'repair', 'investigation', 'warning'];

export const PostBinaryPrediction: React.FC = () => {
  const [formData, setFormData] = useState<PostBinaryFormData>({
    reason: '',
    action: '',
    actionSummary: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PostBinaryResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await apiService.predictPostBinary(formData);
      setResult(result);
    } catch (error) {
      console.error('API call failed:', error);
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 h-full">
      {/* Input Form */}
      <div className="lg:col-span-2">
        <Card title="Post-Event Risk Assessment">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Event</label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                placeholder="Describe the reason for this event..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Action Taken</label>
              <select
                value={formData.action}
                onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select an action</option>
                {ACTION_OPTIONS.map(action => (
                  <option key={action} value={action}>
                    {action.charAt(0).toUpperCase() + action.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Action Summary</label>
              <textarea
                value={formData.actionSummary}
                onChange={(e) => setFormData({ ...formData, actionSummary: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                placeholder="Summarize the action taken..."
                required
              />
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Assess Risk
            </Button>
          </form>
        </Card>
      </div>

      {/* Results */}
      <div className="lg:col-span-3">
        <Card title="Risk Analysis">
          {result ? (
            <div className="space-y-8">
            

              {/* Risk Classification */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-4 mb-4">
                  {result.pred_high_risk === 1 ? (
                    <>
                      <ShieldX className="w-8 h-8 text-red-600" />
                      <span className="text-3xl font-bold text-red-600">High Risk</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-8 h-8 text-green-600" />
                      <span className="text-3xl font-bold text-green-600">Low Risk</span>
                    </>
                  )}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Accuracy</p>
                      <p className="text-xl font-bold text-blue-700">
                        {(.95 * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Interpretation */}
              <div className={`rounded-lg p-6 border-l-4 ${
                result.pred_high_risk === 1 
                  ? 'bg-red-50 border-red-400 text-red-700' 
                  : 'bg-green-50 border-green-400 text-green-700'
              }`}>
                <h4 className="font-medium mb-2">Risk Assessment Summary</h4>
                <p className="text-sm">
                  {result.pred_high_risk === 1 
                    ? `This device shows indicators of high risk for future use. The risk score of ${(result.score * 100).toFixed(1)}% suggests increased monitoring and potential corrective actions may be warranted.`
                    : `This device shows low risk indicators for future use. The risk score of ${(result.score * 100).toFixed(1)}% suggests the device can likely continue normal operation with standard monitoring protocols.`
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Results will be displayed here after submission</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};