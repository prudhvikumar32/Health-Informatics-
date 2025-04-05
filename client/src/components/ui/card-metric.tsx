import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MetricCardData } from '@shared/types';

interface CardMetricProps {
  data: MetricCardData;
}

const CardMetric: React.FC<CardMetricProps> = ({ data }) => {
  const { title, value, change, trend, icon, iconBgColor, iconColor } = data;
  
  return (
    <Card className="bg-white overflow-hidden shadow rounded-lg">
      <CardContent className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${iconBgColor}`}>
            <i className={`${icon} ${iconColor} text-xl`}></i>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
                <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                  <i className={`fas fa-arrow-${trend} mr-1`}></i>
                  <span>{change}</span>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardMetric;
