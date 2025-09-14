import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { apiService } from '../services/api';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { RiskBadge } from './ui/RiskBadge';
import { Toggle } from './ui/Toggle';
import type { PreMulticlassFormData, PreMulticlassResponse } from '../types';

const RISK_CLASS_OPTIONS = ['I', 'II', 'III'];
const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Japan', 'Australia'];
const DEVICE_CLASSIFICATIONS = ['Cardiac Device', 'Ventilator', 'Surgical Instrument', 'Diagnostic Equipment'];

export const PreMulticlassPrediction: React.FC = () => {
  const [formData, setFormData] = useState<PreMulticlassFormData>({
    deviceId: '',
    manufacturerId: '',
    riskClass: 'I',
    classification: '',
    implanted: false,
    quantityInCommerce: 1000,
    country: '',
    parentCompany: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PreMulticlassResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await apiService.predictPreMulticlass(formData);
      setResult(result);
    } catch (error) {
      console.error('API call failed:', error);
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  const chartData = result ? [
    { name: 'CLASS I', value: result.probabilities['CLASS I'], color: '#10b981' },
    { name: 'CLASS II', value: result.probabilities['CLASS II'], color: '#f59e0b' },
    { name: 'CLASS III', value: result.probabilities['CLASS III'], color: '#ef4444' }
  ] : [];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            Probability: {(payload[0].value * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 h-full">
      {/* Input Form */}
      <div className="lg:col-span-2">
        <Card title="Pre-Use Severity Prediction">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Device ID</label>
              <input
                type="text"
                value={formData.deviceId}
                onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturer ID</label>
              <input
                type="text"
                value={formData.manufacturerId}
                onChange={(e) => setFormData({ ...formData, manufacturerId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Risk Class</label>
              <select
                value={formData.riskClass}
                onChange={(e) => setFormData({ ...formData, riskClass: e.target.value as 'I' | 'II' | 'III' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {RISK_CLASS_OPTIONS.map(option => (
                  <option key={option} value={option}>Class {option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Classification</label>
              <input
                list="classifications"
                value={formData.classification}
                onChange={(e) => setFormData({ ...formData, classification: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Cardiac Device"
                required
              />
              <datalist id="classifications">
                {DEVICE_CLASSIFICATIONS.map(classification => (
                  <option key={classification} value={classification} />
                ))}
              </datalist>
            </div>

            <div>
              <Toggle
                label="Device is implanted"
                checked={formData.implanted}
                onChange={(checked) => setFormData({ ...formData, implanted: checked })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity in Commerce: {formData.quantityInCommerce.toLocaleString()}
              </label>
              <input
                type="range"
                min="1"
                max="100000"
                step="100"
                value={formData.quantityInCommerce}
                onChange={(e) => setFormData({ ...formData, quantityInCommerce: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a country</option>
                {COUNTRIES.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Parent Company</label>
              <input
                type="text"
                value={formData.parentCompany}
                onChange={(e) => setFormData({ ...formData, parentCompany: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Predict Severity
            </Button>
          </form>
        </Card>
      </div>

      {/* Results */}
      <div className="lg:col-span-3">
        <Card title="Prediction Analysis">
          {result ? (
            <div className="space-y-8">
              {/* Predicted Class */}
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Predicted Class</h3>
                <RiskBadge riskClass={result.pred_class} size="lg" />
              </div>

              {/* Probability Chart */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4 text-center">Probability Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Confidence Level</p>
                      <p className="text-2xl font-bold text-blue-700">
                        {(result.confidence_level * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    {result.computed_history_present ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <Info className="w-6 h-6 text-gray-600" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">Historical Data</p>
                      <p className="text-sm text-gray-600">
                        {result.computed_history_present ? 'Found' : 'Not Found'}
                      </p>
                    </div>
                  </div>
                </div>
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