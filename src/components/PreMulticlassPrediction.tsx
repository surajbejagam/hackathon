import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { apiService } from '../services/api';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { RiskBadge } from './ui/RiskBadge';
import { Toggle } from './ui/Toggle';
import type { PreMulticlassFormData, PreMulticlassResponse } from '../types';

const RISK_CLASS_LABELS = [
  { label: 'Basic/Regulatory Device', value: 'I', risk: 'Low' },
  { label: 'Moderate/Standard Regulatory Device', value: 'II', risk: 'Medium' },
  { label: 'Advanced/Critical Care Device', value: 'III', risk: 'High' },
  { label: 'Other/Not Classified', value: 'other', risk: 'Other' }
];
const COUNTRIES = [ 'USA', 'AUS', 'AUT', 'BEL', 'BLR',
  'BRA', 'CAN', 'CHE', 'COL', 'CUB', 'CZE',
  'DEU', 'DNK', 'ESP', 'FIN', 'FRA', 'GBR',
  'GRC', 'HKG', 'HRV', 'IND', 'IRL', 'ITA',
  'JPN', 'KOR', 'LBN', 'LTU', 'MEX', 'MYS',
  'NLD', 'NZL', 'PAN', 'PER', 'PHL', 'POL',
  'PRT', 'RUS', 'SAU', 'SGP', 'SLV', 'SRB',
  'SVN', 'SWE', 'TUN', 'TUR', 'AND'];
const DEVICE_CLASSIFICATIONS = ['Cardiac Device', 'Ventilator', 'Surgical Instrument', 'Diagnostic Equipment'];

export const PreMulticlassPrediction: React.FC = () => {
  const [formData, setFormData] = useState<any>({
    deviceName: '',
    manufacturerSourceName: '',
    riskClass: '', // no default selection
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

    // Map riskClass label to API value
    const riskClassLabel = formData.riskClass;
    const riskClassObj = RISK_CLASS_LABELS.find(option => option.label === riskClassLabel);
    const payload = {
      ...formData,
      riskClass: riskClassObj ? riskClassObj.value : formData.riskClass
    };
    try {
      const result = await apiService.predictPreMulticlass(payload);
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
      <div className="lg:col-span-2 flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <Card title="Pre-Use Severity Prediction">
            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                Device Name
                <span title="The commercial or registered name of the medical device."><Info className="w-4 h-4 text-blue-500" /></span>
              </label>
              <div className="text-xs text-gray-500 mb-1">Helps uniquely identify the product being predicted.</div>
              <div className="text-xs text-gray-400 mb-2">Example: "LifeVent Pro Ventilator" or "Cardiac Stent X2000"</div>
              <input
                type="text"
                value={formData.deviceName}
                onChange={(e) => setFormData({ ...formData, deviceName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                Manufacturer Source Name
                <span title="The company or organization that produced or distributed the device."><Info className="w-4 h-4 text-blue-500" /></span>
              </label>
              <div className="text-xs text-gray-500 mb-1">Past history of recalls/issues at manufacturer level is a strong predictor of future risk.</div>
              <div className="text-xs text-gray-400 mb-2">Example: "Abbott Laboratories" or "Johnson & Johnson"</div>
              <input
                type="text"
                value={formData.manufacturerSourceName}
                onChange={(e) => setFormData({ ...formData, manufacturerSourceName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                Device Safety Category (Risk Class)
                <span title="Regulatory safety class that indicates inherent danger if the device fails." style={{ fontSize: '1rem' }}><Info className="w-5 h-5 text-blue-500" /></span>
              </label>
              <div className="text-xs text-gray-500 mb-1">Higher categories usually mean more life-critical devices.</div>
              <div className="text-xs text-gray-400 mb-2">
                <span className="block">Low Risk (Class I) – e.g., surgical gloves, bandages</span>
                <span className="block">Moderate Risk (Class II) – e.g., infusion pumps, ventilators</span>
                <span className="block">High Risk (Class III) – e.g., pacemakers, heart valves</span>
              </div>
              <select
                value={formData.riskClass}
                onChange={(e) => setFormData({ ...formData, riskClass: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold"
                required
              >
                <option value="" className="font-normal">Select risk category</option>
                {RISK_CLASS_LABELS.map(option => (
                  <option key={option.value} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                Classification (Device Type)
                <span title="The functional or clinical category of the device."><Info className="w-4 h-4 text-blue-500" /></span>
              </label>
              <div className="text-xs text-gray-500 mb-1">Certain device types (like cardiac implants) have historically higher severity events.</div>
              <div className="text-xs text-gray-400 mb-2">Example: "Cardiac Device", "Orthopedic Implant", "Diagnostic Imaging Device"</div>
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
              <div className="flex items-center gap-2 mb-2">
                <span className="block text-sm font-medium text-gray-700">Device is Implanted (Yes/No)</span>
                <span title="Whether the device is permanently placed inside a patient’s body."><Info className="w-4 h-4 text-blue-500" /></span>
              </div>
              <div className="text-xs text-gray-500 mb-1">Implanted devices pose much higher risk because failures are harder to correct.</div>
              <div className="text-xs text-gray-400 mb-2">
                <span className="block">Yes: Pacemaker, hip implant</span>
                <span className="block">No: Blood pressure monitor, ventilator</span>
              </div>
              <Toggle
                label=""
                checked={formData.implanted}
                onChange={(checked) => setFormData({ ...formData, implanted: checked })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                Quantity in Commerce: {formData.quantityInCommerce.toLocaleString()}
                <span title="Set the total number of devices available in the market."><Info className="w-4 h-4 text-blue-500" /></span>
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
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                Country
                <span title="Select the country where the device is marketed or used."><Info className="w-4 h-4 text-blue-500" /></span>
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                Parent Company
                <span title="Enter the name of the parent company, if applicable."><Info className="w-4 h-4 text-blue-500" /></span>
              </label>
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
        {/* Summary Panel removed. Input summary will be shown in Prediction Analysis only. */}
      </div>

      {/* Results */}
      <div className="lg:col-span-3">
        <Card title="Prediction Analysis">
          {result ? (
            <div className="space-y-8">

              {/* Predicted Class & Chart */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4 shadow">
                  <h3 className="text-lg font-bold text-gray-700 mb-2">Predicted Risk Category</h3>
                  <div className="flex items-center gap-3 mb-2">
                    <RiskBadge riskClass={result.pred_class} size="lg" />
          
                  </div>
                  <div className="text-xs text-gray-500">This prediction provides an early warning of potential device recall severity, helping improve patient safety, reduce risks, and support proactive decision-making.</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow">
                  <h3 className="text-lg font-bold text-gray-700 mb-2">Probability Distribution</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
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
              </div>

              {/* Confidence & Historical Data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-4 flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Model Accuracy</p>
                    <p className="text-2xl font-bold text-blue-700">{(0.89 * 100).toFixed(1)}%</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-3">
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

              {/* Prediction Description Section */}
              <div className="bg-white rounded-lg p-4 mt-4 border-l-4 border-blue-400">
                <h4 className="font-semibold text-blue-700 mb-2">Prediction</h4>
                <div className={`text-lg font-bold mb-2 ${
                  result.pred_class === 'CLASS I' ? 'text-red-600' :
                  result.pred_class === 'CLASS II' ? 'text-orange-600' :
                  result.pred_class === 'CLASS III' ? 'text-green-600' :
                  'text-gray-800'
                }`}>
                  Prediction: Likely Recall Severity → {result.pred_class}
                </div>
                <div className={`text-sm mb-4 ${
                  result.pred_class === 'CLASS I' ? 'text-red-500' :
                  result.pred_class === 'CLASS II' ? 'text-orange-700' :
                  result.pred_class === 'CLASS III' ? 'text-green-700' :
                  'text-gray-700'
                }`}>
                  (If recalled, most probable risk level is {result.pred_class})
                </div>
                <details className="mb-4">
                  <summary className="cursor-pointer font-semibold text-blue-600">🔽 Learn More</summary>
                  <div className="mt-2 text-sm text-gray-700">
                    This prediction is based on device safety category, type, market size, and manufacturer history.<br />
                    <ul className="list-disc pl-5 my-2">
                      <li>Class I → Highest severity (serious or life-threatening).</li>
                      <li>Class II → Moderate severity (temporary/reversible harm).</li>
                      <li>Class III → Lowest severity (unlikely to cause harm).</li>
                    </ul>
                    ⚡ This provides an early signal for buyers, hospitals, and regulators to prepare better — it does not replace FDA/EMA official classification.
                  </div>
                </details>
                <div className="mt-2 text-sm text-gray-700">
                  <span className="font-semibold">📌 Why this matters:</span>
                  <ul className="list-disc pl-5 my-2">
                    <li>Risk Class → Shows the device’s baseline safety profile.</li>
                    <li>Device Type → Identifies the clinical role (e.g., cardiac device, ventilator).</li>
                    <li>Quantity in Commerce → Tells how many units are at risk if something goes wrong.</li>
                    <li>Manufacturer History → Past recalls/issues hint at future reliability.</li>
                  </ul>
                  By combining these inputs, the model predicts how severe a future recall could be, learning from thousands of past recall patterns.
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